document.addEventListener('DOMContentLoaded', () => {

    // --- Smart Sticky Menu Logic ---
    const header = document.querySelector('.header');
    const burgerBtn = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');

    // Scroll Handler for Sticky Hamburger
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
            // Auto close if back at top (optional, but good UX)
            // closeMenu(); 
        }

        // Feature: Close menu on scroll
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    function openMenu() {
        mobileMenu.classList.add('active');
        // document.body.style.overflow = 'hidden'; // Don't lock scroll, so user can scroll to close
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burgerBtn) {
        burgerBtn.addEventListener('click', openMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    // --- Biography Modal Logic (NEW) ---
    const readMoreBtn = document.getElementById('read-more-btn');
    const bioModal = document.getElementById('bio-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (readMoreBtn && bioModal) {
        readMoreBtn.addEventListener('click', () => {
            bioModal.showModal();
            document.body.style.overflow = 'hidden'; // Lock scroll
        });
    }

    function closeModal() {
        if (bioModal) {
            bioModal.close();
            document.body.style.overflow = '';
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on click outside (backdrop)
    if (bioModal) {
        bioModal.addEventListener('click', (e) => {
            const rect = bioModal.getBoundingClientRect();
            // Check if click is outside the dialog bounds
            if (e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom) {
                closeModal();
            }
        });
    }


    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Animation Logic (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // --- 3D Card Effect (Vanilla JS Port) ---
    const cards = document.querySelectorAll('.book-card');

    cards.forEach(card => {
        const cardBody = card.querySelector('.book-card__image');
        const cardItem = cardBody.querySelector('img');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate mouse position relative to card center
            // 25 is the "dampening" factor (higher = less rotation)
            const x = (e.clientX - rect.left - rect.width / 2) / 25;
            const y = (e.clientY - rect.top - rect.height / 2) / 25;

            // Apply rotation
            // rotateY uses x (horizontal movement rotates around Y axis)
            // rotateX uses -y (vertical movement rotates around X axis, inverted for natural feel)
            cardBody.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        });

        card.addEventListener('mouseenter', () => {
            // Optional: Pop effect on enter
            // cardItem.style.transform = "translateZ(80px)"; 
        });

        card.addEventListener('mouseleave', () => {
            // Reset rotation
            cardBody.style.transform = `rotateY(0deg) rotateX(0deg)`;
            // Reset pop
            // cardItem.style.transform = "translateZ(50px)";
        });
    });

    // --- Container Scroll Animation (Entrepreneur) ---
    const container3D = document.querySelector('.entrepreneur-3d-wrapper');
    const card3D = document.querySelector('.entrepreneur__text-border');

    if (container3D && card3D) {
        window.addEventListener('scroll', () => {
            const rect = container3D.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Start animation when top of container hits bottom of viewport
            const start = viewportHeight;
            const end = 0; // Top of viewport

            // Calculate progress (0 to 1) as element moves up
            let progress = (start - rect.top) / (start - end);
            progress = Math.min(Math.max(progress, 0), 1);

            // --- Animation Values based on React Code ---
            // rotateX: 20 -> 0
            const rotateX = 20 - (20 * progress);

            // TranslateY: 0 -> -100px (React default) -> Let's do 0 -> -50px for smoother feel
            const translateY = 0 - (50 * progress);

            // Scale Logic
            const isMobile = window.innerWidth <= 768;
            let scale;

            if (isMobile) {
                // Mobile: 0.7 -> 0.9 (React Code Mobile)
                scale = 0.7 + (0.2 * progress);
            } else {
                // Desktop: 0.9 -> 1 (Original smooth desktop feel)
                scale = 0.9 + (0.1 * progress);
            }

            // Apply transform with translateZ(0) for hardware acceleration
            card3D.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px) translateZ(0)`;
        });

        // Initial trigger
        window.dispatchEvent(new Event('scroll'));
    }

    // --- Active Link Highlighter (Mobile Menu) ---
    const sections = document.querySelectorAll('section'); // Assuming standard sections
    const navLinks = document.querySelectorAll('.mobile-menu__link');

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active to current
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.mobile-menu__link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.25, // Trigger when 25% visible
        rootMargin: "-10% 0px -50% 0px" // Adjusted for middle-screen focus
    });

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });

});
