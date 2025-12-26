document.addEventListener('DOMContentLoaded', () => {
  setupActiveSectionIndicator();
  setupBlogModal();
  setupContactForm();
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

function setupBlogModal() {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalDate = document.getElementById('modal-date');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');
  const triggers = document.querySelectorAll('.blog-open');
  if (!modal || !closeBtn || !backdrop || !modalTitle || !modalContent || !modalDate) return;

  let previousFocus = null;

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  const trapFocus = event => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(modal.querySelectorAll(focusableSelector)).filter(
      el => el.offsetParent !== null
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleKeyClose = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
    }
  };

  const openModal = trigger => {
    previousFocus = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');

    modalTitle.textContent = trigger.dataset.title || 'Untitled post';
    modalDate.textContent = trigger.dataset.date || '';
    modalContent.textContent = trigger.dataset.content || 'Placeholder content.';

    modal.addEventListener('keydown', trapFocus);
    document.addEventListener('keydown', handleKeyClose);
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('keydown', trapFocus);
    document.removeEventListener('keydown', handleKeyClose);
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  };

  triggers.forEach(button => {
    button.addEventListener('click', () => openModal(button));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
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
