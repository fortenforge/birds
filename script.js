document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible? 
                // observer.unobserve(entry.target); 
                // Keeping it observing allows re-triggering if we want different exit logic, 
                // but for simple fade-in, usually we leave the class on.
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.container');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentGroupMedia = [];
    let currentIndex = 0;

    const showMedia = (index) => {
        const media = currentGroupMedia[index];
        if (!media) return;

        const isVideo = media.tagName === 'VIDEO';

        if (isVideo) {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = media.querySelector('source').src;
        } else {
            lightboxVideo.style.display = 'none';
            lightboxImg.style.display = 'block';
            lightboxImg.src = media.src;
        }

        // Update button visibility
        prevBtn.style.display = index > 0 ? 'block' : 'none';
        nextBtn.style.display = index < currentGroupMedia.length - 1 ? 'block' : 'none';
    };

    // Open Lightbox
    const openLightbox = (mediaItem, groupSelector) => {
        // Find all media items in the same container (day)
        const container = mediaItem.closest('.content');
        currentGroupMedia = Array.from(container.querySelectorAll('.media-item img, .media-item video'));

        currentIndex = currentGroupMedia.indexOf(mediaItem);

        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('show'), 10);
        showMedia(currentIndex);
    };

    document.querySelectorAll('.media-item img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });

    document.querySelectorAll('.media-item video').forEach(video => {
        video.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(video);
        });
    });

    // Navigation
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            showMedia(currentIndex);
        }
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < currentGroupMedia.length - 1) {
            currentIndex++;
            showMedia(currentIndex);
        }
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightboxVideo.pause(); // Ensure video stops
            lightbox.style.display = 'none';
            lightboxImg.src = '';
            lightboxVideo.src = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                showMedia(currentIndex);
            }
            if (e.key === 'ArrowRight' && currentIndex < currentGroupMedia.length - 1) {
                currentIndex++;
                showMedia(currentIndex);
            }
        }
    });

    // Read More Toggle
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const collapsible = btn.nextElementSibling;
            const isExpanded = collapsible.classList.toggle('expanded');
            btn.classList.toggle('expanded', isExpanded);
            btn.childNodes[0].textContent = isExpanded ? 'Read less' : 'Read more';
        });
    });
});
