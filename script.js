// CATEGORY FILTERING
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', function() {
    const category = this.dataset.category;
    // For demo purposes, we'll filter based on alt text containing category keywords
    document.querySelectorAll('.gallery .card').forEach(galleryCard => {
      const alt = galleryCard.querySelector('img').alt.toLowerCase();
      const shouldShow = alt.includes(category) || category === 'all';
      galleryCard.style.display = shouldShow ? 'block' : 'none';
    });
    // Highlight selected category
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

// MODAL ENHANCED
function openModal(card){
  const imgSrc = card.querySelector('img').src;
  const imgAlt = card.querySelector('img').alt;
  document.getElementById('modalImg').src = imgSrc;
  document.getElementById('modalImg').alt = imgAlt;
  const downloadBtn = document.getElementById('modalDownload');
  downloadBtn.setAttribute('href', imgSrc);
  downloadBtn.setAttribute('download', imgAlt.replace('Wallpaper ', 'wallpaper') + '.jpg');
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeModal(){
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore scroll
}

// Close modal on outside click
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('modal').classList.contains('active')) {
    closeModal();
  }
});

// FREE DOWNLOAD BUTTON
document.querySelectorAll('.btn-download').forEach(btn=>{
  btn.addEventListener('click', async function(e){
    e.preventDefault();
    const imageUrl = this.dataset.image || this.href;
    const fileName = this.dataset.name || 'wallpaper.jpg';
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fileName; document.body.appendChild(a); a.click();
      a.remove(); URL.revokeObjectURL(url);
    } catch(err){ alert('Download failed!'); }
  });
});

// MINIMIZE/EXPAND GALLERY
const gallery = document.getElementById('gallery');
document.getElementById('toggleGallery').addEventListener('click', ()=>{
  gallery.style.display = (gallery.style.display==='none')?'grid':'none';
});

// SEARCH FILTER
document.getElementById('searchInput').addEventListener('input', function(){
  const value = this.value.toLowerCase();
  document.querySelectorAll('.gallery .card').forEach(card=>{
    const alt = card.querySelector('img').alt.toLowerCase();
    card.style.display = alt.includes(value)?'block':'none';
  });
});

// PROMO SLIDER AUTO-SCROLL
const slider = document.querySelector('.promo-slider');
let scrollAmount = 0;
const slideWidth = 320; // Approximate width of each slide
setInterval(()=>{
  scrollAmount += slideWidth;
  if(scrollAmount >= slider.scrollWidth - slider.clientWidth) scrollAmount = 0;
  slider.scrollTo({left:scrollAmount, behavior:'smooth'});
}, 3500); // Slightly faster for 7 slides
