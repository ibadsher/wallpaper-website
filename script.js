// Initialize event listeners for download buttons and cards
document.addEventListener('DOMContentLoaded', function() {
  const downloadButtons = document.querySelectorAll('.btn-download');
  const cards = document.querySelectorAll('.card');
  
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const imageUrl = this.getAttribute('data-image');
      const fileName = this.getAttribute('data-name');
      downloadImage(this, imageUrl, fileName);
    });
    
    // Add keyboard accessibility
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Touch device support - toggle overlay on card click/touch
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-download')) return;
      
      // Only toggle on touch devices
      if (window.matchMedia('(hover: none)').matches) {
        this.classList.toggle('active');
      }
    });
    
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && window.matchMedia('(hover: none)').matches) {
        this.classList.toggle('active');
      }
    });
  });
});

async function downloadImage(button, imageUrl, fileName) {
  // Validate inputs
  if (!imageUrl || !fileName) {
    console.error('Missing image URL or file name');
    alert('Download configuration error.');
    return;
  }
  
  const originalText = button.textContent;
  
  try {
    button.classList.add('downloading');
    button.disabled = true;
    button.textContent = 'Downloading...';
    
    // Try to fetch as blob for better compatibility
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Show success
    button.textContent = 'Downloaded!';
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      button.classList.remove('downloading');
      button.disabled = false;
      button.textContent = originalText;
    }, 1500);
    
  } catch (error) {
    console.error('Error downloading image:', error);
    button.textContent = 'Download Failed';
    button.classList.remove('downloading');
    button.disabled = false;
    
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
    
    alert('Failed to download image. Please try again.');
  }
}