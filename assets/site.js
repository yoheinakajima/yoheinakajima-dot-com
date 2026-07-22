(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('.execution-section')];
  const stepLinks = [...document.querySelectorAll('.run-steps a')];
  const progressBar = document.getElementById('runProgress');
  const state = document.getElementById('runState');
  const year = document.getElementById('year');

  if (year) year.textContent = String(new Date().getFullYear());

  const setActiveSection = (id, label) => {
    let activeIndex = 0;

    stepLinks.forEach((link, index) => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('active', isActive);
      if (isActive) activeIndex = index;
    });

    stepLinks.forEach((link, index) => {
      link.classList.toggle('complete', index < activeIndex);
    });

    if (state) state.textContent = label || 'profile running';
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  } else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
  }

  const updateCurrentSection = () => {
    if (!sections.length) return;
    const marker = window.scrollY + window.innerHeight * 0.36;
    let current = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= marker) current = section;
    });

    setActiveSection(current.id, current.dataset.runLabel);
  };

  const updateProgress = () => {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    if (progressBar) progressBar.style.width = `${ratio * 100}%`;
    updateCurrentSection();
  };

  let progressTicking = false;
  const requestProgressUpdate = () => {
    if (progressTicking) return;
    progressTicking = true;
    window.requestAnimationFrame(() => {
      updateProgress();
      progressTicking = false;
    });
  };

  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate);
  updateProgress();

  stepLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.getElementById(link.dataset.section);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const videoConfig = {
    ted: {
      src: 'https://embed.ted.com/talks/yohei_nakajima_how_ai_will_help_us_connect_with_ourselves_and_each_other',
      title: 'TEDAI talk: How AI will help us connect with ourselves and each other',
      allow: 'autoplay; fullscreen; picture-in-picture'
    },
    aiengineer: {
      src: 'https://www.youtube-nocookie.com/embed/khVX_BUnEwU?autoplay=1',
      title: 'AI Engineer talk: Active Graph Agent Runtime',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    }
  };

  document.querySelectorAll('[data-video]').forEach((button) => {
    button.addEventListener('click', () => {
      const config = videoConfig[button.dataset.video];
      if (!config || button.querySelector('iframe')) return;

      const iframe = document.createElement('iframe');
      iframe.src = config.src;
      iframe.title = config.title;
      iframe.allow = config.allow;
      iframe.allowFullscreen = true;
      iframe.loading = 'eager';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      button.replaceChildren(iframe);
    });
  });

  if (!reducedMotion && state) {
    const objective = 'initializing profile';
    state.textContent = '';
    let index = 0;
    const type = () => {
      state.textContent = objective.slice(0, index);
      index += 1;
      if (index <= objective.length) {
        window.setTimeout(type, 34);
      } else {
        window.setTimeout(updateCurrentSection, 280);
      }
    };
    type();
  }
})();
