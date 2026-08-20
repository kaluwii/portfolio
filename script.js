/* =========================================================
   Kalyan Shrestha — Portfolio interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'light' ? 'light_mode' : 'dark_mode';
    try { localStorage.setItem('portfolio-theme', theme); } catch (e) { /* storage unavailable */ }
  }

  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('portfolio-theme') || 'dark'; } catch (e) { /* ignore */ }
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  });

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';
  }

  /* ---------- Parallax hero background ---------- */
  const heroBg = document.querySelector('.hero-bg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ticking = false;
  function onScroll(){
    updateScrollProgress();

    if (!reduceMotion && heroBg){
      const scrollTop = window.scrollY;
      heroBg.style.transform = `translateY(${scrollTop * 0.25}px)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking){
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  updateScrollProgress();

  /* ---------- Mobile nav ---------- */
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  function closeNav(){
    navLinks.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    navBurger.querySelector('.material-symbols-outlined').textContent = 'menu';
  }

  navBurger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', String(isOpen));
    navBurger.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'menu';
  });

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navItems.forEach(item => {
          item.classList.toggle('active-link', item.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated skill bars ---------- */
  const skills = document.querySelectorAll('.skill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const skill = entry.target;
      const percent = parseInt(skill.dataset.percent, 10) || 0;
      const fill = skill.querySelector('.skill-fill');
      const label = skill.querySelector('.skill-percent');

      requestAnimationFrame(() => { fill.style.width = percent + '%'; });

      let current = 0;
      const step = Math.max(1, Math.round(percent / 40));
      const counter = setInterval(() => {
        current = Math.min(percent, current + step);
        label.textContent = current + '%';
        if (current >= percent) clearInterval(counter);
      }, 20);

      skillObserver.unobserve(skill);
    });
  }, { threshold: 0.4 });

  skills.forEach(skill => skillObserver.observe(skill));

  /* ---------- Hero role rotator ---------- */
  const roles = [
    'Computing Student',
    'Python & Java Developer',
    'IoT & Robotics Builder',
    'Problem Solver'
  ];
  const roleEl = document.getElementById('roleText');
  let roleIndex = 0;

  if (roleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.style.opacity = '0';
      setTimeout(() => {
        roleEl.textContent = roles[roleIndex];
        roleEl.style.opacity = '1';
      }, 250);
    }, 2800);
    roleEl.style.transition = 'opacity .25s ease';
  }

  /* ---------- Project card tilt on hover ---------- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Toast helper ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message){
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
  }

  /* ---------- Copy email to clipboard ---------- */
  const mailtoLink = document.getElementById('mailtoLink');
  if (mailtoLink){
    mailtoLink.addEventListener('click', (e) => {
      const email = mailtoLink.textContent.trim();
      if (navigator.clipboard){
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email copied to clipboard');
        }).catch(() => { window.location.href = mailtoLink.href; });
      }
    });
  }

  /* ---------- Contact form validation + submit ---------- */
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');
  const sendBtnText = document.getElementById('sendBtnText');
  const formStatus = document.getElementById('formStatus');

  function setError(field, message){
    const row = field.closest('.form-row');
    const errorEl = row.querySelector('.form-error');
    row.classList.toggle('invalid', Boolean(message));
    errorEl.textContent = message || '';
  }

  function validateForm(){
    let valid = true;
    const name = form.elements['name'];
    const email = form.elements['email'];
    const message = form.elements['message'];

    if (!name.value.trim()){
      setError(name, 'Please enter your name');
      valid = false;
    } else setError(name, '');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())){
      setError(email, 'Please enter a valid email');
      valid = false;
    } else setError(email, '');

    if (message.value.trim().length < 10){
      setError(message, 'Message should be at least 10 characters');
      valid = false;
    } else setError(message, '');

    return valid;
  }

  if (form){
    ['name', 'email', 'message'].forEach(fieldName => {
      form.elements[fieldName].addEventListener('input', () => {
        setError(form.elements[fieldName], '');
      });
    });

    form.addEventListener('submit', (e) => {
      if (!validateForm()){
        e.preventDefault();
        formStatus.textContent = 'Please fix the highlighted fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Let the form submit normally to FormSubmit; show a pending state meanwhile.
      sendBtn.disabled = true;
      sendBtnText.textContent = 'Sending...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    });
  }
});
