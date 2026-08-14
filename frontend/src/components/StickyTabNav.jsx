// src/components/StickyTabNav.jsx
// Editorial sticky horizontal tab navigation.
// Sticks to top after scrolling past hero; active tab tracked via IntersectionObserver.
import { useEffect, useState } from 'react';

function StickyTabNav({ tabs }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id || '');

  // Track which section is in view
  useEffect(() => {
    const sectionEls = tabs
      .map(t => document.getElementById(t.id))
      .filter(Boolean);

    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first entry that is intersecting (topmost visible section)
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when section is within the top 40% of viewport
        rootMargin: '-80px 0px -55% 0px',
        threshold:  0,
      }
    );

    sectionEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [tabs]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Account for sticky nav height (~56px) + fixed top navbar (~64px)
    const offset = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: offset, behavior: 'smooth' });
    setActiveId(id);
  };

  return (
    <nav className="ed-tab-nav" aria-label="Page sections">
      <div className="ed-tab-nav-inner">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`ed-tab-btn ${activeId === tab.id ? 'ed-tab-btn--active' : ''}`}
            onClick={() => scrollToSection(tab.id)}
            aria-current={activeId === tab.id ? 'true' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default StickyTabNav;
