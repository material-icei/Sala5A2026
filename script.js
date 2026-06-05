/* ============================================
   TESOROS DEL PASADO — script.js
   ============================================ */

// ---------- Partículas de fondo ----------
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const symbols = ['⭐', '✨', '💛', '🌟', '🔶', '🟡', '🪙', '💫', '🔸'];
  const COUNT = 18;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.classList.add('particle');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const size  = 0.8 + Math.random() * 1.2;
    const left  = Math.random() * 100;
    const delay = Math.random() * 18;
    const dur   = 12 + Math.random() * 16;

    el.style.cssText = `
      font-size: ${size}rem;
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(el);
  }
})();


// ---------- Timeline reveal on scroll ----------
(function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = parseFloat(el.dataset.delay || 0) * 150;
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.25 }
  );

  items.forEach((item) => observer.observe(item));
})();


// ---------- Card entrance animation ----------
(function initCards() {
  const cards = document.querySelectorAll('.civ-card');
  if (!cards.length) return;

  // Initial state via JS so CSS still works without JS
  cards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = Array.from(cards).indexOf(el);
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, idx * 100);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card) => observer.observe(card));
})();


// ---------- Card wiggle on click (ready cards only) ----------
(function initCardWiggle() {
  document.querySelectorAll('.civ-card:not(.coming-soon)').forEach((card) => {
    card.addEventListener('click', function () {
      this.style.animation = 'none';
      void this.offsetWidth; // reflow
      this.style.animation = 'wiggle 0.5s ease';
    });
  });

  // Inject wiggle keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes wiggle {
      0%,100% { transform: translateY(-8px) rotate(0deg); }
      25%      { transform: translateY(-8px) rotate(-4deg); }
      75%      { transform: translateY(-8px) rotate(4deg); }
    }
  `;
  document.head.appendChild(style);
})();


// ---------- Confetti burst on page load ----------
(function confettiOnLoad() {
  const COLORS   = ['#F5C842', '#E8A010', '#C24E28', '#4AAFCC', '#3A8F5C', '#FFF'];
  const EMOJIS   = ['⭐', '✨', '🏺', '💎'];
  const TOTAL    = 40;

  window.addEventListener('load', () => {
    setTimeout(launch, 600);
  });

  function launch() {
    for (let i = 0; i < TOTAL; i++) {
      setTimeout(() => spawnPiece(), i * 28);
    }
  }

  function spawnPiece() {
    const isEmoji = Math.random() < 0.3;
    const el = document.createElement('div');

    if (isEmoji) {
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      el.style.fontSize = '1.4rem';
    } else {
      const size = 8 + Math.random() * 10;
      el.style.width  = size + 'px';
      el.style.height = size + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    const startX = Math.random() * window.innerWidth;
    el.style.cssText += `
      position: fixed;
      left: ${startX}px;
      top: -20px;
      pointer-events: none;
      z-index: 9999;
    `;

    document.body.appendChild(el);

    const vy    = 3 + Math.random() * 5;
    const vx    = (Math.random() - 0.5) * 4;
    const rot   = Math.random() * 720 - 360;
    let   posY  = -20;
    let   posX  = startX;
    let   angle = 0;
    let   alpha = 1;

    function tick() {
      posY  += vy;
      posX  += vx;
      angle += rot / 60;
      alpha -= 0.008;

      el.style.top       = posY + 'px';
      el.style.left      = posX + 'px';
      el.style.transform = `rotate(${angle}deg)`;
      el.style.opacity   = Math.max(0, alpha);

      if (posY < window.innerHeight + 60 && alpha > 0) {
        requestAnimationFrame(tick);
      } else {
        el.remove();
      }
    }
    requestAnimationFrame(tick);
  }
})();


// ---------- Smooth scroll for hero CTA ----------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
