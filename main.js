document.addEventListener('DOMContentLoaded', () => {
  setupActiveSectionIndicator();
  setupAsciiHint();
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
