document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // animate hamburger to X
      menuToggle.classList.toggle('open');
    });

    // Close the mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.classList.remove('open');
        }
      });
    });
  }

  // Keep the scroll, IntersectionObserver, and welcome message logic from before:
  // Smooth scroll for nav links (for older browsers)
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Scroll indicator: scroll to next section (about)
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) {
    indicator.addEventListener('click', () => {
      const next = document.querySelector('#about');
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Inline welcome message button
  const button = document.querySelector("#welcomeBtn");
  const message = document.querySelector("#message");
  if (button) {
    button.addEventListener("click", () => {
      message.textContent = "Welcome to my portfolio! Thanks for visiting ✨";
      message.classList.add("show");
      setTimeout(() => message.classList.remove("show"), 4000);
    });
  }

  // IntersectionObserver: highlight nav link for visible section
  const topNavLinks = document.querySelectorAll('.topnav a');
  const sections = document.querySelectorAll('.snap-section[id]');
  if (sections.length && topNavLinks.length) {
    const obsOptions = { root: null, rootMargin: '0px', threshold: 0.55 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector('.topnav a[href="#' + id + '"]');
        if (link) {
          if (entry.isIntersecting) {
            topNavLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    }, obsOptions);
    sections.forEach(s => observer.observe(s));
  }
});