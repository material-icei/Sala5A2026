/**
 * TESOROS DEL PASADO — Sala de Escape
 * Game engine: state machine + puzzle renderers
 */

'use strict';

/* ═══════════════════════════════════════════
   UTILS
═══════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const show = id => $(id).classList.remove('hidden');
const hide = id => $(id).classList.add('hidden');

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeText(str) {
  return str.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* ═══════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════ */
function spawnParticles(containerId) {
  const c = $(containerId);
  if (!c) return;
  const syms = ['⭐','✨','💛','🌟','🔶','🟡','🪙'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = syms[i % syms.length];
    el.style.cssText = `left:${Math.random()*100}%;animation-duration:${12+Math.random()*14}s;animation-delay:-${Math.random()*20}s;font-size:${0.8+Math.random()*1}rem;`;
    c.appendChild(el);
  }
}

/* ═══════════════════════════════════════════
   TIMELINE MODULE
═══════════════════════════════════════════ */
const Timeline = (() => {
  let open = false;

  function init() {
    const track = $('tl-track');
    track.innerHTML = '';
    LEVELS.forEach((lvl, i) => {
      const item = document.createElement('div');
      item.className = 'tl-item-drawer';
      item.id = `tl-item-${i}`;
      item.innerHTML = `
        <div class="tli-dot locked" id="tl-dot-${i}">${lvl.emoji}</div>
        <div class="tli-body">
          <strong>${lvl.name}</strong>
          <span class="tli-fact hidden" id="tl-fact-${i}">${lvl.tlFact}</span>
          <span class="tli-locked" id="tl-lock-${i}">🔒 Bloqueado</span>
        </div>`;
      track.appendChild(item);
    });
  }

  function unlock(levelIndex) {
    const dot  = $(`tl-dot-${levelIndex}`);
    const fact = $(`tl-fact-${levelIndex}`);
    const lock = $(`tl-lock-${levelIndex}`);
    if (!dot) return;
    dot.classList.remove('locked');
    dot.classList.add('unlocked');
    fact.classList.remove('hidden');
    lock.classList.add('hidden');
    // pulse
    dot.classList.add('pulse');
    setTimeout(() => dot.classList.remove('pulse'), 1200);
  }

  function toggle() {
    const drawer = $('timeline-drawer');
    open = !open;
    drawer.classList.toggle('open', open);
  }

  return { init, unlock, toggle };
})();

/* ═══════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════ */
function launchConfetti(count = 40) {
  const colors = ['#F5C842','#E8A010','#C24E28','#4AAFCC','#3A8F5C','#fff'];
  const emojis = ['⭐','✨','🏺','💎','🎉'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const isE = Math.random() < 0.3;
      const el  = document.createElement('div');
      if (isE) {
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.fontSize = '1.4rem';
      } else {
        const s = 8 + Math.random() * 10;
        el.style.cssText = `width:${s}px;height:${s}px;border-radius:${Math.random()>.5?'50%':'2px'};background:${colors[Math.floor(Math.random()*colors.length)]};`;
      }
      const startX = Math.random() * window.innerWidth;
      el.style.cssText += `position:fixed;left:${startX}px;top:-20px;pointer-events:none;z-index:9999;`;
      document.body.appendChild(el);
      let py=-20, px=startX, vx=(Math.random()-.5)*4, vy=3+Math.random()*5, a=0, rot=Math.random()*720-360, alpha=1;
      const tick=()=>{py+=vy;px+=vx;a+=rot/60;alpha-=.009;el.style.top=py+'px';el.style.left=px+'px';el.style.transform=`rotate(${a}deg)`;el.style.opacity=Math.max(0,alpha);(py<window.innerHeight+60&&alpha>0)?requestAnimationFrame(tick):el.remove();};
      requestAnimationFrame(tick);
    }, i * 25);
  }
}

/* ═══════════════════════════════════════════
   GAME STATE
═══════════════════════════════════════════ */
const Game = (() => {

  let levelIdx   = 0;
  let puzzleIdx  = 0;
  let waitingNext = false;   // after showing feedback

  /* ----- start / restart ----- */
  function start() {
    levelIdx  = 0;
    puzzleIdx = 0;
    waitingNext = false;
    showScreen('screen-game');
    Timeline.init();
    renderPuzzle();
  }

  function restart() {
    showScreen('screen-intro');
  }

  /* ----- HUD update ----- */
  function updateHUD() {
    const lvl = LEVELS[levelIdx];
    $('hud-emoji').textContent = lvl.emoji;
    $('hud-civ').textContent   = lvl.name;
    $('hud-q').textContent     = `Acertijo ${puzzleIdx + 1} / ${lvl.puzzles.length}`;

    // dots
    const dots = $('hud-dots');
    dots.innerHTML = '';
    lvl.puzzles.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'hud-dot' + (i < puzzleIdx ? ' done' : i === puzzleIdx ? ' active' : '');
      dots.appendChild(d);
    });

    // accent color on stage
    document.documentElement.style.setProperty('--accent', lvl.color);
    document.documentElement.style.setProperty('--accent-light', lvl.colorLight);
  }

  /* ----- render current puzzle ----- */
  function renderPuzzle() {
    updateHUD();
    hide('feedback-overlay');
    waitingNext = false;

    const puzzle = LEVELS[levelIdx].puzzles[puzzleIdx];
    const stage  = $('stage');
    stage.innerHTML = '';

    // fade in
    stage.style.opacity = '0';
    stage.style.transform = 'translateY(20px)';

    const card = document.createElement('div');
    card.className = 'puzzle-card';
    card.style.setProperty('--accent', LEVELS[levelIdx].color);
    card.style.setProperty('--accent-light', LEVELS[levelIdx].colorLight);

    card.innerHTML = `
      <p class="puzzle-instruction">${puzzle.instruction}</p>
      <p class="puzzle-question">${puzzle.question}</p>
      <div class="puzzle-body" id="puzzle-body"></div>
      ${puzzle.hint ? `<p class="puzzle-hint">${puzzle.hint}</p>` : ''}
    `;
    stage.appendChild(card);

    setTimeout(() => {
      stage.style.transition = 'opacity .4s, transform .4s';
      stage.style.opacity = '1';
      stage.style.transform = 'translateY(0)';
    }, 20);

    // dispatch to renderer
    const body = $('puzzle-body');
    switch (puzzle.type) {
      case 'choice': renderChoice(body, puzzle); break;
      case 'order':  renderOrder(body, puzzle);  break;
      case 'text':   renderText(body, puzzle);   break;
      case 'match':  renderMatch(body, puzzle);  break;
      case 'drag':   renderDrag(body, puzzle);   break;
    }
  }

  /* ----- feedback ----- */
  function showFeedback(correct, puzzle) {
    waitingNext = true;
    $('feedback-emoji').textContent = correct ? '🎉' : '🤔';
    $('feedback-msg').innerHTML = correct
      ? `<strong>¡Correcto!</strong><br/>${puzzle.funFact}`
      : `<strong>¡Casi!</strong> La respuesta no es esa.<br/>Intentá de nuevo.`;

    const overlay = $('feedback-overlay');
    const box     = $('feedback-box');
    overlay.classList.remove('hidden');
    box.className = 'feedback-box ' + (correct ? 'correct' : 'wrong');

    if (!correct) {
      $('feedback-btn').textContent = '🔄 Intentar de nuevo';
      $('feedback-btn').onclick = () => {
        hide('feedback-overlay');
        waitingNext = false;
        renderPuzzle();
      };
    } else {
      $('feedback-btn').textContent = puzzleIdx + 1 < LEVELS[levelIdx].puzzles.length
        ? 'Siguiente acertijo →'
        : levelIdx + 1 < LEVELS.length
          ? `¡Al siguiente nivel! ${LEVELS[levelIdx+1].emoji} →`
          : '🏆 ¡Ver mi tesoro!';
      $('feedback-btn').onclick = () => nextPuzzle();
      launchConfetti(correct ? 30 : 0);
    }
  }

  /* ----- advance ----- */
  function nextPuzzle() {
    const lvl = LEVELS[levelIdx];

    puzzleIdx++;
    if (puzzleIdx >= lvl.puzzles.length) {
      // level done → unlock timeline
      Timeline.unlock(levelIdx);
      levelIdx++;
      puzzleIdx = 0;
      if (levelIdx >= LEVELS.length) {
        // WIN
        setTimeout(() => { showScreen('screen-win'); launchConfetti(60); }, 300);
        return;
      }
    }
    renderPuzzle();
  }

  /* ═══════════════════════════════════
     PUZZLE RENDERERS
  ═══════════════════════════════════ */

  /* --- CHOICE --- */
  function renderChoice(body, puzzle) {
    const opts = shuffle(puzzle.options);
    const grid = document.createElement('div');
    grid.className = 'choice-grid';
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = opt.label;
      btn.onclick = () => {
        if (waitingNext) return;
        document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
        btn.classList.add(opt.correct ? 'correct' : 'wrong');
        showFeedback(opt.correct, puzzle);
      };
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  }

  /* --- TEXT --- */
  function renderText(body, puzzle) {
    const wrap = document.createElement('div');
    wrap.className = 'text-wrap';
    wrap.innerHTML = `
      <input type="text" id="text-input" class="text-input" placeholder="Escribí tu respuesta…" autocomplete="off" />
      <button class="btn-primary" id="text-submit">✅ Confirmar</button>
    `;
    body.appendChild(wrap);

    const check = () => {
      if (waitingNext) return;
      const val  = normalizeText($('text-input').value);
      const ok   = puzzle.answer.map(normalizeText).includes(val);
      $('text-input').classList.add(ok ? 'correct' : 'wrong');
      showFeedback(ok, puzzle);
    };

    $('text-submit').onclick = check;
    $('text-input').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    setTimeout(() => $('text-input').focus(), 200);
  }

  /* --- ORDER (drag & drop) --- */
  function renderOrder(body, puzzle) {
    const items = shuffle(puzzle.items);
    const wrap  = document.createElement('div');
    wrap.className = 'order-wrap';

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'order-item';
      el.draggable = true;
      el.dataset.id = item.id;
      el.innerHTML = `<span class="drag-handle">⠿</span> ${item.label}`;
      wrap.appendChild(el);
    });

    body.appendChild(wrap);

    // Drag & drop logic
    let dragging = null;
    wrap.addEventListener('dragstart', e => {
      dragging = e.target.closest('.order-item');
      if (dragging) { dragging.classList.add('dragging'); }
    });
    wrap.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('dragging');
      dragging = null;
    });
    wrap.addEventListener('dragover', e => {
      e.preventDefault();
      const over = e.target.closest('.order-item');
      if (over && over !== dragging) {
        const items2 = [...wrap.querySelectorAll('.order-item:not(.dragging)')];
        const idx2   = items2.indexOf(over);
        const next   = items2[idx2] || null;
        wrap.insertBefore(dragging, next);
      }
    });

    // Touch support
    let touchItem = null, clone = null;
    wrap.addEventListener('touchstart', e => {
      touchItem = e.target.closest('.order-item');
      if (!touchItem) return;
      const rect = touchItem.getBoundingClientRect();
      clone = touchItem.cloneNode(true);
      clone.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;opacity:.8;pointer-events:none;z-index:1000;`;
      document.body.appendChild(clone);
      touchItem.style.opacity = '.3';
    }, { passive: true });

    wrap.addEventListener('touchmove', e => {
      if (!clone) return;
      const t = e.touches[0];
      clone.style.top  = (t.clientY - 30) + 'px';
      clone.style.left = (t.clientX - 60) + 'px';
      const el2 = document.elementFromPoint(t.clientX, t.clientY)?.closest('.order-item');
      if (el2 && el2 !== touchItem) {
        const items2 = [...wrap.querySelectorAll('.order-item')];
        const i2 = items2.indexOf(el2);
        wrap.insertBefore(touchItem, el2);
      }
    }, { passive: true });

    wrap.addEventListener('touchend', () => {
      if (clone) { clone.remove(); clone = null; }
      if (touchItem) { touchItem.style.opacity = ''; touchItem = null; }
    });

    // Confirm button
    const btn = document.createElement('button');
    btn.className = 'btn-primary order-confirm';
    btn.textContent = '✅ Confirmar orden';
    btn.onclick = () => {
      if (waitingNext) return;
      const current = [...wrap.querySelectorAll('.order-item')].map(el => el.dataset.id);
      const ok = JSON.stringify(current) === JSON.stringify(puzzle.correctOrder);
      if (!ok) {
        wrap.querySelectorAll('.order-item').forEach(el => {
          el.classList.add('shake');
          setTimeout(() => el.classList.remove('shake'), 600);
        });
      }
      showFeedback(ok, puzzle);
    };
    body.appendChild(btn);
  }

  /* --- MATCH --- */
  function renderMatch(body, puzzle) {
    const wrap = document.createElement('div');
    wrap.className = 'match-wrap';

    const leftCol  = document.createElement('div'); leftCol.className  = 'match-col left-col';
    const rightCol = document.createElement('div'); rightCol.className = 'match-col right-col';

    const rightItems = shuffle(puzzle.pairs.map(p => p.right));

    let selectedLeft = null;
    let matched = new Set();
    let errors = 0;

    puzzle.pairs.forEach((pair, i) => {
      const lb = document.createElement('button');
      lb.className = 'match-btn left-btn';
      lb.textContent = pair.left;
      lb.dataset.idx = i;
      lb.onclick = () => {
        if (lb.classList.contains('matched')) return;
        document.querySelectorAll('.left-btn').forEach(b => b.classList.remove('selected'));
        lb.classList.add('selected');
        selectedLeft = i;
      };
      leftCol.appendChild(lb);
    });

    rightItems.forEach((text, i) => {
      const rb = document.createElement('button');
      rb.className = 'match-btn right-btn';
      rb.textContent = text;
      rb.dataset.right = text;
      rb.onclick = () => {
        if (selectedLeft === null || rb.classList.contains('matched')) return;
        const correctRight = puzzle.pairs[selectedLeft].right;
        if (rb.dataset.right === correctRight) {
          rb.classList.add('matched');
          document.querySelector(`.left-btn[data-idx="${selectedLeft}"]`).classList.add('matched');
          matched.add(selectedLeft);
          selectedLeft = null;
          document.querySelectorAll('.left-btn').forEach(b => b.classList.remove('selected'));
          if (matched.size === puzzle.pairs.length) {
            setTimeout(() => showFeedback(true, puzzle), 300);
          }
        } else {
          rb.classList.add('wrong-flash');
          document.querySelector(`.left-btn[data-idx="${selectedLeft}"]`).classList.add('wrong-flash');
          errors++;
          setTimeout(() => {
            document.querySelectorAll('.wrong-flash').forEach(b => b.classList.remove('wrong-flash'));
          }, 600);
          if (errors >= puzzle.pairs.length * 2) {
            setTimeout(() => showFeedback(false, puzzle), 300);
          }
        }
      };
      rightCol.appendChild(rb);
    });

    wrap.appendChild(leftCol);
    const arrow = document.createElement('div');
    arrow.className = 'match-arrow';
    arrow.innerHTML = '↔️';
    wrap.appendChild(arrow);
    wrap.appendChild(rightCol);
    body.appendChild(wrap);
  }

  /* --- DRAG to zone --- */
  function renderDrag(body, puzzle) {
    const allItems = shuffle(puzzle.allItems);
    const wrap = document.createElement('div');
    wrap.className = 'drag-wrap';

    // Source pool
    const pool = document.createElement('div');
    pool.className = 'drag-pool';
    pool.innerHTML = '<p class="pool-label">Arrastrá los elementos 👇</p>';

    allItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'drag-chip';
      el.draggable = true;
      el.dataset.id = item.id;
      el.dataset.correct = item.correct;
      el.textContent = item.label;
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('id', item.id);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
      pool.appendChild(el);
    });

    // Drop zone
    const zone = document.createElement('div');
    zone.className = 'drag-zone';
    zone.innerHTML = '<span class="zone-label">🏺 Cofre del tesoro</span>';
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const id = e.dataTransfer.getData('id');
      const chip = pool.querySelector(`[data-id="${id}"]`);
      if (chip) {
        zone.appendChild(chip);
        chip.draggable = false;
      }
    });

    // Touch support for drag chips
    allItems.forEach(item => {
      const chip = pool.querySelector(`[data-id="${item.id}"]`);
      let tClone = null;
      chip.addEventListener('touchstart', e => {
        const rect = chip.getBoundingClientRect();
        tClone = chip.cloneNode(true);
        tClone.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;opacity:.85;pointer-events:none;z-index:9999;`;
        document.body.appendChild(tClone);
        chip.style.opacity = '.3';
      }, { passive: true });

      chip.addEventListener('touchmove', e => {
        if (!tClone) return;
        const t = e.touches[0];
        tClone.style.top  = (t.clientY - 20) + 'px';
        tClone.style.left = (t.clientX - 40) + 'px';
        const el2 = document.elementFromPoint(t.clientX, t.clientY);
        zone.classList.toggle('drag-over', zone.contains(el2) || el2 === zone);
      }, { passive: true });

      chip.addEventListener('touchend', e => {
        if (tClone) { tClone.remove(); tClone = null; }
        chip.style.opacity = '';
        const t = e.changedTouches[0];
        const el2 = document.elementFromPoint(t.clientX, t.clientY);
        zone.classList.remove('drag-over');
        if (zone.contains(el2) || el2 === zone) {
          zone.appendChild(chip);
          chip.draggable = false;
        }
      });
    });

    // Confirm
    const btn = document.createElement('button');
    btn.className = 'btn-primary drag-confirm';
    btn.textContent = '✅ Confirmar selección';
    btn.onclick = () => {
      if (waitingNext) return;
      const inZone = [...zone.querySelectorAll('.drag-chip')].map(c => c.dataset.id);
      const correctIds = puzzle.allItems.filter(i => i.correct).map(i => i.id);
      const wrongIds   = puzzle.allItems.filter(i => !i.correct).map(i => i.id);

      const allCorrectIn = correctIds.every(id => inZone.includes(id));
      const noWrongIn    = wrongIds.every(id => !inZone.includes(id));
      const ok = allCorrectIn && noWrongIn;
      showFeedback(ok, puzzle);
    };

    wrap.appendChild(pool);
    wrap.appendChild(zone);
    body.appendChild(wrap);
    body.appendChild(btn);
  }

  return { start, nextPuzzle, restart };
})();

/* ═══════════════════════════════════════════
   BOOT
═══════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  spawnParticles('intro-particles');
});
