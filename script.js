const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const form = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const resetInitialScroll = () => {
  if (window.location.hash) return;
  window.scrollTo(0, 0);
};

resetInitialScroll();
window.addEventListener('pageshow', () => {
  requestAnimationFrame(resetInitialScroll);
});
window.addEventListener('load', () => {
  [0, 120, 400].forEach((delay) => {
    window.setTimeout(() => {
      if (!window.location.hash && window.scrollY < 320) resetInitialScroll();
    }, delay);
  });
});

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
const closeMenu = () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (event) => {
  if (!nav.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1120) closeMenu();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  const subject = encodeURIComponent(`Website enquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nWork email: ${email}\n\nProject enquiry:\n${message}`
  );

  formStatus.textContent = 'Opening your email app to send the enquiry…';
  window.location.href = `mailto:Airmech@airmechoman.com?subject=${subject}&body=${body}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
