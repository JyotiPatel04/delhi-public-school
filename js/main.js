/**
 * DPS GENIUS | MAIN JAVASCRIPT
 * Core website interactivity, sticky navigation, mobile menu,
 * scroll reveals, testimonial slider, FAQ accordion, and stats counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STICKY HEADER & SCROLL BEHAVIOR
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header shadow on scroll
    if (header) {
      if (scrollPos > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let navBackdrop = document.querySelector('.nav-backdrop');

  // Create backdrop inside header if not present
  if (!navBackdrop && navMenu) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    if (header) {
      header.appendChild(navBackdrop);
    } else {
      document.body.appendChild(navBackdrop);
    }
  }

  function toggleMenu() {
    const isOpen = navMenu && navMenu.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    if (mobileToggle) mobileToggle.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    if (header) header.classList.add('menu-open');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (header) header.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  // Mobile drawer dedicated close button
  document.addEventListener('click', (e) => {
    if (e.target.closest('.drawer-close-btn')) {
      closeMenu();
    }
  });

  // Close mobile drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Auto-close drawer if resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && navMenu && navMenu.classList.contains('active')) {
      closeMenu();
    }
  }, { passive: true });

  // Mobile dropdown submenu toggling
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          item.classList.toggle('dropdown-open');
        }
      });
    }
  });

  // Close mobile menu when a direct link is clicked
  const navLinks = document.querySelectorAll('.nav-link:not(.has-dropdown-toggle), .dropdown-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeMenu();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. ACTIVE NAVIGATION LINK DETECTION
  // --------------------------------------------------------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      const parentItem = link.closest('.nav-item');
      if (parentItem) {
        parentItem.classList.add('active');
      }
    }
  });

  // --------------------------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. STATS COUNTER ANIMATION
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetValue = parseInt(target.getAttribute('data-target'), 10);
          const suffix = target.getAttribute('data-suffix') || '';
          const prefix = target.getAttribute('data-prefix') || '';
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOutProgress * targetValue);

            target.textContent = `${prefix}${currentCount}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.textContent = `${prefix}${targetValue}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

  // --------------------------------------------------------------------------
  // 6. TESTIMONIALS SLIDER
  // --------------------------------------------------------------------------
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const track = carousel.querySelector('.testimonial-track');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayInterval = null;

    // Create dot indicators
    if (dotsContainer && totalSlides > 1) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      const dots = carousel.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      updateSlider();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Touch swipe support
    let startX = 0;
    let endX = 0;
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    // Autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  // --------------------------------------------------------------------------
  // 7. FAQ ACCORDION
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Optional: close other open items for clean single accordion
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBody = otherItem.querySelector('.faq-body');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // Open the first FAQ item by default if available
  if (faqItems.length > 0) {
    const firstBody = faqItems[0].querySelector('.faq-body');
    if (firstBody) {
      faqItems[0].classList.add('active');
      firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
    }
  }

  // --------------------------------------------------------------------------
  // 8. HERO CONTINUOUS BANNER SLIDER (AUTOPLAY)
  // --------------------------------------------------------------------------
  const heroSliderTrack = document.getElementById('hero-slider-track');
  if (heroSliderTrack) {
    const slides = heroSliderTrack.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.hero-prev-btn');
    const nextBtn = document.querySelector('.hero-next-btn');
    const dotsContainer = document.getElementById('hero-slider-dots');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideTimer = null;
    const slideDuration = 4500; // 4.5 seconds per slide for smooth continuous sliding

    // Generate dots
    if (dotsContainer && totalSlides > 1) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `hero-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i);
          startAutoSlide();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlides() {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
      });
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      updateSlides();
    }

    function nextHeroSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevHeroSlide() {
      goToSlide(currentSlide - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextHeroSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevHeroSlide();
        startAutoSlide();
      });
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextHeroSlide, slideDuration);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    // Pause on hover
    const heroSection = document.querySelector('.hero-slider-section');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoSlide);
      heroSection.addEventListener('mouseleave', startAutoSlide);

      // Touch swipe support for mobile devices
      let touchStartX = 0;
      let touchEndX = 0;
      heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) nextHeroSlide();
          else prevHeroSlide();
        }
        startAutoSlide();
      }, { passive: true });
    }

    // Start auto-slide immediately
    startAutoSlide();
  }
});

