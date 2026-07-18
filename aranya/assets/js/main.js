// ==========================================================================
// MANTHAN HOSPITALITY — shared behaviors
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- nav: solid on scroll ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('is-open');
      const open = links.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
    });
    // mobile dropdown accordion
    document.querySelectorAll('.nav-dropdown > a').forEach(a => {
      a.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          a.parentElement.classList.toggle('is-open');
        }
      });
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 900 && !a.parentElement.classList.contains('nav-dropdown')) {
          links.classList.remove('is-open');
          document.documentElement.style.overflow = '';
        }
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- testimonial carousel ---------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsWrap = document.querySelector('.testimonial-dots');
  if (slides.length) {
    let active = 0;
    const dots = [];
    slides.forEach((s, i) => {
      if (dotsWrap) {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        if (i === 0) b.classList.add('is-active');
        b.addEventListener('click', () => show(i));
        dotsWrap.appendChild(b);
        dots.push(b);
      }
    });
    function show(i) {
      slides[active].classList.remove('is-active');
      if (dots[active]) dots[active].classList.remove('is-active');
      active = i;
      slides[active].classList.add('is-active');
      if (dots[active]) dots[active].classList.add('is-active');
    }
    slides[0].classList.add('is-active');
    let timer = setInterval(() => show((active + 1) % slides.length), 6500);
    const wrap = document.querySelector('.testimonial-wrap');
    if (wrap) {
      wrap.addEventListener('mouseenter', () => clearInterval(timer));
      wrap.addEventListener('mouseleave', () => { timer = setInterval(() => show((active + 1) % slides.length), 6500); });
    }
  }

  /* ---------- gallery lightbox ---------- */
  const galleryFigs = document.querySelectorAll('[data-gallery] figure');
  const lightbox = document.querySelector('.lightbox');
  if (galleryFigs.length && lightbox) {
    const lbImg = lightbox.querySelector('img');
    const items = Array.from(galleryFigs);
    let idx = 0;
    function open(i) {
      idx = i;
      const img = items[idx].querySelector('img');
      lbImg.src = img.getAttribute('data-full') || img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('is-open');
      document.documentElement.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('is-open');
      document.documentElement.style.overflow = '';
    }
    items.forEach((fig, i) => fig.addEventListener('click', () => open(i)));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    const prev = lightbox.querySelector('.lightbox-prev');
    const next = lightbox.querySelector('.lightbox-next');
    if (prev) prev.addEventListener('click', () => open((idx - 1 + items.length) % items.length));
    if (next) next.addEventListener('click', () => open((idx + 1) % items.length));
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && next) next.click();
      if (e.key === 'ArrowLeft' && prev) prev.click();
    });
  }

  /* ---------- gallery filter tabs ---------- */
  const filterTabs = document.querySelectorAll('[data-filter]');
  if (filterTabs.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const val = tab.getAttribute('data-filter');
        document.querySelectorAll('[data-gallery] figure').forEach(fig => {
          const show = val === 'all' || fig.getAttribute('data-cat') === val;
          fig.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- forms: graceful fake-submit (no backend in this build) ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus({ preventScroll: true });
      }
      form.reset();
    });
  });

});
