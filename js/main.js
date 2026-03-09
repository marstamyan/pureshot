/* ════════════════════════════════════════════════
   PureShot — Alex Morgan Photography
   main.js
════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     AOS — Animate on Scroll
  ────────────────────────────────────────── */
  AOS.init({
    duration: 850,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
  });

  /* ──────────────────────────────────────────
     GLightbox — Gallery Lightbox
  ────────────────────────────────────────── */
  GLightbox({
    touchNavigation: true,
    loop: true,
    animationSpeed: 350,
    zoomable: true,
  });

  /* ──────────────────────────────────────────
     Navbar — Scroll Behaviour
  ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ──────────────────────────────────────────
     Mobile Menu (Hamburger)
  ────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ──────────────────────────────────────────
     Parallax — Hero image & Services bg
  ────────────────────────────────────────── */
  const heroImgWrap = document.getElementById('heroImgWrap');
  const servicesBg  = document.getElementById('servicesParallax');

  const updateParallax = () => {
    const sy = window.scrollY;

    // Subtle upward drift on the hero photo
    if (heroImgWrap) {
      heroImgWrap.style.transform = `translateY(${sy * 0.1}px)`;
    }

    // Services parallax background
    if (servicesBg) {
      const rect   = servicesBg.parentElement.getBoundingClientRect();
      const offset = -(rect.top * 0.28);
      servicesBg.style.transform = `translateY(${offset}px)`;
    }
  };

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* ──────────────────────────────────────────
     Gallery Filter
  ────────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide items
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.classList.contains(filter);
        if (match) {
          item.classList.remove('hidden');
          // Trigger reflow for animation
          item.classList.remove('appearing');
          void item.offsetWidth;
          item.classList.add('appearing');
        } else {
          item.classList.add('hidden');
          item.classList.remove('appearing');
        }
      });
    });
  });

  /* ──────────────────────────────────────────
     Stats Counter Animation
  ────────────────────────────────────────── */
  const statNums  = document.querySelectorAll('.stat-number');
  let   statsRan  = false;

  const runCounter = el => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const fps      = 60;
    const steps    = (duration / 1000) * fps;
    const inc      = target / steps;
    let   cur      = 0;

    const tick = () => {
      cur = Math.min(cur + inc, target);
      el.textContent = Math.floor(cur);
      if (cur < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsRan) {
      statsRan = true;
      statNums.forEach(runCounter);
      statsObserver.disconnect();
    }
  }, { threshold: 0.4 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statsObserver.observe(statsBar);

  /* ──────────────────────────────────────────
     Skill Bars Animation
  ────────────────────────────────────────── */
  const skillBars = document.querySelectorAll('.skill-progress');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ──────────────────────────────────────────
     Testimonials Slider
  ────────────────────────────────────────── */
  const track       = document.getElementById('testimonialsTrack');
  const dotsWrap    = document.getElementById('sliderDots');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');

  if (track) {
    const cards  = track.querySelectorAll('.testimonial-card');
    const total  = cards.length;
    let   current = 0;
    let   timer;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.dot');

    const goTo = idx => {
      current = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 5200);
    };

    prevBtn.addEventListener('click', () => { goTo(current - 1); startTimer(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); startTimer(); });

    // Pause on hover
    const wrapper = document.querySelector('.testimonials-wrapper');
    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', startTimer);

    // Touch / swipe
    let touchX = 0;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) { goTo(diff > 0 ? current + 1 : current - 1); startTimer(); }
    });

    startTimer();
  }

  /* ──────────────────────────────────────────
     Contact Form (demo — no real submission)
  ────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      // Simple required-field check
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        }
      });
      if (!valid) return;

      // Simulate sending
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
          <circle cx="12" cy="12" r="10" stroke-dasharray="30 60"/>
        </svg> Sending…`;

      // Inject spin keyframe once
      if (!document.getElementById('spinStyle')) {
        const s = document.createElement('style');
        s.id = 'spinStyle';
        s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
        document.head.appendChild(s);
      }

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Send Message`;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 1600);
    });
  }

  /* ──────────────────────────────────────────
     Back to Top Button
  ────────────────────────────────────────── */
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ──────────────────────────────────────────
     Smooth Scroll — All anchor links
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = navbar.getBoundingClientRect().height;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────
     Active Nav Link on Scroll (highlight)
  ────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    let found = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) found = '#' + sec.id;
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === found ? 'var(--text)' : '';
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

});
