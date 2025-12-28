document.addEventListener('DOMContentLoaded', () => {
  setupActiveSectionIndicator();
  setupContactForm();
  setupAsciiHint();
});

function setupActiveSectionIndicator() {
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  if (!navLinks.length || !('IntersectionObserver' in window)) return;

  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { threshold: 0.55 }
  );

  sections.forEach(section => observer.observe(section));
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const human = document.getElementById('human');
  if (!form || !status || !human) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = '';
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
      status.textContent = 'please complete the required fields.';
      return;
    }
    if (!human.checked) {
      status.textContent = 'please confirm the human check.';
      return;
    }
    status.textContent = 'message queued (demo)';
    form.reset();
  });
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
