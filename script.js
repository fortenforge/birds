document.addEventListener('DOMContentLoaded', () => {
    // Scroll-driven dot navigation
    const dots = document.querySelectorAll('.dot-nav .dot');
    const sections = document.querySelectorAll('.timeline .container');
    const dotNav = document.querySelector('.dot-nav');

    // Show/hide dot nav based on scroll position
    const header = document.querySelector('header');

    // === SCROLL-DRIVEN COLOR GRADIENT ===
    // Define the four color palettes
    const colorPalettes = [
        { // Ocean/Coastal
            bgColor: [10, 22, 40],
            cardBg: [16, 32, 52],
            cardBorder: [100, 180, 180],
            accentColor: [95, 179, 179],
            accentLight: [141, 208, 208],
            textPrimary: [240, 244, 248],
            textSecondary: [160, 180, 196],
            textMuted: [92, 112, 128],
            timelineLine: [95, 179, 179],
            birdLinkColor: [230, 192, 123],
            birdLinkHover: [240, 212, 138]
        },
        { // Forest/Woodland
            bgColor: [13, 26, 20],
            cardBg: [24, 40, 32],
            cardBorder: [140, 160, 120],
            accentColor: [143, 174, 123],
            accentLight: [184, 212, 160],
            textPrimary: [244, 242, 236],
            textSecondary: [184, 196, 168],
            textMuted: [106, 120, 96],
            timelineLine: [143, 174, 123],
            birdLinkColor: [212, 165, 116],
            birdLinkHover: [232, 192, 148]
        },
        { // Midnight/Lavender
            bgColor: [18, 16, 26],
            cardBg: [32, 28, 48],
            cardBorder: [160, 140, 180],
            accentColor: [168, 144, 192],
            accentLight: [200, 184, 216],
            textPrimary: [244, 242, 248],
            textSecondary: [184, 168, 200],
            textMuted: [106, 92, 120],
            timelineLine: [168, 144, 192],
            birdLinkColor: [232, 168, 160],
            birdLinkHover: [244, 192, 184]
        },
        { // Desert/Warm
            bgColor: [26, 21, 18],
            cardBg: [40, 32, 28],
            cardBorder: [180, 140, 100],
            accentColor: [200, 149, 108],
            accentLight: [224, 184, 144],
            textPrimary: [248, 244, 240],
            textSecondary: [192, 176, 160],
            textMuted: [120, 104, 88],
            timelineLine: [200, 149, 108],
            birdLinkColor: [124, 184, 144],
            birdLinkHover: [152, 208, 168]
        }
    ];

    // Helper function to interpolate between two RGB values
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);

    const lerpColor = (color1, color2, t) => {
        return [
            lerp(color1[0], color2[0], t),
            lerp(color1[1], color2[1], t),
            lerp(color1[2], color2[2], t)
        ];
    };

    const rgbToString = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    const rgbaToString = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

    // Update colors based on scroll position
    const updateScrollColors = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

        // Map scroll progress to palette transitions (0-1 covers all 4 palettes)
        const totalPalettes = colorPalettes.length;
        const scaledProgress = scrollProgress * totalPalettes;
        const paletteIndex = Math.min(Math.floor(scaledProgress), totalPalettes - 1);
        const nextPaletteIndex = Math.min(paletteIndex + 1, totalPalettes - 1);
        const localT = scaledProgress - paletteIndex;

        const palette1 = colorPalettes[paletteIndex];
        const palette2 = colorPalettes[nextPaletteIndex];

        // Interpolate all colors
        const root = document.documentElement;

        root.style.setProperty('--bg-color', rgbToString(lerpColor(palette1.bgColor, palette2.bgColor, localT)));
        root.style.setProperty('--card-bg', rgbaToString(lerpColor(palette1.cardBg, palette2.cardBg, localT), 0.92));
        root.style.setProperty('--card-border', rgbaToString(lerpColor(palette1.cardBorder, palette2.cardBorder, localT), 0.2));
        root.style.setProperty('--accent-color', rgbToString(lerpColor(palette1.accentColor, palette2.accentColor, localT)));
        root.style.setProperty('--accent-light', rgbToString(lerpColor(palette1.accentLight, palette2.accentLight, localT)));
        root.style.setProperty('--accent-glow', rgbaToString(lerpColor(palette1.accentColor, palette2.accentColor, localT), 0.35));
        root.style.setProperty('--text-primary', rgbToString(lerpColor(palette1.textPrimary, palette2.textPrimary, localT)));
        root.style.setProperty('--text-secondary', rgbToString(lerpColor(palette1.textSecondary, palette2.textSecondary, localT)));
        root.style.setProperty('--text-muted', rgbToString(lerpColor(palette1.textMuted, palette2.textMuted, localT)));
        root.style.setProperty('--timeline-line', rgbaToString(lerpColor(palette1.timelineLine, palette2.timelineLine, localT), 0.4));
        root.style.setProperty('--bird-link-color', rgbToString(lerpColor(palette1.birdLinkColor, palette2.birdLinkColor, localT)));
        root.style.setProperty('--bird-link-hover', rgbToString(lerpColor(palette1.birdLinkHover, palette2.birdLinkHover, localT)));
    };

    // Initial color update
    updateScrollColors();


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
                updateScrollColors();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial update
    updateActiveDot();
    updateDotNavVisibility();

    // Lazy load videos with preload="none" using IntersectionObserver
    const lazyVideos = document.querySelectorAll('video[preload="none"]');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                // Load the video by setting preload to auto
                video.preload = 'auto';
                video.load();
                // Play the video (it has autoplay attribute)
                video.play().catch(() => {
                    // Autoplay may be blocked, that's okay
                });
                // Stop observing this video
                videoObserver.unobserve(video);
            }
        });
    }, {
        rootMargin: '100px 0px', // Start loading 100px before video enters viewport
        threshold: 0
    });

    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });

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

    // Create caption overlays for media items (positioned below media on hover)
    document.querySelectorAll('.media-item').forEach(mediaItem => {
        const media = mediaItem.querySelector('img, video');
        if (media && media.dataset.caption) {
            const overlay = document.createElement('div');
            overlay.className = 'media-caption-overlay';
            overlay.innerHTML = media.dataset.caption;
            mediaItem.appendChild(overlay);
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
