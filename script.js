// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Lightbox for artwork tiles
const dialog = document.getElementById('lightbox');
const dialogImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.lightbox__close');

function openLightbox(src, alt){
  if (!dialog || !dialogImg) return;
  dialogImg.src = src;
  dialogImg.alt = alt || 'Artwork';
  dialog.showModal();
}

document.querySelectorAll('[data-lightbox="art"]').forEach(el => {
  el.addEventListener('click', () => {
    const img = el.querySelector('img');
    if (!img) return;
    openLightbox(img.src, img.alt);
  });
});

closeBtn?.addEventListener('click', () => dialog?.close());

dialog?.addEventListener('click', (e) => {
  const rect = dialog.getBoundingClientRect();
  const inside = rect.top <= e.clientY && e.clientY <= rect.top + rect.height
              && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
  if (!inside) dialog.close();
});