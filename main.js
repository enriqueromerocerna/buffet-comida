/* ═══════════════════════════════════════════════
   GADLY CATERING — main.js
   ═══════════════════════════════════════════════ */

/* ── Navbar: sombra al hacer scroll ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    nav.style.boxShadow = '0 4px 24px rgba(62,37,34,0.12)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

/* ── Animación de entrada con IntersectionObserver ── */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

/* Aplicar a tarjetas y secciones */
document.querySelectorAll(
  '.feature-card, .blog-card, .cta-split-text, .cta-split-img, .section-title, .section-label'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
  observer.observe(el);
});

/* Clase visible */
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);

/* ── Smooth scroll para links del nav ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Botón "Reservar": alerta simple ── */
document.querySelector('.nav-cta').addEventListener('click', () => {
  alert('¡Gracias por tu interés! Contáctanos al +51 987 654 321 para hacer tu reserva.');
});
