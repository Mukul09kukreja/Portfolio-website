/* =========================================
   MUKUL KUKREJA — PREMIUM PORTFOLIO JS
   Cinematic animations & smooth interactions
   ========================================= */

const EMAILJS_SERVICE_ID  = 'service_ibrzron';
const EMAILJS_TEMPLATE_ID = 'template_u3yylf7';
const EMAILJS_PUBLIC_KEY  = 'H_kmwqpUnQqI2PpeE';

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initHeroAnimations();
    initScrollReveal();
    initSkillBars();
    initCounters();
    initNavHighlight();
    initContactForm();
    initMagneticButtons();
});

/* ─── CUSTOM CURSOR ─── */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isActive = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isActive) {
            cursorX = mouseX;
            cursorY = mouseY;
            followerX = mouseX;
            followerY = mouseY;
            document.body.classList.add('cursor-ready');
            isActive = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-ready');
        isActive = false;
    });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .int-item, .lesson-card, .hack-entry, .about-tag');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
    });
}

/* ─── SCROLL PROGRESS ─── */
function initScrollProgress() {
    const progress = document.getElementById('scrollProgress');
    if (!progress) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        progress.style.transform = `scaleX(${scrollPercent})`;
    }, { passive: true });
}

/* ─── NAVBAR ─── */
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('mobileClose');
    if (!toggle || !menu) return;

    const open = () => {
        menu.classList.add('open');
        toggle.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const shut = () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        if (menu.classList.contains('open')) shut();
        else open();
    });

    if (close) close.addEventListener('click', shut);
    menu.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', shut));
}

/* ─── HERO ANIMATIONS ─── */
function initHeroAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Hero name animation
    const heroWords = document.querySelectorAll('.hero-name-word');
    gsap.to(heroWords, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.3
    });

    // Eyebrow
    gsap.to('.hero-eyebrow', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1
    });

    // Description
    gsap.to('.hero-desc', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6
    });

    // Actions
    gsap.to('.hero-actions', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8
    });

    // Links
    gsap.to('.hero-links', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1
    });

    // Hero card
    gsap.to('.hero-col-right', {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
    });

    // Scroll hint
    gsap.to('.hero-scroll-hint', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 1.5
    });

    // Parallax on hero glows
    gsap.to('.hero-glow-1', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        scale: 1.2
    });

    gsap.to('.hero-glow-2', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -50,
        scale: 0.8
    });
}

/* ─── SCROLL REVEAL ─── */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-header, .section-intro, .about-block, .about-tag, .about-quote, .about-goals, .paper-card, .int-item, .hack-entry, .lesson-card, .project-card, .skills-block, .cc-row, .contact-form, .contact-lead');

    revealElements.forEach((el, index) => {
        gsap.fromTo(el, 
            { 
                y: 40, 
                opacity: 0 
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                delay: index % 3 * 0.1
            }
        );
    });

    // Stagger animations for grids
    gsap.fromTo('.about-tags .about-tag',
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-tags',
                start: 'top 85%'
            }
        }
    );

    gsap.fromTo('.paper-keywords .pk-tag',
        { y: 10, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.paper-keywords',
                start: 'top 85%'
            }
        }
    );

    gsap.fromTo('.he-tech span',
        { y: 10, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.03,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.he-tech',
                start: 'top 85%'
            }
        }
    );

    gsap.fromTo('.project-stack span',
        { y: 10, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.03,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.project-stack',
                start: 'top 85%'
            }
        }
    );
}

/* ─── SKILL BARS ─── */
function initSkillBars() {
    const fills = document.querySelectorAll('.sb-fill');

    fills.forEach(fill => {
        const targetWidth = fill.dataset.w;

        ScrollTrigger.create({
            trigger: fill,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(fill, {
                    width: targetWidth + '%',
                    duration: 1.2,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    });
}

/* ─── COUNTERS ─── */
function initCounters() {
    const nums = document.querySelectorAll('[data-target]');

    nums.forEach(num => {
        const target = parseInt(num.dataset.target);

        ScrollTrigger.create({
            trigger: num,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(num, {
                    innerText: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        num.innerText = Math.round(this.targets()[0].innerText);
                    }
                });
            },
            once: true
        });
    });
}

/* ─── NAV SECTION HIGHLIGHT ─── */
function initNavHighlight() {
    const links = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => updateActiveLink(section.id),
            onEnterBack: () => updateActiveLink(section.id)
        });
    });

    function updateActiveLink(id) {
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    }
}

/* ─── MAGNETIC BUTTONS ─── */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const buttons = document.querySelectorAll('.btn-primary, .btn-ghost, .project-link, .text-link');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/* ─── CONTACT FORM ─── */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const btn = document.getElementById('submitBtn');
    const label = document.getElementById('submitLabel');
    const icon = document.getElementById('submitIcon');
    const spinner = document.getElementById('submitSpinner');
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');
    if (!form) return;

    const keysSet = (
        EMAILJS_SERVICE_ID !== 'service_abc123' &&
        EMAILJS_TEMPLATE_ID !== 'template_xyz789' &&
        EMAILJS_PUBLIC_KEY !== 'AbCdEfGhIjKlMnOp'
    );

    if (keysSet && typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        success.style.display = 'none';
        error.style.display = 'none';
        label.textContent = 'Sending…';
        spinner.style.display = 'inline';
        icon.style.display = 'none';
        btn.disabled = true;

        const reset = () => {
            label.textContent = 'Send Message';
            spinner.style.display = 'none';
            icon.style.display = 'inline';
            btn.disabled = false;
        };

        if (!keysSet || typeof emailjs === 'undefined') {
            await new Promise(r => setTimeout(r, 600));
            reset();
            error.style.display = 'block';
            error.textContent = 'EmailJS not configured. Set your keys in portfolio.js.';
            return;
        }

        try {
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
            success.style.display = 'block';
            form.reset();

            // Success animation
            gsap.fromTo(success, 
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        } catch (err) {
            error.style.display = 'block';
            gsap.fromTo(error,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        } finally {
            reset();
        }
    });

    // Input focus animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.parentElement, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input.parentElement, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    });
});

// Load GSAP ScrollToPlugin dynamically
const scrollToScript = document.createElement('script');
scrollToScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js';
document.head.appendChild(scrollToScript);