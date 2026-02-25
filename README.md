# Mukul Kukreja – Portfolio Website

A dark‑cinematic, single‑page portfolio built from scratch with HTML, CSS and
vanilla JavaScript.  
Showcases who I am, what I’ve built and how to get in touch – with a bunch of
little animations and interactive niceties.

---

## 🚀 Features

- Fully **responsive** layout (desktop → mobile).
- Custom **canvas particle background** + glow orbs.
- **Smooth scroll‑reveal** animations and 3D tilt on project cards.
- Animated **terminal typing** effect on hero section.
- Custom **cursor & trailing halo** (hidden on phones).
- Navbar that highlights the current section and shrinks on scroll.
- Mobile menu with animated hamburger.
- **Contact form** with EmailJS integration (AJAX, loading spinner, success &
  error states).
- Animated stat counters, skill bars and hero title glitch effect.
- Noise overlay, custom scrollbar, selection styling, etc.
- Clean, dark UI using CSS variables for easy theming.

---

## 🗂 Project structure

```
Portfolio-website/
├── index.html         ← main page
├── portfolio.css      ← all styles
├── portfolio.js       ← interactive scripts
├── README.md          ← you’re reading it
└── assets/            ← (optional) images, fonts, etc.
```

---

## 🛠 Technologies

- **HTML5** – semantic markup
- **CSS3** – flexbox, grid, custom properties, animations
- **JavaScript (ES6+)** – DOM, canvas, intersection observers
- **EmailJS** – for contact form (third‑party service)  
- No frameworks – zero build steps, just open in browser.

---

## 📥 Getting started

### Requirements

Any modern web browser (Chrome, Firefox, Edge, Safari) and a text editor such
as VS Code.

### Run locally

1. Clone the repo:

   ```bash
   git clone https://github.com/Mukul09kukreja/Portfolio-website.git
   cd Portfolio-website
   ```

2. Open `index.html` in your browser, or use the **Live Server** extension in
   VS Code for live reload.

---

## ⚙️ Configuration

### EmailJS contact form

To make the “Send Message” form work you need an EmailJS account:

1. Sign up at [emailjs.com](https://emailjs.com).
2. Add an email service (e.g. Gmail) and copy the **Service ID**.
3. Create a template and note the **Template ID**.
4. Get your **Public Key** from the account dashboard.
5. In `portfolio.js`, replace the placeholder constants:

   ```js
   const EMAILJS_SERVICE_ID  = 'service_abc123';
   const EMAILJS_TEMPLATE_ID = 'template_xyz789';
   const EMAILJS_PUBLIC_KEY  = 'AbCdEfGhIjKlMnOp';
   ```

The form will then send messages to the email you configured. If the keys are
left as the defaults the script shows an error banner.

---

## ✏️ Customization

- **Personal info** – edit text in `index.html` (hero, about, projects, contact).
- **Projects** – add/remove entries in the projects section (featured or grid).
- **Skills** – adjust the `<div class="skill-item">…</div>` blocks.
- **Color scheme** – change CSS variables under `:root` in `portfolio.css`.
- **Fonts** – loaded via Google Fonts in the `<head>` of `index.html`.

---

## 📱 Responsive breakpoints

- Desktop: `>1024px`  
- Tablet: `768px – 1024px`  
- Mobile: `<768px` (cursor hidden, simplified layout)

---

## 🚀 Deployment

This site is already hosted on **GitHub Pages** at:

> `https://mukul09kukreja.github.io/Portfolio-website/`

To update:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Changes are served automatically from `main`. Other hosts (Netlify, Vercel) will
also work; just point them at this repo.

---

## 🤝 Contributing

Although it’s a personal portfolio, pull requests with improvements are welcome.

1. Fork the repository  
2. Create a branch (`git checkout -b feature/…`)  
3. Commit your changes (`git commit -m 'Describe change'`)  
4. Push and open a PR

---

## 📄 License

MIT © 2026 Mukul Kukreja

---

Thanks for checking out the code – built with curiosity & caffeine.
