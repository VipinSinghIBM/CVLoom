/* CVLoom V3 — main.js */
(function(){
  const html       = document.documentElement;
  const preloader  = document.querySelector('.preloader');
  const header     = document.querySelector('.site-header');
  const themeBtn   = document.querySelector('[data-theme-btn]');
  const hamburger  = document.querySelector('[data-hamburger]');
  const mobileNav  = document.querySelector('[data-mobile-nav]');
  const cursorGlow = document.querySelector('.cursor-glow');

  /* PRELOADER */
  window.addEventListener('load',()=>{
    setTimeout(()=>preloader?.classList.add('hidden'),800);
  });

  /* THEME */
  const savedTheme = localStorage.getItem('cvl-theme');
  const sysDark    = window.matchMedia('(prefers-color-scheme:dark)').matches;
  let theme        = savedTheme || (sysDark ? 'dark' : 'light');
  applyTheme(theme);
  themeBtn?.addEventListener('click',()=>{
    theme = theme==='dark' ? 'light' : 'dark';
    applyTheme(theme);
    localStorage.setItem('cvl-theme',theme);
  });
  function applyTheme(t){
    html.setAttribute('data-theme',t);
    const icon = themeBtn?.querySelector('.theme-icon');
    if(icon) icon.className='theme-icon '+(t==='dark'?'sun':'');
  }

  /* HEADER SCROLL */
  const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>20);
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  /* HAMBURGER */
  hamburger?.addEventListener('click',()=>{
    const open=mobileNav?.classList.toggle('open');
    hamburger.setAttribute('aria-expanded',String(open));
  });
  document.addEventListener('click',e=>{
    if(mobileNav?.classList.contains('open')&&!header?.contains(e.target)){
      mobileNav.classList.remove('open');
      hamburger?.setAttribute('aria-expanded','false');
    }
  });

  /* ACTIVE NAV */
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.site-nav a,.mobile-nav a').forEach(a=>{
    const href=a.getAttribute('href');
    if(href===page||(page===''&&href==='index.html')) a.classList.add('active');
  });

  /* CURSOR GLOW */
  if(window.matchMedia('(pointer:fine)').matches&&cursorGlow){
    window.addEventListener('mousemove',e=>{
      cursorGlow.style.opacity='1';
      cursorGlow.style.left=e.clientX+'px';
      cursorGlow.style.top=e.clientY+'px';
    },{passive:true});
    document.addEventListener('mouseleave',()=>cursorGlow.style.opacity='0');
  }

  /* REVEAL */
  const revealEls=document.querySelectorAll('[data-reveal]');
  if(revealEls.length){
    const ro=new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          const delay=en.target.dataset.delay||0;
          setTimeout(()=>en.target.classList.add('visible'),+delay);
          ro.unobserve(en.target);
        }
      });
    },{threshold:.15});
    revealEls.forEach(el=>ro.observe(el));
  }

  /* COUNTER */
  const counters=document.querySelectorAll('[data-counter]');
  if(counters.length){
    const co=new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting){animCounter(en.target);co.unobserve(en.target);}
      });
    },{threshold:.6});
    counters.forEach(c=>co.observe(c));
  }
  function animCounter(el){
    const target=+el.dataset.counter;
    const suffix=el.dataset.suffix||'';
    const dur=1600;const start=performance.now();
    const tick=now=>{
      const p=Math.min((now-start)/dur,1);
      el.textContent=Math.floor(easeOut(p)*target)+suffix;
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function easeOut(t){return 1-Math.pow(1-t,3)}

  /* HERO SLIDER */
  const track=document.querySelector('[data-slider-track]');
  const dots=document.querySelectorAll('[data-dot]');
  const slides=document.querySelectorAll('.hero-slide');
  let idx=0,timer;
  function goSlide(i){
    idx=(i+slides.length)%slides.length;
    if(track) track.style.transform=`translateX(-${idx*100}%)`;
    dots.forEach((d,j)=>d.classList.toggle('active',j===idx));
  }
  dots.forEach(d=>d.addEventListener('click',()=>{goSlide(+d.dataset.dot);reset();}));
  function reset(){clearInterval(timer);timer=setInterval(()=>goSlide(idx+1),5000);}
  if(slides.length){goSlide(0);reset();}

  /* FILTER */
  const chips=document.querySelectorAll('[data-filter]');
  const tpls=document.querySelectorAll('[data-tpl]');
  chips.forEach(chip=>{
    chip.addEventListener('click',()=>{
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      const f=chip.dataset.filter;
      tpls.forEach(t=>t.classList.toggle('hidden',f!=='all'&&!t.dataset.tpl.includes(f)));
    });
  });

  /* REVIEW PAUSE */
  const rt=document.querySelector('.review-track');
  rt?.addEventListener('mouseenter',()=>rt.style.animationPlayState='paused');
  rt?.addEventListener('mouseleave',()=>rt.style.animationPlayState='running');

})();

/* ============================================================
   CVLoom — main.js
   All pages JavaScript — one file, zero dependencies
   ============================================================ */

'use strict';

/* ── UTILS ─────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ============================================================
   1. PRELOADER
   ============================================================ */
(function initPreloader() {
  const loader = qs('.preloader');
  if (!loader) return;
  window.addEventListener('load', () => {
    loader.classList.add('preloader--done');
    setTimeout(() => loader.remove(), 700);
  });
})();

/* ============================================================
   2. CURSOR GLOW
   ============================================================ */
(function initCursor() {
  const glow = qs('.cursor-glow');
  if (!glow || window.matchMedia('(pointer:coarse)').matches) {
    if (glow) glow.remove();
    return;
  }
  let mx = 0, my = 0, cx = 0, cy = 0, raf;
  on(document, 'mousemove', e => { mx = e.clientX; my = e.clientY; });
  function loop() {
    cx += (mx - cx) * .12;
    cy += (my - cy) * .12;
    glow.style.transform = `translate(${cx}px,${cy}px)`;
    raf = requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   3. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const btn  = qs('[data-theme-btn]');
  const html = document.documentElement;
  const KEY  = 'cvloom-theme';

  function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
    if (btn) {
      const icon = qs('.theme-icon', btn);
      if (icon) {
        icon.className = 'theme-icon ' + (t === 'dark' ? 'sun' : 'moon');
      }
    }
  }

  // Load saved
  const saved = localStorage.getItem(KEY) || 'dark';
  setTheme(saved);

  on(btn, 'click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();

/* ============================================================
   4. STICKY HEADER + HIDE ON SCROLL
   ============================================================ */
(function initHeader() {
  const header = qs('[data-header]');
  if (!header) return;
  let last = 0, ticking = false;

  function update() {
    const y = window.scrollY;
    header.classList.toggle('header--scrolled', y > 20);
    header.classList.toggle('header--hidden', y > last + 80 && y > 200);
    header.classList.toggle('header--visible', y < last - 10);
    last = y;
    ticking = false;
  }

  on(window, 'scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* ============================================================
   5. HAMBURGER MOBILE NAV
   ============================================================ */
(function initHamburger() {
  const btn = qs('[data-hamburger]');
  const nav = qs('[data-mobile-nav]');
  if (!btn || !nav) return;

  on(btn, 'click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.classList.toggle('is-open', !open);
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('nav-open', !open);
  });

  // Close on outside click
  on(document, 'click', e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }
  });
})();

/* ============================================================
   6. SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const els = qsa('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('revealed'), Number(delay));
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ============================================================
   7. COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const els = qsa('[data-counter]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.counter;
      const suffix = el.dataset.suffix || '';
      const dur    = 1600;
      const start  = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();

/* ============================================================
   8. HERO SLIDER
   ============================================================ */
(function initSlider() {
  const track = qs('[data-slider-track]');
  if (!track) return;

  const slides = qsa('.hero-slide', track);
  const dots   = qsa('[data-dot]');
  let current  = 0;
  let timer;

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  // Set initial
  slides[0].classList.add('active');

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  dots.forEach(dot => {
    on(dot, 'click', () => {
      goTo(+dot.dataset.dot);
      startAuto();
    });
  });

  // Touch swipe
  let startX = 0;
  on(track, 'touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  on(track, 'touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  });

  startAuto();
})();

/* ============================================================
   9. TEMPLATE FILTER + SEARCH
   ============================================================ */
(function initTemplateFilter() {
  const chips   = qsa('[data-filter]');
  const cards   = qsa('[data-tpl]');
  const empty   = qs('#tplEmpty');
  const search  = qs('#tplSearch');
  if (!chips.length) return;

  let activeFilter = 'all';
  let searchVal    = '';

  function filter() {
    let visible = 0;
    cards.forEach(card => {
      const cats    = card.dataset.tpl || '';
      const title   = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc    = card.querySelector('p')?.textContent.toLowerCase()  || '';
      const matchF  = activeFilter === 'all' || cats.includes(activeFilter);
      const matchS  = !searchVal || title.includes(searchVal) || desc.includes(searchVal);
      const show    = matchF && matchS;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.style.display = visible === 0 ? 'flex' : 'none';
  }

  chips.forEach(chip => {
    on(chip, 'click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      filter();
    });
  });

  if (search) {
    on(search, 'input', () => {
      searchVal = search.value.toLowerCase().trim();
      filter();
    });
  }
})();

/* ============================================================
   10. REVIEWS FILTER
   ============================================================ */
(function initReviewFilter() {
  const chips = qsa('[data-rev-filter]');
  const cards = qsa('[data-rev]');
  const empty = qs('#revEmpty');
  if (!chips.length) return;

  chips.forEach(chip => {
    on(chip, 'click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.revFilter;
      let visible = 0;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.rev === f;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (empty) empty.style.display = visible === 0 ? 'flex' : 'none';
    });
  });
})();

/* ============================================================
   11. PRICING TOGGLE (Individual / Bundle)
   ============================================================ */
(function initPricingToggle() {
  const toggle  = qs('#priceToggle');
  const amounts = qsa('[data-ind]');
  if (!toggle) return;

  on(toggle, 'click', () => {
    const isBundle = toggle.getAttribute('aria-pressed') === 'true';
    toggle.setAttribute('aria-pressed', String(!isBundle));
    const useBundle = !isBundle;

    amounts.forEach(el => {
      const val = useBundle ? el.dataset.bun : el.dataset.ind;
      // Animate number change
      const current = +el.textContent.replace(/,/g, '');
      const target  = +val;
      const dur     = 500;
      const start   = performance.now();
      function tick(now) {
        const p    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(current + (target - current) * ease)
          .toLocaleString('en-IN');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    // Highlight active label
    qs('#lblMonthly')?.classList.toggle('price-toggle-label--active', !useBundle);
    qs('#lblAnnual')?.classList.toggle('price-toggle-label--active', useBundle);
  });
})();

/* ============================================================
   12. BUDGET CHIPS (Contact form)
   ============================================================ */
(function initBudgetChips() {
  const chips  = qsa('.budget-chip');
  const hidden = qs('#budget');
  if (!chips.length) return;

  chips.forEach(chip => {
    on(chip, 'click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (hidden) hidden.value = chip.dataset.budget;
    });
  });
})();

/* ============================================================
   13. CONTACT FORM VALIDATION + SUBMIT
   ============================================================ */
(function initContactForm() {
  const form    = qs('#contactForm');
  if (!form) return;

  const submitBtn  = qs('#formSubmit');
  const successBox = qs('#formSuccess');

  function showErr(id, msg) {
    const el = qs('#' + id);
    if (el) el.textContent = msg;
    const input = qs('#' + id.replace('Err', ''));
    if (input) input.classList.toggle('is-error', !!msg);
  }

  function clearErrs() {
    qsa('.form-err', form).forEach(el => el.textContent = '');
    qsa('.is-error', form).forEach(el => el.classList.remove('is-error'));
  }

  function validate() {
    clearErrs();
    let valid = true;

    const fname   = qs('#fname', form).value.trim();
    const lname   = qs('#lname', form).value.trim();
    const email   = qs('#email', form).value.trim();
    const service = qs('#service', form).value;
    const message = qs('#message', form).value.trim();

    if (!fname)  { showErr('fnameErr', 'First name is required.'); valid = false; }
    if (!lname)  { showErr('lnameErr', 'Last name is required.');  valid = false; }
    if (!email)  {
      showErr('emailErr', 'Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErr('emailErr', 'Please enter a valid email.');
      valid = false;
    }
    if (!service) { showErr('serviceErr', 'Please select a service.'); valid = false; }
    if (!message || message.length < 20) {
      showErr('messageErr', 'Please tell us a bit more (min 20 characters).');
      valid = false;
    }

    return valid;
  }

  on(form, 'submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    // Loading state
    const textEl    = qs('.submit-text', submitBtn);
    const loadingEl = qs('.submit-loading', submitBtn);
    submitBtn.disabled = true;
    if (textEl)    textEl.style.display    = 'none';
    if (loadingEl) loadingEl.style.display = 'inline-flex';

    // Simulate async submit (replace with real fetch/API)
    await new Promise(r => setTimeout(r, 1800));

    // Success
    form.style.display    = 'none';
    if (successBox) successBox.style.display = 'flex';
  });

  // Live validation on blur
  qsa('[required]', form).forEach(input => {
    on(input, 'blur', () => {
      if (!input.value.trim()) {
        input.classList.add('is-error');
      } else {
        input.classList.remove('is-error');
        const errId = input.id + 'Err';
        const errEl = qs('#' + errId);
        if (errEl) errEl.textContent = '';
      }
    });
  });
})();

/* ============================================================
   14. MARQUEE PAUSE ON HOVER
   ============================================================ */
(function initMarquee() {
  const track = qs('.marquee-track');
  if (!track) return;
  on(track, 'mouseenter', () => track.style.animationPlayState = 'paused');
  on(track, 'mouseleave', () => track.style.animationPlayState = 'running');
})();

/* ============================================================
   15. SMOOTH SCROLL (anchor links)
   ============================================================ */
(function initSmoothScroll() {
  on(document, 'click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = qs(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ============================================================
   16. FAB TOOLTIP ON HOVER (mobile)
   ============================================================ */
(function initFab() {
  const fabs = qsa('.fab');
  fabs.forEach(fab => {
    on(fab, 'mouseenter', () => fab.classList.add('fab--hovered'));
    on(fab, 'mouseleave', () => fab.classList.remove('fab--hovered'));
  });
})();

/* ============================================================
   17. ACTIVE NAV HIGHLIGHT (current page)
   ============================================================ */
(function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.site-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
    else link.classList.remove('active');
  });
})();

/* ============================================================
   18. PRICING TOGGLE LABEL STYLE
   ============================================================ */
(function initPricingLabelStyle() {
  const lbl1 = qs('#lblMonthly');
  const lbl2 = qs('#lblAnnual');
  if (!lbl1 || !lbl2) return;
  lbl1.classList.add('price-toggle-label--active');
})();

