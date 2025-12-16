(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const THEME_KEY = 'theme-preference';

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-pressed', theme === 'dark');
    }
  };

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Mobile menu
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.style.display = 'none';
    navMenu.classList.add('closed');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menú');
  };

  const openMenu = () => {
    if (!navMenu) return;
    navMenu.style.display = 'flex';
    navMenu.classList.remove('closed');
    menuToggle?.setAttribute('aria-expanded', 'true');
    menuToggle?.setAttribute('aria-label', 'Cerrar menú');
  };

  const handleResize = () => {
    if (!navMenu) return;
    if (!mobileQuery.matches) {
      navMenu.style.display = '';
      navMenu.classList.remove('closed');
      menuToggle?.setAttribute('aria-expanded', 'false');
    } else {
      closeMenu();
    }
  };

  menuToggle?.addEventListener('click', () => {
    if (!navMenu) return;
    const isOpen = navMenu.style.display === 'flex';
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileQuery.matches) closeMenu();
    });
  });

  mobileQuery.addEventListener('change', handleResize);
  handleResize();

  // Countdown
  const targetDate = new Date('2026-01-05T16:00:00-06:00').getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownMessage = document.getElementById('countdownMessage');

  const updateCountdown = () => {
    const now = Date.now();
    const diff = targetDate - now;
    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      countdownMessage.textContent = '¡Hoy iniciamos! ✅';
      return true;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    countdownMessage.textContent = '';
    return false;
  };

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    const ended = updateCountdown();
    if (!ended) {
      const timer = setInterval(() => {
        if (updateCountdown()) clearInterval(timer);
      }, 1000);
    }
  }

  // Accordion
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        panel.classList.add('open');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        panel.classList.remove('open');
        panel.style.maxHeight = '0';
      }
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.accordion-panel.open').forEach((panel) => {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    });
  });

  // Fade-in on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('[data-observe]').forEach((el) => observer.observe(el));

  // Active link on scroll
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const linkMap = new Map(
    navLinks.map((link) => [link.getAttribute('href'), link])
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        const link = linkMap.get(id);
        if (link) {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();
