/**
 * DPS GENIUS | GALLERY & LIGHTBOX JAVASCRIPT
 * Handles category filtering, lightbox viewer, modal transitions,
 * touch gestures, and keyboard navigation (Left/Right/Esc).
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 2. LIGHTBOX MODAL FUNCTIONALITY
  // --------------------------------------------------------------------------
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let activeIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;

    activeIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    if (!visibleItems[activeIndex]) return;

    const currentItem = visibleItems[activeIndex];
    const imgEl = currentItem.querySelector('img');
    const titleEl = currentItem.querySelector('.gallery-item-title') || currentItem.querySelector('h4');
    const categoryEl = currentItem.querySelector('.gallery-category-pill');

    const src = imgEl ? (imgEl.getAttribute('data-full') || imgEl.getAttribute('src')) : '';
    const caption = titleEl ? titleEl.textContent : (imgEl ? imgEl.alt : '');
    const category = categoryEl ? ` [${categoryEl.textContent}]` : '';

    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = caption;
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = `${caption}${category}`;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${activeIndex + 1} / ${visibleItems.length}`;
    }
  }

  function showNext() {
    visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;
    activeIndex = (activeIndex + 1) % visibleItems.length;
    updateLightboxContent();
  }

  function showPrev() {
    visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;
    activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
  }

  // Attach click listeners to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const clickedIndex = visibleItems.indexOf(item);
      if (clickedIndex !== -1) {
        openLightbox(clickedIndex);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  // Close when clicking outside image box
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNext();
    else if (e.key === 'ArrowLeft') showPrev();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });
});

