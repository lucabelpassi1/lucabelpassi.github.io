document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll('.masonry-item img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const thumbsContainer = document.getElementById('lightbox-thumbs');

  const closeBtn = document.querySelector('.lightbox-close');
  const nextBtn = document.querySelector('.lightbox-next');
  const prevBtn = document.querySelector('.lightbox-prev');

  let current = 0;

  // 1. GENERA LE MINIATURE (Thumbnails)
  items.forEach((img, index) => {
    const thumb = document.createElement('img');
    thumb.src = img.src; // Usa la stessa sorgente della gallery (leggera)
    thumb.alt = `Thumb ${index}`;
    
    // Cliccando la miniatura, apri quella foto
    thumb.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita click indesiderati
      openLightbox(index);
    });

    thumbsContainer.appendChild(thumb);
  });

  const allThumbs = thumbsContainer.querySelectorAll('img');

  // FUNZIONE: APRI LIGHTBOX
  function openLightbox(index) {
    current = index;
    
    // Carica immagine grande (usa data-full se c'è, altrimenti src)
    const bigSrc = items[current].dataset.full || items[current].src;
    lightboxImg.src = bigSrc;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    updateActiveThumb();
  }

  // FUNZIONE: AGGIORNA MINIATURA ATTIVA
  function updateActiveThumb() {
    // Rimuovi classe active da tutte
    allThumbs.forEach(t => t.classList.remove('active-thumb'));
    
    // Aggiungi alla corrente
    if (allThumbs[current]) {
      allThumbs[current].classList.add('active-thumb');
      
      // Scrolla la striscia per tenere la miniatura al centro
      allThumbs[current].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = ''; 
    document.body.style.overflow = '';
  }

  // Event Listeners Immagini Gallery
  items.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  // Navigazione
  const showNext = (e) => {
    if(e) e.stopPropagation();
    current = (current + 1) % items.length;
    openLightbox(current);
  };

  const showPrev = (e) => {
    if(e) e.stopPropagation();
    current = (current - 1 + items.length) % items.length;
    openLightbox(current);
  };

  nextBtn.onclick = showNext;
  prevBtn.onclick = showPrev;
  closeBtn.onclick = closeLightbox;

  // Chiudi cliccando fuori
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Tastiera
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    }
  });
});