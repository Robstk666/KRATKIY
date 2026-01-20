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

            // Calculate progress: 0 when top enters bottom of viewport, 1 when it reaches near top
            // range: moves from bottom (vh) to top (0.2*vh)
            const startY = viewportHeight;
            const endY = viewportHeight * 0.2;
            const dist = startY - endY;

            let progress = (startY - rect.top) / dist;
            progress = Math.min(Math.max(progress, 0), 1); // Clamp 0-1

            // Map progress to transforms
            // RotateX: 45deg -> 0deg (Starts very tilted, flattens out)
            const rotateX = 45 - (progress * 45);
            // Scale: 0.8 -> 1 (Starts smaller, grows to normal)
            const scale = 0.8 + (progress * 0.2);
            // TranslateY: 50px -> 0px (Moves up slightly)
            const translateY = 50 - (progress * 50);

            card3D.style.transform = `rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`;

            // Adjust opacity for smoother entrance
            // card3D.style.opacity = 0.5 + (progress * 0.5);
        });

        // Initial trigger
        window.dispatchEvent(new Event('scroll'));
    }

});
