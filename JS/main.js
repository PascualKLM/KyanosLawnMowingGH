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
        if (percentage < 30) {
            beforeLabel.style.opacity = '0';
            beforeLabel.style.transform = 'translateX(-10px)';
        } else {
            beforeLabel.style.opacity = '1';
            beforeLabel.style.transform = 'translateX(0)';
        }
        
        if (percentage > 70) {
            afterLabel.style.opacity = '0';
            afterLabel.style.transform = 'translateX(10px)';
        } else {
            afterLabel.style.opacity = '1';
            afterLabel.style.transform = 'translateX(0)';
        }
    }
    
    sliderControl.addEventListener('mousedown', startDragging);
    sliderControl.addEventListener('touchstart', startDragging);
    slider.addEventListener('click', handleSliderClick);
    
    updatePosition(0.5);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeSlider('comparison-slider', 'clip-container', 'slider-control', 'slider-divider', 'before-label', 'after-label');
    
    if (document.getElementById('comparison-slider-1')) {
        initializeSlider('comparison-slider-1', 'clip-container-1', 'slider-control-1', 'slider-divider-1', 'before-label-1', 'after-label-1');
    }
    
    if (document.getElementById('comparison-slider-2')) {
        initializeSlider('comparison-slider-2', 'clip-container-2', 'slider-control-2', 'slider-divider-2', 'before-label-2', 'after-label-2');
    }
    
    if (document.getElementById('comparison-slider-3')) {
        initializeSlider('comparison-slider-3', 'clip-container-3', 'slider-control-3', 'slider-divider-3', 'before-label-3', 'after-label-3');
    }
});
