document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    const pPercentage = document.getElementById('p-loader-percent');
    const pBar = document.getElementById('p-loader-bar');

    // SVG path drawing setup
    const logoP1 = document.getElementById('logo-p1');
    const logoP2 = document.getElementById('logo-p2');
    if (logoP1) {
        const len1 = logoP1.getTotalLength();
        logoP1.style.strokeDasharray = len1;
        logoP1.style.strokeDashoffset = len1;
    }
    if (logoP2) {
        const len2 = logoP2.getTotalLength();
        logoP2.style.strokeDasharray = len2;
        logoP2.style.strokeDashoffset = len2;
    }

    // Preloader entrance animation
    const preloaderTl = gsap.timeline();
    preloaderTl
        .to('#logo-p1', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' })
        .to('#logo-p2', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.5')
        .to('.preloader-title span', {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'expo.out'
        }, '-=0.4')
        .to('.preloader-subtitle', {
            y: 0, opacity: 1, duration: 0.6
        }, '-=0.3');

    // Progress bar
    let loadObj = { val: 0 };
    gsap.to(loadObj, {
        val: 100,
        duration: 2.8,
        ease: 'power1.inOut',
        onUpdate: () => {
            const v = Math.round(loadObj.val);
            if (pPercentage) pPercentage.innerText = v + '%';
            if (pBar) pBar.style.width = v + '%';
        },
        onComplete: () => {
            // Exit preloader — panels slide up, then just show the page (no hero animation)
            const exitTl = gsap.timeline();
            exitTl
                .to('.preloader-content', { opacity: 0, y: -30, duration: 0.6, ease: 'power3.in' })
                .to('.p-panel', {
                    y: '-100%', stagger: 0.08, duration: 1, ease: 'expo.inOut'
                }, '-=0.1')
                .set(preloader, { display: 'none' });
        }
    });

    // --- COUNTER ANIMATION (FIX NaN) ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const rawText = counter.getAttribute('data-target');
        const target = parseInt(rawText, 10);
        const suffix = counter.getAttribute('data-suffix') || '';

        // Start at 0
        counter.innerText = '0' + suffix;

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        counter.innerText = Math.round(obj.val) + suffix;
                    }
                });
            }
        });
    });

    // --- NAVBAR ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 600) backToTop.classList.add('active');
            else backToTop.classList.remove('active');
        }
    });

    // --- MOBILE MENU ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.querySelector('i').classList.toggle('fa-bars');
            mobileToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // --- SMOOTH ANCHOR SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, { offset: -80, duration: 1.5 });
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.querySelector('i').classList.add('fa-bars');
                    mobileToggle.querySelector('i').classList.remove('fa-times');
                }
            }
        });
    });

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(other => {
                other.classList.remove('active');
            });

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- PARALLAX ---
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        gsap.to('.img-parallax', { x, y, duration: 1 });
    });

    // --- AOS ---
    AOS.init({ duration: 1000, once: true, offset: 100 });
});
