const items = Array.from(document.querySelectorAll('.masonry-item img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

const closeBtn = document.querySelector('.lightbox-close');
const nextBtn = document.querySelector('.lightbox-next');
const prevBtn = document.querySelector('.lightbox-prev');

let current = 0;

function openLightbox(index) {
  current = index;
  // Prende l'immagine HD se c'è, altrimenti quella piccola
  const bigSrc = items[current].dataset.full || items[current].src;
  
  lightboxImg.src = bigSrc;
  lightbox.style.display = 'flex'; // Importante: deve essere flex per centrare
  document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina sotto
}

function closeLightbox() {
  lightbox.style.display = 'none';
  lightboxImg.src = ''; // Pulisce l'immagine
  document.body.style.overflow = ''; // Riattiva lo scroll
}

// Event Listeners sulle immagini della galleria
items.forEach((img, index) => {
  img.addEventListener('click', () => openLightbox(index));
});

// Navigazione
nextBtn.onclick = (e) => {
  e.stopPropagation(); // Evita che il click si propaghi allo sfondo
  current = (current + 1) % items.length;
  openLightbox(current);
};

prevBtn.onclick = (e) => {
  e.stopPropagation();
  current = (current - 1 + items.length) % items.length;
  openLightbox(current);
};

closeBtn.onclick = closeLightbox;

// Chiudi cliccando sullo sfondo nero (ma non sull'immagine)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
    closeLightbox();
  }
});

// Tastiera
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'Escape') closeLightbox();
  }
});