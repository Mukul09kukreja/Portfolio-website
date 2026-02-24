/* portfolio.js — Dark Cinematic v5 */

// ══════════════════════════════════════
// CUSTOM CURSOR
// ══════════════════════════════════════
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let cx = 0, cy = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
});

// Smooth trailing cursor
(function trailLoop() {
    tx += (cx - tx) * 0.12;
    ty += (cy - ty) * 0.12;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    requestAnimationFrame(trailLoop);
})();

document.querySelectorAll('a, button, .project-card, .contact-row, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); cursorTrail.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); cursorTrail.classList.remove('hovered'); });
});

// ══════════════════════════════════════
// CANVAS — Flowing Particle Field
// ══════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b));

// Particles
class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
        this.x   = rand(0, W);
        this.y   = init ? rand(0, H) : H + 10;
        this.vx  = rand(-0.15, 0.15);
        this.vy  = rand(-0.4, -0.1);
        this.r   = rand(0.5, 1.8);
        this.a   = 0;
        this.maxA= rand(0.1, 0.5);
        this.life= rand(0.5, 1);
        this.age = 0;
    }
    update(mx, my) {
        this.x  += this.vx;
        this.y  += this.vy;
        this.age += 0.005;
        if (this.age < 0.15) this.a = (this.age / 0.15) * this.maxA;
        else if (this.age > 0.85) this.a = ((1 - this.age) / 0.15) * this.maxA;
        else this.a = this.maxA;
        // Cursor attract
        const dx = mx - this.x, dy = my - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) { this.vx += dx * 0.00015; this.vy += dy * 0.00015; }
        if (this.age >= 1 || this.y < -10) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57,255,148,${this.a})`;
        ctx.fill();
    }
}

// Grid lines (subtle)
class GridLine {
    constructor(isVertical) {
        this.isV = isVertical;
        this.pos = isVertical ? rand(0, W) : rand(0, H);
        this.a   = rand(0.01, 0.04);
        this.speed = rand(0.1, 0.4) * (Math.random() > 0.5 ? 1 : -1);
    }
    update() {
        this.pos += this.speed;
        if (this.isV && (this.pos < 0 || this.pos > W)) this.pos = this.isV ? rand(0, W) : rand(0, H);
        if (!this.isV && (this.pos < 0 || this.pos > H)) this.pos = rand(0, H);
    }
    draw() {
        ctx.beginPath();
        if (this.isV) { ctx.moveTo(this.pos, 0); ctx.lineTo(this.pos, H); }
        else           { ctx.moveTo(0, this.pos); ctx.lineTo(W, this.pos); }
        ctx.strokeStyle = `rgba(57,255,148,${this.a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

let particles = [], gridLines = [];
function initParticles() {
    particles = [];
    gridLines = [];
    const n = Math.min(Math.floor(W * H / 8000), 140);
    for (let i = 0; i < n; i++) particles.push(new Particle());
    for (let i = 0; i < 6; i++) gridLines.push(new GridLine(true));
    for (let i = 0; i < 4; i++) gridLines.push(new GridLine(false));
}
initParticles();

// Connection lines between close particles
const MAX_D = 100;
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
            if (d < MAX_D) {
                const alpha = (1 - d / MAX_D) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(57,255,148,${alpha})`;
                ctx.lineWidth = 0.4;
                ctx.stroke();
            }
        }
    }
}

let mx = W / 2, my = H / 2;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

// Glow orbs
const orbs = [
    { x: 0.15, y: 0.3,  r: 0.35, c: '57,255,148', a: 0.04 },
    { x: 0.85, y: 0.7,  r: 0.28, c: '0,212,170',  a: 0.03 },
    { x: 0.5,  y: 0.15, r: 0.2,  c: '57,255,148', a: 0.025 },
];

function drawOrbs() {
    orbs.forEach(o => {
        const g = ctx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r*Math.max(W,H));
        g.addColorStop(0, `rgba(${o.c},${o.a})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x*W, o.y*H, o.r*Math.max(W,H), 0, Math.PI*2);
        ctx.fill();
    });
}

(function loop() {
    ctx.clearRect(0, 0, W, H);
    drawOrbs();
    gridLines.forEach(g => { g.update(); g.draw(); });
    particles.forEach(p => { p.update(mx, my); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
})();

// ══════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
}, { passive: true });

function updateActiveNav() {
    const scrollY = window.scrollY + 130;
    document.querySelectorAll('section[id]').forEach(s => {
        const link = document.querySelector(`.nav-link[data-section="${s.id}"]`);
        if (link) link.classList.toggle('active', scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(el => {
    el.addEventListener('click', e => {
        const target = document.querySelector(el.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
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
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = open ? '0' : '1';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
}
menuToggle.addEventListener('click', toggleMenu);

// ══════════════════════════════════════
// TERMINAL TYPING EFFECT
// ══════════════════════════════════════
const termCmd    = document.getElementById('terminalCmd');
const termOutput = document.getElementById('terminalOutput');

const sequences = [
    { cmd: 'whoami',              out: 'mukul_kukreja — cs student & dev' },
    { cmd: 'cat skills.txt',      out: 'python, html, css, c, git, github' },
    { cmd: './run_sih_project.py',out: '✓ Pothole detected. Complaint filed.' },
    { cmd: 'git status',          out: 'On branch main — 5 projects committed' },
    { cmd: 'python spelling_bee.py', out: 'GRAPHIC → instant win! 🎮' },
];

let seqIdx = 0;
const randT = (a, b) => a + Math.random() * (b - a);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typeCmd(text) {
    termCmd.textContent = '';
    for (let ch of text) {
        termCmd.textContent += ch;
        await sleep(randT(40, 90));
    }
}

async function showOutput(text) {
    await sleep(300);
    termOutput.textContent = text;
    termOutput.classList.add('visible');
}

async function clearTerminal() {
    await sleep(2200);
    termOutput.classList.remove('visible');
    await sleep(200);
    termCmd.textContent = '';
}

async function runTerminal() {
    await sleep(1200);
    while (true) {
        const seq = sequences[seqIdx % sequences.length];
        seqIdx++;
        await typeCmd(seq.cmd);
        await showOutput(seq.out);
        await clearTerminal();
    }
}
runTerminal();

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
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target === 1 ? target : target + '+';
    }
    requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const t = parseInt(e.target.dataset.target);
            countUp(e.target, t);
            counterObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hss-num[data-target]').forEach(el => counterObs.observe(el));

// ══════════════════════════════════════
// SKILL BAR ANIMATION
// ══════════════════════════════════════
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const fill  = e.target.querySelector('.si-fill');
        const delay = parseInt(e.target.dataset.delay) || 0;
        if (fill) setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, delay);
        skillObs.unobserve(e.target);
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-item').forEach(el => skillObs.observe(el));

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay) || 0;
            setTimeout(() => e.target.classList.add('in-view'), delay);
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ══════════════════════════════════════
// PROJECT CARD 3D TILT
// ══════════════════════════════════════
document.querySelectorAll('.project-card, .project-featured').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) / r.width;
        const y = (e.clientY - r.top  - r.height / 2) / r.height;
        card.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
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

// ══════════════════════════════════════
// HERO TITLE GLITCH on hover
// ══════════════════════════════════════
document.querySelectorAll('.ht-word').forEach(word => {
    let glitching = false;
    word.addEventListener('mouseenter', () => {
        if (glitching) return;
        glitching = true;
        const original = word.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
        let iters = 0;
        const interval = setInterval(() => {
            word.textContent = original.split('').map((c, i) => {
                if (i < iters) return original[i];
                return c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            iters += 0.5;
            if (iters >= original.length) {
                clearInterval(interval);
                word.textContent = original;
                glitching = false;
            }
        }, 35);
    });
});