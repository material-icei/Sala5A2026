/* ============================================
   GALERÍA DE DIOSES GRIEGOS — dioses-script.js
   Reproduce el video (muteado, en loop) al pasar
   el mouse; en touch, el primer toque reproduce
   y un toque afuera de la tarjeta lo pausa.
   ============================================ */

(function () {
  const cards = document.querySelectorAll('.dios-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const media   = card.querySelector('.dios-media');
    const video   = card.querySelector('video');
    const videoSrc = card.dataset.video;
    let loaded = false;

    function ensureLoaded() {
      if (!loaded && videoSrc) {
        video.src = videoSrc;
        loaded = true;
      }
    }

    function playVideo() {
      ensureLoaded();
      card.classList.add('is-playing');
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* autoplay bloqueado: se queda mostrando la imagen */
          card.classList.remove('is-playing');
        });
      }
    }

    function stopVideo() {
      card.classList.remove('is-playing');
      video.pause();
      video.currentTime = 0;
    }

    // ---- Mouse (desktop) ----
    media.addEventListener('mouseenter', playVideo);
    media.addEventListener('mouseleave', stopVideo);

    // ---- Touch (tablets / celulares) ----
    media.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (card.classList.contains('is-playing')) {
        stopVideo();
      } else {
        // Pausar cualquier otra tarjeta reproduciéndose
        cards.forEach((c) => {
          if (c !== card) {
            const v = c.querySelector('video');
            c.classList.remove('is-playing');
            v.pause();
            v.currentTime = 0;
          }
        });
        playVideo();
      }
    }, { passive: false });
  });

  // Pausar todo si se toca fuera de la galería (en touch)
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.dios-card')) {
      cards.forEach((c) => {
        const v = c.querySelector('video');
        c.classList.remove('is-playing');
        v.pause();
        v.currentTime = 0;
      });
    }
  }, { passive: true });
})();
