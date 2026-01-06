document.addEventListener('DOMContentLoaded', () => {
    // Scroll-driven dot navigation
    const dots = document.querySelectorAll('.dot-nav .dot');
    const sections = document.querySelectorAll('.timeline .container');
    const dotNav = document.querySelector('.dot-nav');

    // Show/hide dot nav based on scroll position
    const header = document.querySelector('header');

    const updateDotNavVisibility = () => {
        const headerRect = header.getBoundingClientRect();
        if (headerRect.bottom < 50) {
            dotNav.classList.add('visible');
        } else {
            dotNav.classList.remove('visible');
        }
    };

    // Update active dot based on scroll position
    const updateActiveDot = () => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const activationPoint = viewportHeight * 0.3; // Trigger at 30% from top

        let activeIndex = -1;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;

            // Section is active if its top is above the activation point
            if (sectionTop <= activationPoint) {
                activeIndex = index;
            }

            // Fade in sections when they enter viewport
            if (rect.top < viewportHeight * 0.85) {
                section.classList.add('visible');
            }
        });

        // Update dot states
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'passed');

            if (index === activeIndex) {
                dot.classList.add('active');
            } else if (index < activeIndex) {
                dot.classList.add('passed');
            }
        });
    };

    // Click navigation for dots
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const sectionId = dot.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveDot();
                updateDotNavVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial update
    updateActiveDot();
    updateDotNavVisibility();

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
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

        // Display caption from data-caption attribute, falling back to alt text for images
        const caption = media.dataset.caption || (isVideo ? '' : (media.alt || ''));
        lightboxCaption.innerHTML = caption;

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
