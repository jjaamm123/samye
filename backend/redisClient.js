/**
 * redisClient.js
 * Fail-open Redis client — if Redis is not configured or unreachable,
 * all cache operations become no-ops so the app keeps working normally.
 */
const { createClient } = require('redis');

let client = null;
let isReady = false;

async function getClient() {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) {
    // No Redis URL configured — silently skip caching
    return null;
  }

  client = createClient({ url });

  client.on('error', (err) => {
    // Log but do NOT crash — degrade gracefully
    console.warn('[Redis] Connection error (cache disabled):', err.message);
    isReady = false;
  });

  client.on('ready', () => {
    isReady = true;
    console.log('[Redis] Connected and ready.');
  });

  try {
    await client.connect();
  } catch (err) {
    console.warn('[Redis] Could not connect (cache disabled):', err.message);
    client = null;
  }

  return client;
}

/** Safe get — returns null on any error */
async function cacheGet(key) {
  try {
    const c = await getClient();
    if (!c || !isReady) return null;
    return await c.get(key);
  } catch {
    return null;
  }
}

/** Safe setEx — silently swallows errors */
async function cacheSet(key, ttlSeconds, value) {
  try {
    const c = await getClient();
    if (!c || !isReady) return;
    await c.setEx(key, ttlSeconds, value);
  } catch {
    // ignore
  }
}

/** Safe delete by exact key */
async function cacheDel(key) {
  try {
    const c = await getClient();
    if (!c || !isReady) return;
    await c.del(key);
  } catch {
    // ignore
  }
}

/** Delete all keys matching a glob pattern (SCAN-based, safe for production) */
async function cacheDelPattern(pattern) {
  try {
    const c = await getClient();
    if (!c || !isReady) return;
    for await (const keys of c.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      if (keys.length) await c.del(keys);
    }
  } catch {
    // ignore
  }
}

module.exports = { cacheGet, cacheSet, cacheDel, cacheDelPattern };
