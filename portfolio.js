/* portfolio.js — Redesigned v4 */

// ══════════════════════════════════════
// CANVAS — Subtle Particle Field
// Light palette for cream background
// ══════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

const rand = (a, b) => a + Math.random() * (b - a);

class Dot {
    constructor() { this.reset(true); }
    reset(init = false) {
        this.x  = rand(0, W);
        this.y  = init ? rand(0, H) : rand(0, H);
        this.r  = rand(0.4, 1.4);
        this.vx = rand(-0.08, 0.08);
        this.vy = rand(-0.08, 0.08);
        this.a  = rand(0.08, 0.28);
        this.da = (Math.random() > 0.5 ? 1 : -1) * 0.002;
        // Warm muted tones — terracotta, gold, sage
        const palette = ['180,130,100', '160,140,110', '140,155,130', '190,160,120', '170,145,115'];
        this.hue = palette[Math.floor(Math.random() * palette.length)];
    }
    update(mx, my) {
        this.x += this.vx; this.y += this.vy;
        this.a += this.da;
        if (this.a > 0.3 || this.a < 0.05) this.da *= -1;
        const dx = mx - this.x, dy = my - this.y;
        if (Math.hypot(dx, dy) < 100) { this.x -= dx * 0.001; this.y -= dy * 0.001; }
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.hue},${this.a})`;
        ctx.fill();
    }
}

const DOTS = [];
const MAX_D = 80;

function initParticles() {
    DOTS.length = 0;
    const n = Math.min(Math.floor(W * H / 14000), 90);
    for (let i = 0; i < n; i++) DOTS.push(new Dot());
}
initParticles();

let mx = W / 2, my = H / 2;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function drawLines() {
    for (let i = 0; i < DOTS.length; i++) {
        for (let j = i + 1; j < DOTS.length; j++) {
            const d = Math.hypot(DOTS[i].x - DOTS[j].x, DOTS[i].y - DOTS[j].y);
            if (d < MAX_D) {
                ctx.beginPath();
                ctx.moveTo(DOTS[i].x, DOTS[i].y);
                ctx.lineTo(DOTS[j].x, DOTS[j].y);
                ctx.strokeStyle = `rgba(160,140,110,${(1 - d / MAX_D) * 0.09})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

(function loop() {
    ctx.clearRect(0, 0, W, H);
    DOTS.forEach(d => { d.update(mx, my); d.draw(); });
    drawLines();
    requestAnimationFrame(loop);
})();

// ══════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateNav();
}, { passive: true });

function updateNav() {
    const scrollY = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(s => {
        const link = document.querySelector(`.nav-link[data-section="${s.id}"]`);
        if (link) link.classList.toggle('active', scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight);
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(el => {
    el.addEventListener('click', e => {
        const target = document.querySelector(el.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 68;
        window.scrollTo({ top: target.offsetTop - navH + 1, behavior: 'smooth' });
        if (mobileMenu.classList.contains('open')) toggleMenu();
    });
});

// ══════════════════════════════════════
// MOBILE MENU
// ══════════════════════════════════════
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu() {
    const open = mobileMenu.classList.toggle('open');
    const s = menuToggle.querySelectorAll('span');
    s[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    s[1].style.opacity   = open ? '0' : '1';
    s[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
}
menuToggle.addEventListener('click', toggleMenu);

// ══════════════════════════════════════
// TYPING EFFECT
// ══════════════════════════════════════
const heroSub = document.getElementById('heroSub');
if (heroSub) {
    const text = 'CS student building things I care about — from CLI tools to hackathon projects, one commit at a time.';
    heroSub.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            heroSub.textContent += text[i++];
            setTimeout(type, rand(20, 50));
        }
    }
    setTimeout(type, 800);
}

// ══════════════════════════════════════
// STAT COUNTERS
// ══════════════════════════════════════
function countUp(el, target) {
    el.textContent = '0';
    let start = null;
    const dur = 1800;
    function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = Math.round(ease * target);
        el.textContent = val;
        if (p < 1) {
            requestAnimationFrame(step);
        } else if (target === 1) {
            el.textContent = target;
        } else {
            el.textContent = target + '+';
        }
    }
    requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            countUp(e.target, parseInt(e.target.dataset.target));
            counterObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    el.textContent = '0';
    counterObs.observe(el);
});

// ══════════════════════════════════════
// SKILL CARDS — animate in with bars
// ══════════════════════════════════════
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const card  = e.target;
        const delay = parseInt(card.dataset.delay) || 0;
        card.classList.add('animate-in');
        setTimeout(() => {
            card.classList.add('visible');
            const fill = card.querySelector('.skill-fill');
            if (fill) {
                setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 150);
            }
        }, delay + 30);
        skillObs.unobserve(card);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.info-card, .contact-card, .project-card, .section-title, .section-desc, .about-text p'
).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ${i * 0.035}s cubic-bezier(0.16,1,0.3,1), transform 0.6s ${i * 0.035}s cubic-bezier(0.16,1,0.3,1)`;
    el.classList.add('js-reveal');
    revealObs.observe(el);
});

// ══════════════════════════════════════
// PROJECT CARD TILT
// ══════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) / r.width;
        const y = (e.clientY - r.top  - r.height / 2) / r.height;
        card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ══════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn     = form.querySelector('.submit-btn');
        const label   = btn.querySelector('span');
        const success = document.getElementById('formSuccess');
        btn.disabled  = true;
        label.textContent = 'Sending…';
        setTimeout(() => {
            success.classList.add('visible');
            label.textContent = '✓ Sent!';
            form.reset();
            setTimeout(() => {
                success.classList.remove('visible');
                btn.disabled = false;
                label.textContent = 'Send Message';
            }, 4500);
        }, 1200);
    });
}