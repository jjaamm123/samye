const fs = require('fs');
let css = fs.readFileSync('src/App.css', 'utf8');
css = css.replace(/\.app-wrapper \{ width: 100%; overflow-x: hidden; \}/g, '.app-wrapper { width: 100%; overflow-x: clip; }');
fs.writeFileSync('src/App.css', css);
