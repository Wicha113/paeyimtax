/* ============================================
   แป๊ะยิ้มเล่าเรื่อง — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === Scroll Progress Bar ===
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';
  }

  // === Navbar scroll effect ===
  const navbar = document.getElementById('navbar');
  function handleNavbar() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    handleNavbar();
  }, { passive: true });

  // === Hamburger / Mobile Nav ===
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // === Reveal on Scroll (Intersection Observer) ===
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // === Animated Number Counter ===
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const current = eased * target;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // === Cursor Glow (desktop only) ===
  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  // === Payment Modal ===
  const modalOverlay = document.getElementById('payment-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
  const paymentTriggers = document.querySelectorAll('[data-payment]');

  function openPaymentModal(productName, price) {
    if (!modalOverlay) return;
    const titleEl = document.getElementById('modal-product-name');
    const priceEl = document.getElementById('modal-product-price');
    if (titleEl) titleEl.textContent = productName || '';
    if (priceEl) priceEl.textContent = price || '';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  paymentTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.dataset.product || 'คอร์สภาษี';
      const price = btn.dataset.price || '';
      openPaymentModal(name, price);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closePaymentModal);
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closePaymentModal();
    });
  }

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePaymentModal();
  });

  // === Payment Tabs ===
  const paymentTabs = document.querySelectorAll('.payment-tab');
  const paymentContents = document.querySelectorAll('.payment-content');

  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('active'));
      paymentContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // === Appointment Form ===
  const apptForm = document.getElementById('appt-form');
  const formSuccess = document.getElementById('form-success');

  if (apptForm) {
    apptForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = apptForm.querySelector('.btn-submit');
      btn.textContent = 'กำลังส่ง...';
      btn.disabled = true;

      try {
        const response = await fetch(apptForm.action, {
          method: 'POST',
          body: new FormData(apptForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          apptForm.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
        } else {
          btn.textContent = 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง';
        btn.disabled = false;
      }
    });
  }

  // === Smooth scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // === Hero parallax orbs ===
  const orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = i === 0 ? 0.15 : 0.08;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // === Image Sliders ===
  document.querySelectorAll('.img-slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide-img');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');

    if (!track || slides.length < 2) return;

    let current = 0;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
    nextBtn?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  });

  // === Active nav link highlight ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav a[href^="#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const offset = sec.offsetTop - 100;
      if (window.scrollY >= offset) {
        current = '#' + sec.id;
      }
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === current ? 'var(--gold)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

});
