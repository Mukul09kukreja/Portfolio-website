/* =========================================
   MUKUL KUKREJA — PORTFOLIO JS
   Researcher Edition
   ========================================= */

const EMAILJS_SERVICE_ID  = 'service_ibrzron';
const EMAILJS_TEMPLATE_ID = 'template_u3yylf7';
const EMAILJS_PUBLIC_KEY  = 'H_kmwqpUnQqI2PpeE';

document.addEventListener('DOMContentLoaded', () => {
    initReveal();      // FIRST — make content visible before anything else
    initCursor();
    initNavbar();
    initMobileMenu();
    initSkillBars();
    initCounters();
    initNavHighlight();
    initContactForm();
    initHoverTilt();
});

/* ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
   FIX: The old code had rootMargin: '-32px' at the bottom which prevented
   elements already in the viewport from ever firing isIntersecting = true.
   
   Solution:
   1. On init, immediately reveal any .reveal elements whose top is already
      within the viewport (no delay needed — they're already visible).
   2. For the rest, use a clean observer with no negative rootMargin.
   3. CSS also sets a no-JS fallback via <noscript> or by removing the class.
─────────────────────────────────────────────────────────────────────────────── */
function initReveal() {
    const els = document.querySelectorAll('.reveal');

    // Step 1: immediately show anything in the initial viewport
    const VH = window.innerHeight;
    els.forEach(el => {
        const rect  = el.getBoundingClientRect();
        const delay = parseInt(el.dataset.delay || 0);
        if (rect.top < VH - 20) {
            // already on screen — reveal with a small stagger but no scroll needed
            setTimeout(() => el.classList.add('visible'), delay);
        }
    });

    // Step 2: watch the rest as user scrolls
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            io.unobserve(entry.target);
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px 0px 0px'   // no negative margin — was the bug
    });

    els.forEach(el => {
        if (!el.classList.contains('visible')) io.observe(el);
    });
}

/* ─── CURSOR ─── */
function initCursor() {
    const el = document.getElementById('cursor');
    if (!el) return;

    // Start offscreen so it doesn't flash at 0,0
    let x = -100, y = -100, tx = -100, ty = -100;
    let started = false;

    document.addEventListener('mousemove', e => {
        tx = e.clientX;
        ty = e.clientY;
        if (!started) {
            // Snap to position immediately on first move — no lerp lag
            x = tx; y = ty;
            el.style.left = x + 'px';
            el.style.top  = y + 'px';
            // Now reveal it and hide the OS cursor
            document.body.classList.add('cursor-ready');
            started = true;
        }
    });

    // Hide custom cursor when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-ready');
    });
    document.addEventListener('mouseenter', () => {
        if (started) document.body.classList.add('cursor-ready');
    });

    function tick() {
        x += (tx - x) * 0.18;
        y += (ty - y) * 0.18;
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
        requestAnimationFrame(tick);
    }
    tick();

    document.querySelectorAll('a, button, .pl-row, .about-tags span, .int-item').forEach(node => {
        node.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
        node.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
    });
}

/* ─── NAVBAR ─── */
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu   = document.getElementById('mobileMenu');
    const close  = document.getElementById('mobileClose');
    if (!toggle || !menu) return;

    const open = () => { menu.classList.add('open'); toggle.classList.add('open'); };
    const shut = () => { menu.classList.remove('open'); toggle.classList.remove('open'); };

    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    menu.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', shut));
}

/* ─── SKILL BARS ─── */
function initSkillBars() {
    const fills = document.querySelectorAll('.sb-fill');
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.width = entry.target.dataset.w + '%';
            io.unobserve(entry.target);
        });
    }, { threshold: 0.3 });
    fills.forEach(el => io.observe(el));
}

/* ─── COUNTERS ─── */
function initCounters() {
    const nums = document.querySelectorAll('[data-target]');
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            countUp(entry.target);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.5 });
    nums.forEach(el => io.observe(el));
}

function countUp(el) {
    const target = parseInt(el.dataset.target);
    const dur    = target > 100 ? 2000 : 1200;
    const start  = performance.now();
    const step   = now => {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

/* ─── NAV SECTION HIGHLIGHT ─── */
function initNavHighlight() {
    const links    = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    const update = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ─── HOVER TILT ─── */
function initHoverTilt() {
    document.querySelectorAll('.hack-entry .he-body, .paper-card, .int-item').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - 0.5) * 4;
            const y = ((e.clientY - r.top)  / r.height - 0.5) * -4;
            card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

/* ─── CONTACT FORM ─── */
function initContactForm() {
    const form    = document.getElementById('contactForm');
    const btn     = document.getElementById('submitBtn');
    const label   = document.getElementById('submitLabel');
    const icon    = document.getElementById('submitIcon');
    const spinner = document.getElementById('submitSpinner');
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');
    if (!form) return;

    const keysSet = (
        EMAILJS_SERVICE_ID  !== 'service_abc123' &&
        EMAILJS_TEMPLATE_ID !== 'template_xyz789' &&
        EMAILJS_PUBLIC_KEY  !== 'AbCdEfGhIjKlMnOp'
    );
    if (keysSet && typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

    form.addEventListener('submit', async e => {
        e.preventDefault();
        success.style.display = 'none';
        error.style.display   = 'none';
        label.textContent     = 'Sending…';
        spinner.style.display = 'inline';
        icon.style.display    = 'none';
        btn.disabled          = true;

        const reset = () => {
            label.textContent     = 'Send Message';
            spinner.style.display = 'none';
            icon.style.display    = 'inline';
            btn.disabled          = false;
        };

        if (!keysSet || typeof emailjs === 'undefined') {
            await new Promise(r => setTimeout(r, 600));
            reset();
            error.style.display = 'block';
            error.textContent   = 'EmailJS not configured. Set your keys in portfolio.js.';
            return;
        }
        try {
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
            success.style.display = 'block';
            form.reset();
        } catch {
            error.style.display = 'block';
        } finally {
            reset();
        }
    });
}