/**
 * TESOROS DEL PASADO — Sala de Escape · script.js
 * Motor de juego + renderers visuales con íconos reales
 */

'use strict';

/* ─── utils ─────────────────────────────────────────── */
const $  = id => document.getElementById(id);
const show = id => $(id).classList.remove('hidden');
const hide = id => $(id).classList.add('hidden');
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const t = $(id);
  t.style.display = 'block';
  t.classList.add('active');
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function normalizeText(s) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

/* ─── particles ──────────────────────────────────────── */
function spawnParticles(containerId) {
  const c = $(containerId); if (!c) return;
  const syms = ['⭐','✨','💛','🌟','🏺','💎'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = syms[i % syms.length];
    el.style.cssText = `left:${Math.random()*100}%;animation-duration:${12+Math.random()*14}s;animation-delay:-${Math.random()*20}s;font-size:${0.9+Math.random()*1.1}rem;`;
    c.appendChild(el);
  }
}

/* ─── confetti ───────────────────────────────────────── */
function launchConfetti(count = 40) {
  const colors = ['#F5C842','#E8A010','#C24E28','#4AAFCC','#3A8F5C','#fff'];
  const emojis = ['⭐','✨','🏺','💎','🎉'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const isE = Math.random() < 0.3;
      const el  = document.createElement('div');
      if (isE) { el.textContent = emojis[Math.floor(Math.random()*emojis.length)]; el.style.fontSize='1.4rem'; }
      else { const s=8+Math.random()*10; el.style.cssText=`width:${s}px;height:${s}px;border-radius:${Math.random()>.5?'50%':'2px'};background:${colors[Math.floor(Math.random()*colors.length)]};`; }
      const startX = Math.random()*window.innerWidth;
      el.style.cssText += `position:fixed;left:${startX}px;top:-20px;pointer-events:none;z-index:9999;`;
      document.body.appendChild(el);
      let py=-20,px=startX,vx=(Math.random()-.5)*4,vy=3+Math.random()*5,a=0,rot=Math.random()*720-360,alpha=1;
      const tick=()=>{ py+=vy;px+=vx;a+=rot/60;alpha-=.009;el.style.top=py+'px';el.style.left=px+'px';el.style.transform=`rotate(${a}deg)`;el.style.opacity=Math.max(0,alpha);(py<window.innerHeight+60&&alpha>0)?requestAnimationFrame(tick):el.remove(); };
      requestAnimationFrame(tick);
    }, i*25);
  }
}

/* ─── Timeline ───────────────────────────────────────── */
const Timeline = (() => {
  let open = false;
  function init() {
    const track = $('tl-track'); track.innerHTML = '';
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
  function unlock(idx) {
    const dot=$(`tl-dot-${idx}`), fact=$(`tl-fact-${idx}`), lock=$(`tl-lock-${idx}`);
    if (!dot) return;
    dot.classList.replace('locked','unlocked');
    fact.classList.remove('hidden');
    lock.classList.add('hidden');
    dot.classList.add('pulse');
    setTimeout(()=>dot.classList.remove('pulse'),1200);
  }
  function toggle() {
    open = !open;
    $('timeline-drawer').classList.toggle('open', open);
  }
  return { init, unlock, toggle };
})();

/* ─── Game ───────────────────────────────────────────── */
const Game = (() => {
  let levelIdx=0, puzzleIdx=0, waitingNext=false;

  function start() {
    levelIdx=0; puzzleIdx=0; waitingNext=false;
    showScreen('screen-game');
    Timeline.init();
    renderPuzzle();
  }
  function restart() { showScreen('screen-intro'); }

  /* HUD */
  function updateHUD() {
    const lvl = LEVELS[levelIdx];
    $('hud-emoji').textContent = lvl.emoji;
    $('hud-civ').textContent   = lvl.name;
    $('hud-q').textContent     = `Acertijo ${puzzleIdx+1} / ${lvl.puzzles.length}`;
    const dots=$('hud-dots'); dots.innerHTML='';
    lvl.puzzles.forEach((_,i)=>{
      const d=document.createElement('span');
      d.className='hud-dot'+(i<puzzleIdx?' done':i===puzzleIdx?' active':'');
      dots.appendChild(d);
    });
    document.documentElement.style.setProperty('--accent', lvl.color);
    document.documentElement.style.setProperty('--accent-light', lvl.colorLight);
    // tint HUD
    const hud = document.querySelector('.hud');
    hud.style.background = lvl.bgGradient;
  }

  /* Render puzzle */
  function renderPuzzle() {
    updateHUD();
    hide('feedback-overlay');
    waitingNext = false;
    const puzzle = LEVELS[levelIdx].puzzles[puzzleIdx];
    const stage  = $('stage');
    stage.innerHTML = '';
    stage.style.opacity='0'; stage.style.transform='translateY(20px)';

    const card = document.createElement('div');
    card.className = 'puzzle-card';
    card.style.setProperty('--accent', LEVELS[levelIdx].color);
    card.style.setProperty('--accent-light', LEVELS[levelIdx].colorLight);
    card.innerHTML = `
      <p class="puzzle-instruction">${puzzle.instruction}</p>
      <p class="puzzle-question">${puzzle.question}</p>
      <div class="puzzle-body" id="puzzle-body"></div>`;
    stage.appendChild(card);

    setTimeout(()=>{ stage.style.transition='opacity .4s,transform .4s'; stage.style.opacity='1'; stage.style.transform='translateY(0)'; },20);

    const body = $('puzzle-body');
    switch(puzzle.type) {
      case 'imgChoice': renderImgChoice(body, puzzle); break;
      case 'imgOrder':  renderImgOrder(body, puzzle);  break;
      case 'imgDrag':   renderImgDrag(body, puzzle);   break;
      case 'imgMatch':  renderImgMatch(body, puzzle);  break;
      case 'text':      renderText(body, puzzle);      break;
    }
  }

  /* Feedback */
  function showFeedback(correct, puzzle) {
    waitingNext = true;
    $('feedback-emoji').textContent = correct ? '🎉' : '🤔';
    $('feedback-msg').innerHTML = correct
      ? `<strong>¡Correcto!</strong><br/>${puzzle.funFact}`
      : `<strong>¡Casi!</strong> Esa no era la respuesta. ¡Intentá de nuevo!`;
    const overlay=$('feedback-overlay'), box=$('feedback-box');
    overlay.classList.remove('hidden');
    box.className='feedback-box '+(correct?'correct':'wrong');
    if (!correct) {
      $('feedback-btn').textContent='🔄 Intentar de nuevo';
      $('feedback-btn').onclick=()=>{ hide('feedback-overlay'); waitingNext=false; renderPuzzle(); };
    } else {
      $('feedback-btn').textContent = puzzleIdx+1 < LEVELS[levelIdx].puzzles.length
        ? 'Siguiente acertijo →'
        : levelIdx+1 < LEVELS.length
          ? `¡Al siguiente nivel! ${LEVELS[levelIdx+1]?.emoji} →`
          : '🏆 ¡Ver mi tesoro!';
      $('feedback-btn').onclick=()=>nextPuzzle();
      launchConfetti(32);
    }
  }

  /* ─── showLevelTransition: pantalla de cambio de nivel ─ */
  function showLevelTransition(completedIdx, isLast) {
    const lvl = LEVELS[completedIdx];

    // badge y textos
    $('level-badge').textContent   = lvl.emoji;
    $('level-title').textContent   = `¡${lvl.name} completado!`;
    $('level-subtitle').textContent = isLast
      ? '¡Completaste todas las civilizaciones!'
      : `Desbloqueaste un tesoro de la Línea del Tiempo`;
    $('level-fact').textContent    = lvl.tlFact;

    // botón siguiente
    if (isLast) {
      $('level-next-label').textContent = '¡Ver mis tesoros! 🏆';
      $('level-next-emoji').textContent = '🎉';
    } else {
      const next = LEVELS[completedIdx + 1];
      $('level-next-label').textContent = `¡Siguiente: ${next.name}!`;
      $('level-next-emoji').textContent = next.emoji;
    }

    // construir línea del tiempo progresiva
    const tl = $('level-timeline');
    tl.innerHTML = '';
    LEVELS.forEach((l, i) => {
      const unlocked = i <= completedIdx;
      const isNew    = i === completedIdx;

      const item = document.createElement('div');
      item.className = 'ltl-item' + (unlocked ? '' : ' locked');
      item.dataset.delay = i;

      const dot = document.createElement('div');
      dot.className = 'ltl-dot ' + (unlocked ? 'unlocked' : 'locked-dot');
      dot.textContent = l.emoji;

      const body = document.createElement('div');
      body.className = 'ltl-body';
      body.innerHTML = `
        <strong>${l.name}${isNew ? '<span class="ltl-new-badge">¡NUEVO!</span>' : ''}</strong>
        <span class="ltl-sublabel">${l.tlLabel}</span>
        ${unlocked ? `<p class="ltl-newfact">${l.tlFact}</p>` : ''}
      `;

      // conector entre items
      if (i < LEVELS.length - 1) {
        const connector = document.createElement('div');
        connector.style.cssText = 'width:3px;height:20px;background:rgba(245,200,66,.25);margin-left:27px;';
        item.after_connector = connector;
      }

      item.appendChild(dot);
      item.appendChild(body);
      tl.appendChild(item);
      if (item.after_connector) tl.appendChild(item.after_connector);
    });

    // mostrar pantalla y animar items con stagger
    hide('feedback-overlay');
    showScreen('screen-level');
    launchConfetti(28);

    // animar entrada de items desbloqueados
    requestAnimationFrame(() => {
      document.querySelectorAll('.ltl-item:not(.locked)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 120 + i * 180);
      });
      // los bloqueados aparecen después, sin animación lateral
      document.querySelectorAll('.ltl-item.locked').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 120 + LEVELS.length * 180);
      });
    });
  }

  function goNextLevel() {
    if (levelIdx >= LEVELS.length) {
      showScreen('screen-win');
      launchConfetti(70);
    } else {
      showScreen('screen-game');
      renderPuzzle();
    }
  }

  function nextPuzzle() {
    const lvl = LEVELS[levelIdx];
    puzzleIdx++;
    if (puzzleIdx >= lvl.puzzles.length) {
      // nivel completado
      Timeline.unlock(levelIdx);
      const completedIdx = levelIdx;
      levelIdx++;
      puzzleIdx = 0;
      const isLast = levelIdx >= LEVELS.length;
      // mostrar pantalla de transición (para victoria también)
      setTimeout(() => showLevelTransition(completedIdx, isLast), 350);
      return;
    }
    renderPuzzle();
  }

  /* ═══════════════════════════════════════
     RENDERER: imgChoice — elegir imagen correcta
  ═══════════════════════════════════════ */
  function renderImgChoice(body, puzzle) {
    const opts = shuffle(puzzle.options);
    const grid = document.createElement('div');
    grid.className = 'img-choice-grid';
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'img-choice-btn';
      btn.innerHTML = `<img src="${opt.img}" alt="${opt.label}" draggable="false"/><span>${opt.label}</span>`;
      btn.onclick = () => {
        if (waitingNext) return;
        document.querySelectorAll('.img-choice-btn').forEach(b=>b.disabled=true);
        btn.classList.add(opt.correct ? 'correct' : 'wrong');
        if (!opt.correct) {
          // highlight the correct one
          opts.forEach((o,i) => { if (o.correct) grid.querySelectorAll('.img-choice-btn')[i]?.classList.add('correct-hint'); });
        }
        showFeedback(opt.correct, puzzle);
      };
      grid.appendChild(btn);
    });
    body.appendChild(grid);
  }

  /* ═══════════════════════════════════════
     RENDERER: imgOrder — ordenar imágenes
  ═══════════════════════════════════════ */
  function renderImgOrder(body, puzzle) {
    const items = shuffle(puzzle.items);
    const wrap  = document.createElement('div');
    wrap.className = 'img-order-wrap';

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'img-order-item';
      el.draggable = true;
      el.dataset.id = item.id;
      el.innerHTML = `<img src="${item.img}" alt="${item.label}" draggable="false"/><span>${item.label}</span>`;
      wrap.appendChild(el);
    });
    body.appendChild(wrap);

    /* drag & drop desktop */
    let dragging = null;
    wrap.addEventListener('dragstart', e => {
      dragging = e.target.closest('.img-order-item');
      if (dragging) { setTimeout(()=>dragging.classList.add('dragging'),0); }
    });
    wrap.addEventListener('dragend', () => { if(dragging){dragging.classList.remove('dragging');} dragging=null; });
    wrap.addEventListener('dragover', e => {
      e.preventDefault();
      const over = e.target.closest('.img-order-item');
      if (over && over !== dragging) {
        const siblings = [...wrap.querySelectorAll('.img-order-item:not(.dragging)')];
        const rect = over.getBoundingClientRect();
        const mid  = rect.left + rect.width/2;
        over.parentNode.insertBefore(dragging, e.clientX < mid ? over : over.nextSibling);
      }
    });

    /* touch support */
    addTouchOrder(wrap, '.img-order-item');

    const btn = document.createElement('button');
    btn.className = 'btn-primary order-confirm';
    btn.textContent = '✅ Confirmar orden';
    btn.onclick = () => {
      if (waitingNext) return;
      const current = [...wrap.querySelectorAll('.img-order-item')].map(el=>el.dataset.id);
      const ok = JSON.stringify(current) === JSON.stringify(puzzle.correctOrder);
      if (!ok) {
        wrap.querySelectorAll('.img-order-item').forEach(el=>{
          el.classList.add('shake'); setTimeout(()=>el.classList.remove('shake'),600);
        });
      }
      showFeedback(ok, puzzle);
    };
    body.appendChild(btn);
  }

  /* ═══════════════════════════════════════
     RENDERER: imgDrag — arrastrar al cofre
  ═══════════════════════════════════════ */
  function renderImgDrag(body, puzzle) {
    const allItems = shuffle(puzzle.allItems);

    const pool = document.createElement('div');
    pool.className = 'img-drag-pool';

    allItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'img-drag-chip';
      el.draggable = true;
      el.dataset.id = item.id;
      el.dataset.correct = item.correct;
      el.innerHTML = `<img src="${item.img}" alt="${item.label}" draggable="false"/><span>${item.label}</span>`;
      el.addEventListener('dragstart', e => { e.dataTransfer.setData('id',item.id); el.classList.add('dragging'); });
      el.addEventListener('dragend',   () => el.classList.remove('dragging'));
      pool.appendChild(el);
    });

    const zone = document.createElement('div');
    zone.className = 'img-drag-zone';
    zone.innerHTML = '<span class="zone-label">🏺 Cofre del tesoro<br/><small>Soltá aquí los correctos</small></span>';
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const id   = e.dataTransfer.getData('id');
      const chip = pool.querySelector(`[data-id="${id}"]`) || zone.querySelector(`[data-id="${id}"]`);
      if (chip) { zone.appendChild(chip); chip.draggable=false; chip.classList.remove('dragging'); }
    });

    /* touch */
    addTouchDrag(allItems, pool, zone);

    const wrap = document.createElement('div');
    wrap.className = 'img-drag-wrap';
    wrap.appendChild(pool);
    wrap.appendChild(zone);
    body.appendChild(wrap);

    const btn = document.createElement('button');
    btn.className = 'btn-primary drag-confirm';
    btn.textContent = '✅ Confirmar selección';
    btn.onclick = () => {
      if (waitingNext) return;
      const inZone  = [...zone.querySelectorAll('.img-drag-chip')].map(c=>c.dataset.id);
      const correct = puzzle.allItems.filter(i=>i.correct).map(i=>i.id);
      const wrong   = puzzle.allItems.filter(i=>!i.correct).map(i=>i.id);
      const ok = correct.every(id=>inZone.includes(id)) && wrong.every(id=>!inZone.includes(id));
      showFeedback(ok, puzzle);
    };
    body.appendChild(btn);
  }

  /* ═══════════════════════════════════════
     RENDERER: imgMatch — unir imagen ↔ texto
  ═══════════════════════════════════════ */
  function renderImgMatch(body, puzzle) {
    const wrap = document.createElement('div');
    wrap.className = 'img-match-wrap';

    const leftCol  = document.createElement('div'); leftCol.className='match-col left-col';
    const rightCol = document.createElement('div'); rightCol.className='match-col right-col';

    const rightItems = shuffle(puzzle.pairs.map(p=>p.desc));
    let selectedLeft = null, matched = new Set(), errors = 0;

    puzzle.pairs.forEach((pair,i) => {
      const lb = document.createElement('button');
      lb.className = 'img-match-btn left-img-btn';
      lb.dataset.idx = i;
      lb.innerHTML = `<img src="${pair.img}" alt="${pair.label}" draggable="false"/><span>${pair.label}</span>`;
      lb.onclick = () => {
        if (lb.classList.contains('matched')) return;
        document.querySelectorAll('.left-img-btn').forEach(b=>b.classList.remove('selected'));
        lb.classList.add('selected');
        selectedLeft = i;
      };
      leftCol.appendChild(lb);
    });

    rightItems.forEach(desc => {
      const rb = document.createElement('button');
      rb.className = 'img-match-btn right-text-btn';
      rb.dataset.desc = desc;
      rb.textContent = desc;
      rb.onclick = () => {
        if (selectedLeft===null || rb.classList.contains('matched')) return;
        const correctDesc = puzzle.pairs[selectedLeft].desc;
        if (rb.dataset.desc === correctDesc) {
          rb.classList.add('matched');
          leftCol.querySelector(`[data-idx="${selectedLeft}"]`).classList.add('matched');
          matched.add(selectedLeft);
          selectedLeft=null;
          document.querySelectorAll('.left-img-btn').forEach(b=>b.classList.remove('selected'));
          if (matched.size===puzzle.pairs.length) setTimeout(()=>showFeedback(true,puzzle),300);
        } else {
          rb.classList.add('wrong-flash');
          leftCol.querySelector(`[data-idx="${selectedLeft}"]`)?.classList.add('wrong-flash');
          errors++;
          setTimeout(()=>document.querySelectorAll('.wrong-flash').forEach(b=>b.classList.remove('wrong-flash')),600);
          if (errors >= puzzle.pairs.length*2) setTimeout(()=>showFeedback(false,puzzle),300);
        }
      };
      rightCol.appendChild(rb);
    });

    const arrow = document.createElement('div');
    arrow.className='match-arrow'; arrow.textContent='↔️';
    wrap.appendChild(leftCol);
    wrap.appendChild(arrow);
    wrap.appendChild(rightCol);
    body.appendChild(wrap);
  }

  /* ═══════════════════════════════════════
     RENDERER: text fallback
  ═══════════════════════════════════════ */
  function renderText(body, puzzle) {
    const wrap = document.createElement('div');
    wrap.className='text-wrap';
    wrap.innerHTML=`<input type="text" id="text-input" class="text-input" placeholder="Escribí tu respuesta…" autocomplete="off"/><button class="btn-primary" id="text-submit">✅ Confirmar</button>`;
    body.appendChild(wrap);
    const check=()=>{
      if(waitingNext)return;
      const val=normalizeText($('text-input').value);
      const ok=puzzle.answer.map(normalizeText).includes(val);
      $('text-input').classList.add(ok?'correct':'wrong');
      showFeedback(ok,puzzle);
    };
    $('text-submit').onclick=check;
    $('text-input').addEventListener('keydown',e=>{ if(e.key==='Enter')check(); });
    setTimeout(()=>$('text-input').focus(),200);
  }

  return { start, nextPuzzle, goNextLevel, restart };
})();

/* ─── Touch helpers ──────────────────────────────────── */
function addTouchOrder(wrap, selector) {
  let touchEl=null, clone=null;
  wrap.addEventListener('touchstart', e=>{
    touchEl=e.target.closest(selector);
    if(!touchEl)return;
    const r=touchEl.getBoundingClientRect();
    clone=touchEl.cloneNode(true);
    clone.style.cssText=`position:fixed;top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px;opacity:.85;pointer-events:none;z-index:9999;border-radius:16px;`;
    document.body.appendChild(clone);
    touchEl.style.opacity='.3';
  },{passive:true});
  wrap.addEventListener('touchmove', e=>{
    if(!clone)return;
    const t=e.touches[0];
    clone.style.top=(t.clientY-clone.offsetHeight/2)+'px';
    clone.style.left=(t.clientX-clone.offsetWidth/2)+'px';
    const over=document.elementFromPoint(t.clientX,t.clientY)?.closest(selector);
    if(over&&over!==touchEl){
      const r=over.getBoundingClientRect();
      wrap.insertBefore(touchEl, t.clientX < r.left+r.width/2 ? over : over.nextSibling);
    }
  },{passive:true});
  wrap.addEventListener('touchend',()=>{
    if(clone){clone.remove();clone=null;}
    if(touchEl){touchEl.style.opacity='';touchEl=null;}
  });
}

function addTouchDrag(allItems, pool, zone) {
  allItems.forEach(item=>{
    const chip=pool.querySelector(`[data-id="${item.id}"]`);
    if(!chip)return;
    let tClone=null;
    chip.addEventListener('touchstart',e=>{
      const r=chip.getBoundingClientRect();
      tClone=chip.cloneNode(true);
      tClone.style.cssText=`position:fixed;top:${r.top}px;left:${r.left}px;width:${r.width}px;opacity:.9;pointer-events:none;z-index:9999;border-radius:16px;`;
      document.body.appendChild(tClone);
      chip.style.opacity='.3';
    },{passive:true});
    chip.addEventListener('touchmove',e=>{
      if(!tClone)return;
      const t=e.touches[0];
      tClone.style.top=(t.clientY-tClone.offsetHeight/2)+'px';
      tClone.style.left=(t.clientX-tClone.offsetWidth/2)+'px';
      const el2=document.elementFromPoint(t.clientX,t.clientY);
      zone.classList.toggle('drag-over',zone.contains(el2)||el2===zone);
    },{passive:true});
    chip.addEventListener('touchend',e=>{
      if(tClone){tClone.remove();tClone=null;}
      chip.style.opacity='';
      const t=e.changedTouches[0];
      const el2=document.elementFromPoint(t.clientX,t.clientY);
      zone.classList.remove('drag-over');
      if(zone.contains(el2)||el2===zone){
        zone.appendChild(chip);
        chip.draggable=false;
      }
    });
  });
}

/* ─── boot ───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded',()=>{
  spawnParticles('intro-particles');

  // inject wiggle keyframe
  const st=document.createElement('style');
  st.textContent=`@keyframes wiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}`;
  document.head.appendChild(st);
});
