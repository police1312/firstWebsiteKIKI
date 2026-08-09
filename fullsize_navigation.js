//Switch to fullsize
function changeImage(element){
element.classList.toggle("fullsize");
}


// ZOOM IMAGE CODE
// ------------------- Image List -------------------
const zoom_images = [
  "website content batch2/billet20 raster.png",
  "website content batch2/chain raster.png",
  "website content batch2/keyfinal.png",
  "website content batch2/heart1.png",
  "website content batch2/skull raster.png",
  "website content batch2/human raster1.png",
  "website content batch2/eye raster.png",
  "website content batch2/spider raster.png",
  "website content batch2/fire raster.png",
  "website content batch2/nuage alpha1.png",
  "website content batch2/flower raster.png",
  "website content batch2/hair raster.png",
  "website content batch2/knife raster.png",
  "website content batch2/gun raster.png"
]; 
let zoom_currentIndex = 0;

const zoomImg = document.getElementById("zoom-img");  
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

// ------------------- Show Image -------------------
function showZoomImage(index) {
  zoom_currentIndex = (index + zoom_images.length) % zoom_images.length; // wrap around
  zoomImg.src = zoom_images[zoom_currentIndex];
  resetZoom();
}

leftBtn.addEventListener("click", () => showZoomImage(zoom_currentIndex - 1));
rightBtn.addEventListener("click", () => showZoomImage(zoom_currentIndex + 1));

// ------------------- Zoom + Drag -------------------
let zoomLevels = [1, 3, 5];  // adjust zoom levels here
let currentZoomIndex = 0;
let translateX = 0, translateY = 0;
let isDragging = false;
let dragged = false;
let startX, startY;

function updateTransform() {
  if (!zoomImg) return;

  const rect = zoomImg.getBoundingClientRect();
  const imgWidth = zoomImg.naturalWidth * zoomLevels[currentZoomIndex];
  const imgHeight = zoomImg.naturalHeight * zoomLevels[currentZoomIndex];

  const maxTranslateX = Math.max(0, imgWidth - rect.width);
  const maxTranslateY = Math.max(0, imgHeight - rect.height);

  // clamp translation so the image never moves out of view
  translateX = clamp(translateX, -maxTranslateX, 0);
  translateY = clamp(translateY, -maxTranslateY, 0);

  zoomImg.style.transform =
    `translate(${translateX}px, ${translateY}px) scale(${zoomLevels[currentZoomIndex]})`;
}
//  for value clamp of translate
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


function resetZoom() {
  currentZoomIndex = 0;
  translateX = 0;
  translateY = 0;
  zoomImg.style.transformOrigin = "0 0";
  zoomImg.style.transform = `translate(0px, 0px) scale(1)`;
  zoomImg.style.cursor = "zoom-in";
}

// ------------------- Click to Zoom -------------------
zoomImg.addEventListener("click", (e) => {
  e.preventDefault();

  if (dragged) {
    dragged = false;
    return;
  }

  const rect = zoomImg.getBoundingClientRect();

  // Convert click into image-local coordinates
  const clickX = (e.clientX - rect.left - translateX) / zoomLevels[currentZoomIndex];
  const clickY = (e.clientY - rect.top - translateY) / zoomLevels[currentZoomIndex];

  const oldZoom = zoomLevels[currentZoomIndex];
  currentZoomIndex = (currentZoomIndex + 1) % zoomLevels.length;
  const newZoom = zoomLevels[currentZoomIndex];

  if (newZoom === 1) {
    resetZoom();
  } else {
    // Adjust translation so the clicked point stays fixed
    translateX = e.clientX - rect.left - clickX * newZoom;
    translateY = e.clientY - rect.top - clickY * newZoom;
    zoomImg.style.cursor = "grab";
    updateTransform();
  }
});


// ------------------- Mouse Drag -------------------
zoomImg.addEventListener("mousedown", (e) => {
  if (zoomLevels[currentZoomIndex] > 1) {
    isDragging = true;
    dragged = false;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    zoomImg.style.cursor = "grabbing";
  }
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const dx = e.clientX - startX - translateX;
    const dy = e.clientY - startY - translateY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragged = true;
    }

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  }
});

window.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    if (zoomLevels[currentZoomIndex] > 1) {
      zoomImg.style.cursor = "grab";
    }
  }
});

// ------------------- Touch Drag -------------------
zoomImg.addEventListener("touchstart", (e) => {
  if (zoomLevels[currentZoomIndex] > 1 && e.touches.length === 1) {
    isDragging = true;
    dragged = false;
    startX = e.touches[0].clientX - translateX;
    startY = e.touches[0].clientY - translateY;
  }
});

zoomImg.addEventListener("touchmove", (e) => {
  if (isDragging && e.touches.length === 1) {
    const dx = e.touches[0].clientX - startX - translateX;
    const dy = e.touches[0].clientY - startY - translateY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragged = true;
    }

    translateX = e.touches[0].clientX - startX;
    translateY = e.touches[0].clientY - startY;
    updateTransform();
  }
});

zoomImg.addEventListener("touchend", () => {
  isDragging = false;
});

// ------------------- Init -------------------
showZoomImage(zoom_currentIndex);
