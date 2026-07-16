/* ============================================================
   LIGHTBOX
   Richiede nel CSS: .lightbox { display:none } e .lightbox.is-open { display:flex }
   (niente più display inline via JS)
   ============================================================ */

(() => {
  const lightbox = document.getElementById('lightbox');
  const grid = document.querySelector('.masonry');
  if (!lightbox || !grid) return;

  const items = Array.from(grid.querySelectorAll('.masonry-item img'));
  if (!items.length) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn  = lightbox.querySelector('.lightbox-prev');
  const nextBtn  = lightbox.querySelector('.lightbox-next');
  const focusables = [closeBtn, prevBtn, nextBtn];

  let current = 0;
  let isOpen = false;
  let lastFocused = null;
  let scrollY = 0;

  // Usa data-full se c'è (versione grande), altrimenti quella della griglia
  const fullSrc = (img) => img.dataset.full || img.currentSrc || img.src;

  // Scarica in anticipo la foto successiva e precedente: la navigazione diventa istantanea
  const preload = (i) => {
    const img = items[(i + items.length) % items.length];
    if (img) new Image().src = fullSrc(img);
  };

  function show(index) {
    current = (index + items.length) % items.length;
    const img = items[current];
    lightboxImg.src = fullSrc(img);
    lightboxImg.alt = img.alt || '';
    preload(current + 1);
    preload(current - 1);
  }

  function open(index) {
    if (isOpen) return;
    lastFocused = document.activeElement;

    // Blocco scroll robusto (body.style.overflow non basta su iOS)
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    isOpen = true;
    closeBtn.focus();
  }

  function close() {
    if (!isOpen) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    isOpen = false;

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);

    if (lastFocused) lastFocused.focus();
  }

  const next = () => show(current + 1);
  const prev = () => show(current - 1);

  // --- Griglia: click + tastiera ---
  items.forEach((img, i) => {
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', `Open image ${i + 1} of ${items.length}`);

    img.addEventListener('click', () => open(i));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  // --- Bottoni ---
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // --- Click sullo sfondo per chiudere ---
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // --- Tastiera globale + focus trap ---
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); return; }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); return; }

    // Tab non deve poter uscire dal lightbox
    if (e.key === 'Tab') {
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  // --- Swipe su mobile ---
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    touchX = null;
  }, { passive: true });
})();