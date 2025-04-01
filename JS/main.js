document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    
    if (fadeElements.length > 0) {
        window.addEventListener('scroll', checkFadeElements);
        checkFadeElements();
    }
    
    function checkFadeElements() {
        const triggerBottom = window.innerHeight * 0.8;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            } else {
                element.classList.remove('visible');
            }
        });
    }
    
    const scrollThreshold = 500;
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });

        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    if (document.getElementById('comparison-slider')) {
        initializeSlider('comparison-slider', 'clip-container', 'slider-control', 'slider-divider', 'before-label', 'after-label');
    }
    
    if (document.getElementById('comparison-slider-1')) {
        initializeSlider('comparison-slider-1', 'clip-container-1', 'slider-control-1', 'slider-divider-1', 'before-label-1', 'after-label-1');
    }
    
    if (document.getElementById('comparison-slider-2')) {
        initializeSlider('comparison-slider-2', 'clip-container-2', 'slider-control-2', 'slider-divider-2', 'before-label-2', 'after-label-2');
    }
    
    if (document.getElementById('comparison-slider-3')) {
        initializeSlider('comparison-slider-3', 'clip-container-3', 'slider-control-3', 'slider-divider-3', 'before-label-3', 'after-label-3');
    }
    
    if (document.getElementById('image-lightbox')) {
        initializeLightbox();
    }
});

function initializeSlider(sliderId, clipId, controlId, dividerId, beforeLabelId, afterLabelId) {
    const slider = document.getElementById(sliderId);
    const clipContainer = document.getElementById(clipId);
    const sliderControl = document.getElementById(controlId);
    const sliderDivider = document.getElementById(dividerId);
    const beforeLabel = document.getElementById(beforeLabelId);
    const afterLabel = document.getElementById(afterLabelId);
    
    if (!slider || !clipContainer || !sliderControl || !sliderDivider || !beforeLabel || !afterLabel) {
        return;
    }
    
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        sliderControl.style.width = '30px';
        sliderControl.style.height = '30px';
        sliderControl.style.marginLeft = '-15px';
        sliderControl.style.marginTop = '-15px';
        sliderDivider.style.width = '2px';
    } else {
        sliderControl.style.width = '40px';
        sliderControl.style.height = '40px';
        sliderControl.style.marginLeft = '-20px';
        sliderControl.style.marginTop = '-20px';
        sliderDivider.style.width = '3px';
    }
    
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            sliderControl.style.width = '30px';
            sliderControl.style.height = '30px';
            sliderControl.style.marginLeft = '-15px';
            sliderControl.style.marginTop = '-15px';
            sliderDivider.style.width = '2px';
        } else {
            sliderControl.style.width = '40px';
            sliderControl.style.height = '40px';
            sliderControl.style.marginLeft = '-20px';
            sliderControl.style.marginTop = '-20px';
            sliderDivider.style.width = '3px';
        }
    });
    
    let isDragging = false;
    
    function startDragging(e) {
        e.preventDefault();
        isDragging = true;
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', endDragging);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', endDragging);
    }
    
    function endDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', endDragging);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', endDragging);
    }
    
    function handleMove(e) {
        if (isDragging) {
            updatePositionFromClientX(e.clientX);
        }
    }
    
    function handleTouchMove(e) {
        if (isDragging && e.touches.length > 0) {
            updatePositionFromClientX(e.touches[0].clientX);
            e.preventDefault();
        }
    }
    
    function handleSliderClick(e) {
        updatePositionFromClientX(e.clientX);
    }
    
    function updatePositionFromClientX(clientX) {
        const sliderRect = slider.getBoundingClientRect();
        const position = (clientX - sliderRect.left) / sliderRect.width;
        updatePosition(position);
    }
    
    function updatePosition(position) {
        position = Math.max(0, Math.min(position, 1));
        
        const percentage = position * 100;
        
        clipContainer.style.width = `${percentage}%`;
        sliderControl.style.left = `${percentage}%`;
        sliderDivider.style.left = `${percentage}%`;
        
        updateLabelPositions(percentage);
    }
    
    function updateLabelPositions(percentage) {
        const isMobile = window.innerWidth < 768;
        const mobileThreshold = isMobile ? 20 : 30;
        
        if (percentage < mobileThreshold) {
            beforeLabel.style.opacity = '0';
            beforeLabel.style.transform = 'translateX(-10px)';
        } else {
            beforeLabel.style.opacity = '1';
            beforeLabel.style.transform = 'translateX(0)';
        }
        
        if (percentage > (100 - mobileThreshold)) {
            afterLabel.style.opacity = '0';
            afterLabel.style.transform = 'translateX(10px)';
        } else {
            afterLabel.style.opacity = '1';
            afterLabel.style.transform = 'translateX(0)';
        }
        
        if (isMobile) {
            beforeLabel.style.fontSize = '14px';
            afterLabel.style.fontSize = '14px';
            beforeLabel.style.padding = '4px 8px';
            afterLabel.style.padding = '4px 8px';
        } else {
            beforeLabel.style.fontSize = '16px';
            afterLabel.style.fontSize = '16px';
            beforeLabel.style.padding = '6px 12px';
            afterLabel.style.padding = '6px 12px';
        }
    }
    
    sliderControl.addEventListener('mousedown', startDragging);
    sliderControl.addEventListener('touchstart', startDragging);
    slider.addEventListener('click', handleSliderClick);
    
    sliderControl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
            <path d="M15.75 19.5L8.25 12l7.5-7.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M8.25 19.5L15.75 12l-7.5-7.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
    `;
    
    sliderControl.style.display = 'flex';
    sliderControl.style.alignItems = 'center';
    sliderControl.style.justifyContent = 'center';
    sliderControl.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    sliderControl.style.borderRadius = '50%';
    sliderControl.style.cursor = 'pointer';
    sliderControl.style.zIndex = '10';
    sliderControl.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    
    updatePosition(0.5);
}

function initializeLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('image-lightbox');
    
    if (!lightbox) return;
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    function openLightbox(imgElement) {
        lightboxImage.src = imgElement.src;
        lightboxCaption.textContent = imgElement.alt;
        lightbox.style.display = 'block';
        
        document.addEventListener('keydown', handleEscKey);
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.removeEventListener('keydown', handleEscKey);
    }
    
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
    
    function showNextImage() {
        if (galleryImages.length === 0) return;
        
        let currentIndex = -1;
        galleryImages.forEach((img, index) => {
            if (img.src === lightboxImage.src) {
                currentIndex = index;
            }
        });
        
        if (currentIndex >= 0) {
            const nextIndex = (currentIndex + 1) % galleryImages.length;
            openLightbox(galleryImages[nextIndex]);
        }
    }
    
    function showPrevImage() {
        if (galleryImages.length === 0) return;
        
        let currentIndex = -1;
        galleryImages.forEach((img, index) => {
            if (img.src === lightboxImage.src) {
                currentIndex = index;
            }
        });
        
        if (currentIndex >= 0) {
            const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(galleryImages[prevIndex]);
        }
    }
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this);
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
    
    let touchstartX = 0;
    let touchendX = 0;
    
    lightbox.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        
        if (touchendX < touchstartX - 50) {
            showNextImage();
        }
        
        if (touchendX > touchstartX + 50) {
            showPrevImage();
        }
    });
}
