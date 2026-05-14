document.addEventListener('DOMContentLoaded', () => {
  setupActiveSectionIndicator();
  setupAsciiHint();
  setupProjectCardReveal();
});

function setupActiveSectionIndicator() {
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'))
    .filter(link => link.getAttribute('href')?.startsWith('#'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map(link => {
      const target = document.querySelector(link.getAttribute('href'));
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  const setActive = activeLink => {
    navLinks.forEach(a => a.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
  };

  let ticking = false;
  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const bottomOffset = 8;
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - bottomOffset;
      if (isAtBottom) {
        setActive(sections[sections.length - 1]?.link);
        ticking = false;
        return;
      }

      const scrollPos = window.scrollY + 180;
      let current = sections[0];
      sections.forEach(item => {
        const rect = item.target.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top <= scrollPos) {
          current = item;
        }
      });
      setActive(current?.link);
      ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  handleScroll();
}

function setupAsciiHint() {
  const asciiLink = document.querySelector('.ascii-link');
  if (!asciiLink) return;

  const hint = document.createElement('div');
  hint.className = 'ascii-hint';
  hint.textContent = 'click to find out more';
  document.body.appendChild(hint);

  const showHint = () => {
    hint.style.opacity = '1';
  };

  const hideHint = () => {
    hint.style.opacity = '0';
  };

  const moveHint = event => {
    const offset = 12;
    hint.style.left = `${event.clientX + offset}px`;
    hint.style.top = `${event.clientY + offset}px`;
  };

  asciiLink.addEventListener('mouseenter', showHint);
  asciiLink.addEventListener('mouseleave', hideHint);
  asciiLink.addEventListener('mousemove', moveHint);
  asciiLink.addEventListener('focus', showHint);
  asciiLink.addEventListener('blur', hideHint);
}

function setupProjectCardReveal() {
  const cards = Array.from(document.querySelectorAll('.card'));
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('is-visible'));
    return;
  }

  cards.forEach(card => card.classList.add('is-reveal-ready'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(card => observer.observe(card));
}
