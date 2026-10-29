(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const loginTab = $('#loginTab');
  const signupTab = $('#signupTab');
  const authTabs = $('.auth-tabs');
  const loginForm = $('#loginForm');
  const signupForm = $('#signupForm');
  const authTitle = $('#authTitle');
  const authDescription = $('#authDescription');
  const tabIndicator = $('#tabIndicator');
  const authPanel = $('#authPanel');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#yearNow').textContent = new Date().getFullYear();

  function setMode(mode, focus = false) {
    const signup = mode === 'signup';
    loginTab.classList.toggle('is-active', !signup);
    signupTab.classList.toggle('is-active', signup);
    loginTab.setAttribute('aria-selected', String(!signup));
    signupTab.setAttribute('aria-selected', String(signup));
    authTabs.classList.toggle('signup-active', signup);
    loginForm.hidden = signup;
    signupForm.hidden = !signup;
    authTitle.innerHTML = signup ? 'Make this space<br /><span>yours.</span>' : 'Your next chapter<br /><span>starts here.</span>';
    authDescription.textContent = signup
      ? 'Create your student profile and imagine a more organised semester.'
      : 'Sign in to your learning space and pick up where your curiosity left off.';
    $$('.auth-message').forEach(message => {
      message.classList.remove('is-visible', 'is-error');
      message.textContent = '';
    });
    if (focus) {
      const target = signup ? $('#signupName') : $('#loginEmail');
      target?.focus({ preventScroll: true });
    }
  }

  loginTab.addEventListener('click', () => setMode('login'));
  signupTab.addEventListener('click', () => setMode('signup'));
  $$('[data-switch]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.switch, true)));

  function showMessage(id, message, isError = false) {
    const target = $(id);
    target.textContent = message;
    target.classList.toggle('is-error', isError);
    target.classList.add('is-visible');
  }

  function emailLooksValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value;
    if (!emailLooksValid(email)) {
      showMessage('#loginMessage', 'Enter a valid email address to preview the form.', true);
      $('#loginEmail').focus();
      return;
    }
    if (password.length < 8) {
      showMessage('#loginMessage', 'Enter at least 8 characters in the password field.', true);
      $('#loginPassword').focus();
      return;
    }
    showMessage('#loginMessage', 'This is a UI-only preview, so your details were not sent or saved. Use “Explore the dashboard preview” below to open the interface.');
  });

  signupForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#signupName').value.trim();
    const email = $('#signupEmail').value.trim();
    const password = $('#signupPassword').value;
    if (name.length < 2) {
      showMessage('#signupMessage', 'Enter your name to continue.', true);
      $('#signupName').focus();
      return;
    }
    if (!emailLooksValid(email)) {
      showMessage('#signupMessage', 'Enter a valid college email address.', true);
      $('#signupEmail').focus();
      return;
    }
    if (password.length < 8) {
      showMessage('#signupMessage', 'Choose a password with at least 8 characters.', true);
      $('#signupPassword').focus();
      return;
    }
    if (!$('#acceptTerms').checked) {
      showMessage('#signupMessage', 'Please tick the confirmation box to continue.', true);
      $('#acceptTerms').focus();
      return;
    }
    showMessage('#signupMessage', 'Registration is not connected in this UI preview. Your information has not been sent or saved.');
  });

  $('#forgotPassword').addEventListener('click', () => {
    const email = $('#loginEmail').value.trim();
    showMessage('#loginMessage', emailLooksValid(email)
      ? 'Password recovery is a visual demo only; no recovery email was sent.'
      : 'Enter your email address first. Password recovery is not connected in this demo.', !emailLooksValid(email));
    if (!emailLooksValid(email)) $('#loginEmail').focus();
  });

  $$('.password-toggle').forEach(button => button.addEventListener('click', () => {
    const input = $('#' + button.dataset.password);
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.textContent = visible ? 'Hide' : 'Show';
    button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
  }));

  // Subtle 3D parallax in the left-hand illustration. The auth panel stays fixed.
  const storyPanel = $('#storyPanel');
  const scene = $('#heroScene');
  const sceneItems = $$('.scene-item', scene);
  if (!reducedMotion && scene && window.matchMedia('(pointer: fine)').matches) {
    scene.addEventListener('pointermove', event => {
      const rect = scene.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      sceneItems.forEach(item => {
        const depth = Number(item.dataset.depth || 1);
        item.style.setProperty('--px', `${(-dx * depth * 12).toFixed(1)}px`);
        item.style.setProperty('--py', `${(-dy * depth * 9).toFixed(1)}px`);
      });
    });
    scene.addEventListener('pointerleave', () => sceneItems.forEach(item => {
      item.style.setProperty('--px', '0px');
      item.style.setProperty('--py', '0px');
    }));
    storyPanel.addEventListener('scroll', () => {
      const rect = scene.getBoundingClientRect();
      const offset = Math.max(-12, Math.min(12, (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.025));
      sceneItems.forEach(item => item.style.setProperty('--scroll-shift', `${offset.toFixed(1)}px`));
    }, { passive: true });
  }

  // The transform's translate component remains independent from each card's 3D rotation.
  sceneItems.forEach(item => {
    item.style.translate = 'var(--px, 0px) var(--py, 0px)';
  });

  $('#backToTop').addEventListener('click', event => {
    event.preventDefault();
    storyPanel.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  // Smooth anchors scroll the content panel rather than the whole browser window.
  $$('a[href^="#"]:not(#backToTop)').forEach(link => {
    link.addEventListener('click', event => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      if (window.matchMedia('(max-width: 900px)').matches) return;
      event.preventDefault();
      const panelRect = storyPanel.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      storyPanel.scrollTo({ top: storyPanel.scrollTop + targetRect.top - panelRect.top - 18, behavior: reducedMotion ? 'auto' : 'smooth' });
      if (target === authPanel) $('#loginEmail').focus({ preventScroll: true });
    });
  });
})();
