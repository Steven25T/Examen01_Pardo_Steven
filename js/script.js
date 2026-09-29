/* =========================================================
   UEM San Francisco de Quito — Monitor de frecuencia cardíaca
   Script general del sitio
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Menú responsive (hamburguesa) en las páginas internas ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('open');
    });
  }

  /* ---- Resaltar el enlace activo del menú superior ---- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---- Portada -> Menú principal (solo existe en index.html) ---- */
  var portada = document.getElementById('portada');
  var menu = document.getElementById('menu');
  var btnBienvenido = document.getElementById('btn-bienvenido');
  var btnVolverPortada = document.getElementById('btn-volver-portada');

  function mostrarMenu() {
    if (!portada || !menu) return;
    portada.classList.add('is-hidden');
    menu.classList.remove('is-hidden');
    window.scrollTo(0, 0);
    history.replaceState(null, '', '#menu');
  }

  function mostrarPortada() {
    if (!portada || !menu) return;
    menu.classList.add('is-hidden');
    portada.classList.remove('is-hidden');
    window.scrollTo(0, 0);
    history.replaceState(null, '', window.location.pathname);
  }

  // Si llegamos a index.html#menu (por ejemplo desde "Menú principal"
  // en una página interna), mostramos el menú directamente.
  if (portada && menu) {
    if (window.location.hash === '#menu') {
      portada.classList.add('is-hidden');
      menu.classList.remove('is-hidden');
    } else {
      menu.classList.add('is-hidden');
    }
  }

  if (btnBienvenido) btnBienvenido.addEventListener('click', mostrarMenu);
  if (btnVolverPortada) btnVolverPortada.addEventListener('click', mostrarPortada);

  /* ---- Revelado suave de tarjetas y bloques al hacer scroll ---- */
  var revealTargets = document.querySelectorAll(
    '.menu-card, .componente-card, .paso, .lista-conclusiones li, .panel, .circuito-grid > *, .circuito-embed'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

});
