/* portfolio.js — Fixed v3 */

// ══════════════════════════════════════
// CANVAS — Animated Star Field
// ══════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

const rand = (a, b) => a + Math.random() * (b - a);

class Star {
    constructor() { this.reset(true); }
    reset(init = false) {
        this.x = rand(0, W); this.y = init ? rand(0, H) : -10;
        this.r = rand(0.3, 1.6);
        this.vx = rand(-0.1, 0.1); this.vy = rand(-0.1, 0.1);
        this.a = rand(0.2, 0.7); this.da = (Math.random() > 0.5 ? 1 : -1) * 0.003;
        this.hue = Math.random() > 0.55 ? '139,124,248' : Math.random() > 0.5 ? '180,142,247' : '210,200,255';
    }
    update(mx, my) {
        this.x += this.vx; this.y += this.vy;
        this.a += this.da;
        if (this.a > 0.75 || this.a < 0.1) this.da *= -1;
        const dx = mx - this.x, dy = my - this.y;
        if (Math.hypot(dx, dy) < 120) { this.x += dx * 0.002; this.y += dy * 0.002; }
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.hue},${this.a})`; ctx.fill();
    }
}

class Meteor {
    constructor() { this.reset(); }
    reset() {
        this.x = rand(-100, W * 0.7); this.y = rand(-60, H * 0.35);
        this.len = rand(80, 200); this.speed = rand(6, 15);
        this.a = rand(0.6, 1); this.timer = rand(100, 800); this.alive = false;
    }
    update() {
        if (!this.alive) { this.timer--; if (this.timer <= 0) this.alive = true; return; }
        this.x += this.speed; this.y += this.speed * 0.4; this.a -= 0.018;
        if (this.a <= 0) this.reset();
    }
    draw() {
        if (!this.alive) return;
        const g = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y - this.len * 0.4);
        g.addColorStop(0, `rgba(255,255,255,${this.a})`);
        g.addColorStop(0.6, `rgba(195,185,255,${this.a * 0.3})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x - this.len, this.y - this.len * 0.4);
        ctx.stroke(); ctx.restore();
    }
}

const STARS = [], MAX_D = 90;
function initParticles() {
    STARS.length = 0;
    const n = Math.min(Math.floor(W * H / 11000), 120);
    for (let i = 0; i < n; i++) STARS.push(new Star());
    for (let i = 0; i < 4; i++) STARS.push(new Meteor());
}
initParticles();

let mx = W / 2, my = H / 2;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

const NEBULAE = [
    { x: 0.1,  y: 0.15, rx: 0.55, ry: 0.55, c: '139,124,248', a: 0.045 },
    { x: 0.78, y: 0.72, rx: 0.4,  ry: 0.4,  c: '180,142,247', a: 0.03  },
    { x: 0.45, y: 0.45, rx: 0.28, ry: 0.28, c: '100,87,232',  a: 0.02  },
];

function drawNebulae() {
    NEBULAE.forEach(n => {
        const g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, Math.max(n.rx * W, n.ry * H));
        g.addColorStop(0, `rgba(${n.c},${n.a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(n.x * W, n.y * H, n.rx * W, n.ry * H, 0, 0, Math.PI * 2); ctx.fill();
    });
}

function drawLines() {
    const pts = STARS.filter(s => s instanceof Star);
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < MAX_D) {
                ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
                ctx.strokeStyle = `rgba(139,124,248,${(1 - d / MAX_D) * 0.13})`;
                ctx.lineWidth = 0.6; ctx.stroke();
            }
        }
    }
}

(function loop() {
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#03030e'); bg.addColorStop(0.5, '#060618'); bg.addColorStop(1, '#03030e');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    drawNebulae();
    STARS.forEach(s => { s.update(mx, my); s.draw(); });
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

// Smooth scroll for all anchor links
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
    const text = 'Computer Science Student crafting elegant solutions to complex problems — one line of code at a time.';
    heroSub.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            heroSub.textContent += text[i++];
            setTimeout(type, rand(18, 48));
        }
    }
    setTimeout(type, 900);
}

// ══════════════════════════════════════
// STAT COUNTERS
// ══════════════════════════════════════
function countUp(el, target) {
    // Clear any existing content and set initial state
    el.textContent = '0';
    el.style.color = '#ffffff';

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
        } 
        else if (el.textContent == "1") {
            el.textContent = target;
        }
        else {
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
    el.style.color = '#ffffff';
    counterObs.observe(el);
});

// ══════════════════════════════════════
// SKILL CARDS — animate in with bars
// CSS default is opacity:1 so they're
// always visible even if JS fails.
// JS adds 'animate-in' then triggers
// 'visible' for the smooth entrance.
// ══════════════════════════════════════
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const card  = e.target;
        const delay = parseInt(card.dataset.delay) || 0;

        // Mark for animation (sets opacity:0 temporarily)
        card.classList.add('animate-in');

        setTimeout(() => {
            // Trigger visible state
            card.classList.add('visible');

            // Animate skill bar
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
// SCROLL REVEAL (about, projects, contact)
// ══════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

// Add reveal class dynamically (won't break if JS fails — CSS shows them by default)
document.querySelectorAll(
    '.info-card, .contact-card, .project-card, .section-title, .section-desc, .about-text p'
).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.65s ${i * 0.04}s cubic-bezier(0.16,1,0.3,1), transform 0.65s ${i * 0.04}s cubic-bezier(0.16,1,0.3,1)`;
    el.classList.add('js-reveal');
    revealObs.observe(el);
});

const revealObs2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            revealObs2.unobserve(e.target);
        }
    });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.js-reveal').forEach(el => revealObs2.observe(el));

// ══════════════════════════════════════
// PROJECT CARD TILT
// ══════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) / r.width;
        const y = (e.clientY - r.top  - r.height / 2) / r.height;
        card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-5px)`;
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