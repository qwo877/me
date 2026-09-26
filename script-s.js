(function () {
  'use strict';

  const RESPECT_REDUCED_MOTION = false;

  const skills = [
    { id: 'AI', label: 'AI', progress: 90, desc: '人工智慧，涉及多種子領域' },
    { id: 'ML', label: '機器學習', progress: 80, desc: '從數據中訓練模型進行預測或分類' },
    { id: 'DL', label: '深度學習', progress: 70, desc: '使用神經網路進行多層次數據處理' },
    { id: 'RL', label: '強化學習', progress: 50, desc: '代理學習透過獎勵與懲罰進行行為決策' },
    { id: 'CNN', label: 'CNN神經捲積模型', progress: 90, desc: 'ai模型之一 常用於生成圖片' },
    { id: 'MobileNet', label: 'MobileNet', progress: 30, desc: '輕量化的CNN與Transformer結合模型，常用於移動設備' },
    { id: 'CLIP', label: 'CLIP', progress: 20, desc: '多模態預訓練模型，能將圖像與文字進行對應' },
    { id: 'FE', label: '前端開發', progress: 70, desc: '使用者所看到、所互動的部分' },
    { id: 'Web Dev', label: '網頁', progress: 70, desc: '在一個網站頁面中所看到的部分' },
    { id: 'SW', label: '軟體', progress: 30, desc: 'app....這能怎麼解釋?' },
    { id: 'BE', label: '後端開發', progress: 70, desc: '一個正常網站的核心 多數處理的部分' },
    { id: 'PF', label: 'flask', progress: 70, desc: '輕量化的後端框架' },
    { id: 'MS', label: 'mysql', progress: 70, desc: '資料庫系統' },
    { id: 'PG', label: '遊戲開發', progress: 70, desc: '使用C#與pygame開發小糞game' },
    { id: '專業基礎學科', label: '專業基礎學科', progress: 20, desc: '基本電學、電子學、電工機械' },
    { id: 'Algo', label: '演算法', progress: 20, desc: '基礎的演算法' },
    { id: 'MLP', label: '多層感知機', progress: 70, desc: '在感知機的基礎上做感知機堆疊(隱藏層)' },
    { id: 'Perceptron', label: '感知機', progress: 90, desc: '一切ai的始祖,神經網路的雛形' },
    { id: 'DS', label: '資料結構', progress: 90, desc: '演算法的基礎，資料如何儲存與操作會直接影響效率與表現' },
    { id: 'PSM', label: '演算方法', progress: 70, desc: '各種解題策略與思維模式，如動態規劃、貪婪法、回溯法等，是寫出有效演算法的核心技巧' },
    { id: "I don't fucking know", label: '其他', progress: 100, desc: '各種無法分類' },
    { id: 'FileIO', label: '檔案操作', progress: 85, desc: '讀寫文字、CSV、JSON 等檔案，是資料處理與自動化不可或缺的技能' },
    { id: 'ImageRec', label: '影像識別', progress: 60, desc: '讓電腦看得懂圖片，基於 CNN 等技術，廣泛應用於 AI 與電腦視覺領域' },
    { id: 'SysOps', label: '系統操作', progress: 50, desc: '透過程式控制系統資源，如檔案系統、執行程序、環境變數與權限設定' },
    { id: 'OOP', label: '物件導向', progress: 75, desc: '以類別與物件為核心的程式設計方式，強調封裝、繼承與多型' },
    { id: 'HPC', label: '高性能計算', progress: 50, desc: '利用多核心處理器或分散式系統進行高效能運算' },
    { id: 'Tsfm', label: 'transformer模型', progress: 60, desc: '基於注意力機制的模型架構，是現代LLM模型的核心技術' }
  ];

  const edges = [
    { source: 'AI', target: 'ML' },
    { source: 'ML', target: 'DL' },
    { source: 'DL', target: 'RL' },
    { source: 'DS', target: 'Algo' },
    { source: 'Algo', target: 'PSM' },
    { source: 'FE', target: 'Web Dev' },
    { source: 'FE', target: 'SW' },
    { source: 'FE', target: 'PG' },
    { source: 'BE', target: 'PF' },
    { source: 'BE', target: 'MS' },
    { source: 'AI', target: 'Perceptron' },
    { source: 'Perceptron', target: 'MLP' },
    { source: 'MLP', target: 'CNN' },
    { source: 'CNN', target: 'Tsfm' },
    { source: 'Tsfm', target: 'MobileNet' },
    { source: 'Tsfm', target: 'CLIP' },
    { source: "I don't fucking know", target: 'FileIO' },
    { source: "I don't fucking know", target: 'OOP' },
    { source: "I don't fucking know", target: 'SysOps' },
    { source: "I don't fucking know", target: 'ImageRec' },
    { source: "I don't fucking know", target: 'HPC' }
  ];

  const svg       = document.getElementById('sk-svg');
  const viewport  = document.getElementById('sk-viewport');
  const edgeLayer = document.getElementById('sk-edges');
  const nodeLayer = document.getElementById('sk-nodes');
  const tip       = document.getElementById('sk-tip');
  if (!svg || !viewport || !edgeLayer || !nodeLayer) return;

  const reduceMotion = RESPECT_REDUCED_MOTION &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ROOT = '__me__';
  const NODE_W = 186, NODE_H = 38;
  const COL = 232, ROW = 54, GROUP_GAP = 0.45;
  const FIRST_X = 110;              // 第一層分類的左緣
  const ROOT_R = 34;
  const RING_R = 10, RING_C = 2 * Math.PI * RING_R;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const LEVELS = [[90, '精通'], [70, '熟練'], [50, '堪用'], [30, '入門'], [0, '摸過']];
  const levelOf = p => LEVELS.find(([min]) => p >= min)[1];

  /*  建樹  */
  const nodes = new Map();
  skills.forEach(s => nodes.set(s.id, Object.assign({}, s, { kids: [], parent: null })));
  nodes.set(ROOT, { id: ROOT, label: '我', progress: 100, desc: '一切的起點', kids: [], parent: null });

  const extraEdges = [];   
  edges.forEach(e => {
    const a = nodes.get(e.source), b = nodes.get(e.target);
    if (!a || !b) return;
    if (b.parent) { extraEdges.push(e); return; }
    a.kids.push(b.id);
    b.parent = a.id;
  });

  const roots = skills.map(s => s.id).filter(id => !nodes.get(id).parent);
  roots.forEach(id => {
    nodes.get(ROOT).kids.push(id);
    nodes.get(id).parent = ROOT;
  });

  let cursor = 0;
  const placed = new Set([ROOT]);

  function place(id, depth) {
    const n = nodes.get(id);
    if (placed.has(id)) return n.row;
    placed.add(id);
    n.depth = depth;
    const kids = n.kids.filter(k => !placed.has(k));
    if (!kids.length) {
      n.row = cursor++;
      return n.row;
    }
    const rows = kids.map(k => place(k, depth + 1));
    n.row = (rows[0] + rows[rows.length - 1]) / 2;
    return n.row;
  }

  roots.forEach((id, i) => {
    if (i) cursor += GROUP_GAP;
    place(id, 1);
  });

  const me = nodes.get(ROOT);
  me.depth = 0;
  me.row = roots.length
    ? (nodes.get(roots[0]).row + nodes.get(roots[roots.length - 1]).row) / 2
    : 0;

  nodes.forEach(n => {
    n.hx = n.depth === 0 ? 0 : FIRST_X + (n.depth - 1) * COL;   
    n.hy = n.row * ROW;
    n.bx = n.hx;                                                
    n.by = n.hy;
    n.ox = 0;                                                   
    n.oy = 0;
    n.fa = Math.random() * Math.PI * 2;
    n.fs = 0.55 + Math.random() * 0.5;
    n.famp = 2.2 + Math.random() * 2;
  });

  /*  畫 SVG  */
  function el(tag, attrs, text) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  const edgeList = [];
  nodes.forEach(n => n.kids.forEach(k => edgeList.push({ from: n.id, to: k })));
  extraEdges.forEach(e => edgeList.push({ from: e.source, to: e.target }));

  edgeList.forEach(e => {
    e.base = el('path', { class: 'sk-edge' + (e.from === ROOT ? ' from-root' : '') });
    e.flow = el('path', { class: 'sk-flow' });
    e.flow.style.animationDelay = (-Math.random() * 1.5).toFixed(2) + 's';
    edgeLayer.append(e.base, e.flow);
  });

  nodes.forEach(n => {
    const g = el('g', { class: 'sk-node', 'data-id': n.id, tabindex: '0', role: 'button' });

    if (n.id === ROOT) {
      g.classList.add('is-root');
      g.setAttribute('aria-label', '我：技能樹的起點');
      g.append(
        el('circle', { class: 'sk-root-ping', r: ROOT_R + 4 }),
        el('circle', { class: 'sk-root-bg', r: ROOT_R + 2 }),
        el('image', {
          href: 'images/image14841987481.png',
          x: -ROOT_R, y: -ROOT_R, width: ROOT_R * 2, height: ROOT_R * 2,
          'clip-path': 'url(#sk-clip)', preserveAspectRatio: 'xMidYMid slice'
        }),
        el('circle', { class: 'sk-root-ring', r: ROOT_R + 6 }),
        el('text', { class: 'sk-root-label', y: ROOT_R + 28, 'text-anchor': 'middle' }, '我')
      );
    } else {
      const p = Math.max(0, Math.min(100, Number(n.progress) || 0));
      n.progress = p;
      if (n.depth === 1) g.classList.add('is-cat');
      if (p >= 80) g.classList.add('is-lit');
      g.style.setProperty('--p', (p / 100).toFixed(2));
      g.setAttribute('aria-label', `${n.label}，熟練度 ${p}%（${levelOf(p)}）：${n.desc}`);

      n.labelEl = el('text', { class: 'sk-label', x: 42, y: 1, 'dominant-baseline': 'central' }, n.label);
      g.append(
        el('rect', { class: 'sk-box', x: 0, y: -NODE_H / 2, width: NODE_W, height: NODE_H, rx: NODE_H / 2 }),
        el('circle', { class: 'sk-ring-track', cx: 21, cy: 0, r: RING_R }),
        el('circle', {
          class: 'sk-ring', cx: 21, cy: 0, r: RING_R,
          'stroke-dasharray': `${(RING_C * p / 100).toFixed(2)} ${RING_C.toFixed(2)}`,
          transform: 'rotate(-90 21 0)'
        }),
        n.labelEl
      );
    }

    n.g = g;
    nodeLayer.append(g);
  });

  let labelsFitted = false;
  function fitLabels() {
    if (labelsFitted) return;
    labelsFitted = true;
    const max = NODE_W - 42 - 14;
    nodes.forEach(n => {
      if (!n.labelEl) return;
      try {
        if (n.labelEl.getComputedTextLength() > max) {
          n.labelEl.setAttribute('textLength', max);
          n.labelEl.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        }
      } catch (e) { /* 量不到就算了 */ }
    });
  }

  const pos = n => ({ x: n.bx + n.ox, y: n.by + n.oy });

  function anchorOut(n) {
    const p = pos(n);
    return n.id === ROOT ? { x: p.x + ROOT_R + 6, y: p.y } : { x: p.x + NODE_W, y: p.y };
  }

  function anchorIn(n) {
    const p = pos(n);
    return n.id === ROOT ? { x: p.x - ROOT_R - 6, y: p.y } : { x: p.x, y: p.y };
  }

  function drawNode(n) {
    const p = pos(n);
    n.g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  }

  function drawEdge(e) {
    const a = anchorOut(nodes.get(e.from));
    const b = anchorIn(nodes.get(e.to));
    const dx = Math.max(40, Math.abs(b.x - a.x) * 0.5);
    const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} C${(a.x + dx).toFixed(1)} ${a.y.toFixed(1)} ${(b.x - dx).toFixed(1)} ${b.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    e.base.setAttribute('d', d);
    e.flow.setAttribute('d', d);
  }

  function drawAll() {
    nodes.forEach(drawNode);
    edgeList.forEach(drawEdge);
  }

  function bounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    nodes.forEach(n => {
      const isRoot = n.id === ROOT;
      x0 = Math.min(x0, isRoot ? n.bx - ROOT_R - 12 : n.bx);
      x1 = Math.max(x1, isRoot ? n.bx + ROOT_R + 12 : n.bx + NODE_W);
      y0 = Math.min(y0, isRoot ? n.by - ROOT_R - 12 : n.by - NODE_H / 2);
      y1 = Math.max(y1, isRoot ? n.by + ROOT_R + 36 : n.by + NODE_H / 2);
    });
    return { x0, y0, x1, y1 };
  }

  let k = 1, tx = 0, ty = 0, fitK = 1, minK = 0.3, viewAnim = null;

  function applyView() {
    viewport.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)})`);
  }

  function stageRect() {
    const nav = document.querySelector('.navbar, #navbar-mount');
    const top = nav ? nav.getBoundingClientRect().bottom : 0;
    let bottom = svg.clientHeight;
    const panel = document.querySelector('.sk-panel');
    if (panel && panel.offsetWidth > svg.clientWidth * 0.6) {
      bottom = Math.min(bottom, panel.getBoundingClientRect().top - 8);
    }
    return { x: 0, y: top, w: svg.clientWidth, h: Math.max(100, bottom - top) };
  }

  const clampK = v => Math.max(minK, Math.min(2.6, v));

  function setView(nk, ntx, nty, dur) {
    cancelAnimationFrame(viewAnim);
    if (!dur || reduceMotion) {
      k = nk; tx = ntx; ty = nty;
      applyView();
      if (activeId) positionTip();
      return;
    }
    const k0 = k, x0 = tx, y0 = ty, t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      k = k0 + (nk - k0) * e;
      tx = x0 + (ntx - x0) * e;
      ty = y0 + (nty - y0) * e;
      applyView();
      if (activeId) positionTip();
      if (t < 1) viewAnim = requestAnimationFrame(step);
    };
    viewAnim = requestAnimationFrame(step);
  }

  function fit(dur) {
    const b = bounds();
    const r = stageRect();
    const pad = Math.max(16, Math.min(60, r.w * 0.05));
    const bw = b.x1 - b.x0, bh = b.y1 - b.y0;
    const kw = (r.w - pad * 2) / bw, kh = (r.h - pad * 2) / bh;

    const narrow = kw < 0.45 && kh > kw;
    fitK = Math.max(0.15, Math.min(1.25, narrow ? Math.min(kh, 0.75) : Math.min(kw, kh)));
    minK = Math.max(0.1, Math.min(kw, kh, fitK) * 0.8);

    setView(
      fitK,
      narrow ? r.x + pad - b.x0 * fitK : r.x + (r.w - bw * fitK) / 2 - b.x0 * fitK,
      r.y + (r.h - bh * fitK) / 2 - b.y0 * fitK,
      dur
    );
  }

  function zoomAt(cx, cy, nk, dur) {
    nk = clampK(nk);
    const wx = (cx - tx) / k, wy = (cy - ty) / k;
    setView(nk, cx - wx * nk, cy - wy * nk, dur);
  }

  function zoomBy(f) {
    const r = stageRect();
    zoomAt(r.x + r.w / 2, r.y + r.h / 2, k * f, 280);
  }

  /*  漂浮  */
  let floatRaf = null, lastFloat = 0, dragNode = null;

  function floatOffset(n, t) {
    return [Math.cos(t * n.fs + n.fa) * n.famp, Math.sin(t * n.fs * 1.3 + n.fa) * n.famp];
  }

  function floatLoop(now) {
    floatRaf = requestAnimationFrame(floatLoop);
    if (document.hidden || now - lastFloat < 33) return;   
    lastFloat = now;
    const t = now / 1000;
    nodes.forEach(n => {
      if (n === dragNode) { n.ox = 0; n.oy = 0; return; }
      [n.ox, n.oy] = floatOffset(n, t);
    });
    drawAll();
    if (activeId) positionTip();
  }

  function startFloat() {
    if (reduceMotion || floatRaf != null) return;
    floatRaf = requestAnimationFrame(floatLoop);
  }

  function stopFloat() {
    cancelAnimationFrame(floatRaf);
    floatRaf = null;
  }

  let activeId = null, pinned = false;

  function lineage(id) {
    const set = new Set([id]);
    let n = nodes.get(id);
    while (n && n.parent) { set.add(n.parent); n = nodes.get(n.parent); }
    const stack = nodes.get(id).kids.slice();
    while (stack.length) {
      const c = stack.pop();
      if (set.has(c)) continue;
      set.add(c);
      stack.push(...nodes.get(c).kids);
    }
    return set;
  }

  function highlight(id) {
    const set = id ? lineage(id) : null;
    svg.classList.toggle('is-focus', !!set);
    nodes.forEach(n => n.g.classList.toggle('is-hl', !!set && set.has(n.id)));
    edgeList.forEach(e => {
      const on = !!set && set.has(e.from) && set.has(e.to);
      e.base.classList.toggle('is-hl', on);
      e.flow.classList.toggle('is-hl', on);
    });
  }

  function trail(id) {
    const out = [];
    let n = nodes.get(id);
    while (n) {
      out.unshift(n.label);
      n = n.parent ? nodes.get(n.parent) : null;
    }
    return out.join(' › ');
  }

  function showTip(id, pin) {
    const n = nodes.get(id);
    if (!n || !tip) return;
    pinned = !!pin;
    if (activeId === id) return;
    activeId = id;

    nodes.forEach(m => m.g.classList.toggle('is-active', m.id === id));
    highlight(id);

    tip.replaceChildren();
    const head = document.createElement('div');
    head.className = 'sk-tip-head';
    const title = document.createElement('strong');
    title.className = 'sk-tip-title';
    title.textContent = n.label;
    head.append(title);

    if (id === ROOT) {
      const lv = document.createElement('span');
      lv.className = 'sk-tip-lv';
      lv.textContent = `${skills.length} 項技能`;
      head.append(lv);
    } else {
      const lv = document.createElement('span');
      lv.className = 'sk-tip-lv';
      lv.textContent = levelOf(n.progress);
      const pct = document.createElement('span');
      pct.className = 'sk-tip-pct';
      pct.textContent = n.progress + '%';
      head.append(lv, pct);
    }
    tip.append(head);

    if (id !== ROOT) {
      const bar = document.createElement('div');
      bar.className = 'sk-tip-bar';
      const fill = document.createElement('i');
      fill.style.width = n.progress + '%';
      bar.append(fill);
      tip.append(bar);
    }

    const desc = document.createElement('p');
    desc.className = 'sk-tip-desc';
    desc.textContent = n.desc;
    tip.append(desc);

    if (id !== ROOT) {
      const path = document.createElement('p');
      path.className = 'sk-tip-path';
      path.textContent = trail(id);
      tip.append(path);
    }

    tip.hidden = false;
    positionTip();
    requestAnimationFrame(() => tip.classList.add('show'));
  }

  function hideTip() {
    if (!activeId) return;
    activeId = null;
    pinned = false;
    if (tip) tip.classList.remove('show');
    nodes.forEach(m => m.g.classList.remove('is-active'));
    highlight(null);
  }

  function positionTip() {
    const n = nodes.get(activeId);
    if (!n || !tip) return;
    const r = n.g.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    const top = stageRect().y + 8;
    const W = window.innerWidth, H = window.innerHeight;

    let x = r.right + 14;
    let y = r.top + r.height / 2 - th / 2;
    if (x + tw > W - 10) x = r.left - tw - 14;
    if (x < 10) {
      x = Math.min(Math.max(10, r.left + r.width / 2 - tw / 2), W - tw - 10);
      y = r.bottom + 12;
      if (y + th > H - 10) y = r.top - th - 12;
    }
    y = Math.max(top, Math.min(y, H - th - 10));
    tip.style.left = x.toFixed(0) + 'px';
    tip.style.top = y.toFixed(0) + 'px';
  }

  const pointers = new Map();
  let mode = null, start = null, moved = false, downId = null, pinch = null;

  svg.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();   // 不要讓滑鼠點擊順便搶焦點、選取文字
    svg.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const [p1, p2] = [...pointers.values()];
      pinch = {
        d: Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1,
        k, tx, ty,
        mx: (p1.x + p2.x) / 2,
        my: (p1.y + p2.y) / 2
      };
      if (dragNode) endDrag();
      mode = 'pinch';
      return;
    }
    if (pointers.size > 2) return;

    const g = e.target.closest('.sk-node');
    downId = g ? g.dataset.id : null;
    dragNode = g ? nodes.get(downId) : null;
    mode = dragNode ? 'node' : 'pan';
    moved = false;

    if (dragNode) {
      const [ox, oy] = floatOffset(dragNode, performance.now() / 1000);
      dragNode.bx += ox;
      dragNode.by += oy;
    }
    start = { x: e.clientX, y: e.clientY, tx, ty, bx: dragNode ? dragNode.bx : 0, by: dragNode ? dragNode.by : 0 };
  });

  svg.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (mode === 'pinch' && pointers.size >= 2) {
      const [p1, p2] = [...pointers.values()];
      const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const nk = clampK(pinch.k * d / pinch.d);
      const wx = (pinch.mx - pinch.tx) / pinch.k;
      const wy = (pinch.my - pinch.ty) / pinch.k;
      setView(nk, (p1.x + p2.x) / 2 - wx * nk, (p1.y + p2.y) / 2 - wy * nk, 0);
      return;
    }
    if (!start) return;

    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!moved) {
      if (Math.hypot(dx, dy) < 5) return;
      moved = true;
      svg.classList.add(mode === 'node' ? 'is-dragging' : 'is-panning');
      if (mode === 'pan' && !pinned) hideTip();
    }

    if (mode === 'pan') {
      setView(k, start.tx + dx, start.ty + dy, 0);
    } else if (mode === 'node' && dragNode) {
      dragNode.bx = start.bx + dx / k;
      dragNode.by = start.by + dy / k;
      dragNode.ox = dragNode.oy = 0;
      drawNode(dragNode);
      edgeList.forEach(ed => {
        if (ed.from === dragNode.id || ed.to === dragNode.id) drawEdge(ed);
      });
      if (activeId === dragNode.id) positionTip();
    }
  });

  function endDrag() {
    if (!dragNode) return;
    const [ox, oy] = floatOffset(dragNode, performance.now() / 1000);
    dragNode.bx -= ox;
    dragNode.by -= oy;
    dragNode = null;
  }

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);

    if (mode === 'pinch') {
      if (pointers.size === 1) {
        const [p] = [...pointers.values()];
        mode = 'pan';
        moved = true;
        start = { x: p.x, y: p.y, tx, ty, bx: 0, by: 0 };
      } else if (!pointers.size) {
        mode = null;
        start = null;
      }
      return;
    }

    if (!moved && e.type === 'pointerup') {
      if (downId) {
        if (activeId === downId && pinned) hideTip();
        else { if (activeId !== downId) hideTip(); showTip(downId, true); }
      } else {
        hideTip();
      }
    }

    endDrag();
    svg.classList.remove('is-panning', 'is-dragging');
    mode = null;
    start = null;
    downId = null;
  }

  svg.addEventListener('pointerup', endPointer);
  svg.addEventListener('pointercancel', endPointer);

  svg.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse' || mode || pinned) return;
    const g = e.target.closest('.sk-node');
    if (g) showTip(g.dataset.id, false);
  });

  svg.addEventListener('pointerout', (e) => {
    if (e.pointerType !== 'mouse' || mode || pinned) return;
    const g = e.target.closest('.sk-node');
    if (g && !g.contains(e.relatedTarget)) hideTip();
  });

  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 0.05 : 0.0018;
    zoomAt(e.clientX, e.clientY, k * Math.exp(-e.deltaY * unit), 0);
  }, { passive: false });

  svg.addEventListener('dblclick', (e) => {
    if (!e.target.closest('.sk-node')) fit(450);
  });

  nodeLayer.addEventListener('focusin', (e) => {
    const g = e.target.closest('.sk-node');
    if (!g) return;
    hideTip();
    showTip(g.dataset.id, true);
    const r = g.getBoundingClientRect(), s = stageRect();
    if (r.left < 0 || r.right > s.w || r.top < s.y || r.bottom > s.y + s.h) {
      const n = nodes.get(g.dataset.id);
      setView(k, s.w / 2 - (n.bx + (n.id === ROOT ? 0 : NODE_W / 2)) * k, s.y + s.h / 2 - n.by * k, 300);
    }
  });

  nodeLayer.addEventListener('focusout', (e) => {
    if (!nodeLayer.contains(e.relatedTarget)) hideTip();
  });

  svg.addEventListener('keydown', (e) => {
    const g = e.target.closest && e.target.closest('.sk-node');
    if (e.key === '+' || e.key === '=') { zoomBy(1.2); e.preventDefault(); }
    else if (e.key === '-' || e.key === '_') { zoomBy(1 / 1.2); e.preventDefault(); }
    else if (e.key === '0') { fit(400); e.preventDefault(); }
    else if (e.key === 'Escape') hideTip();
    else if (!g && e.key.startsWith('Arrow')) {
      const step = 60;
      const d = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
      setView(k, tx + d[0], ty + d[1], 150);
      e.preventDefault();
    }
  });

  /*  控制面板  */
  const $ = id => document.getElementById(id);

  const stats = $('sk-stats');
  if (stats) {
    const avg = Math.round(skills.reduce((s, x) => s + (Number(x.progress) || 0), 0) / skills.length);
    const lit = skills.filter(s => s.progress >= 80).length;
    stats.textContent = `${skills.length} 項技能 · ${lit} 顆亮星 · 平均熟練度 ${avg}%`;
  }

  $('sk-zoom-in')  && $('sk-zoom-in').addEventListener('click', () => zoomBy(1.25));
  $('sk-zoom-out') && $('sk-zoom-out').addEventListener('click', () => zoomBy(1 / 1.25));
  $('sk-reset')    && $('sk-reset').addEventListener('click', () => {
    nodes.forEach(n => { n.bx = n.hx; n.by = n.hy; });
    hideTip();
    drawAll();
    fit(500);
  });

  /*  清單模式  */
  function renderList() {
    const tree = $('sk-tree');
    if (!tree) return;

    function item(id) {
      const n = nodes.get(id);
      const li = document.createElement('li');
      li.className = 'sk-li';

      const card = document.createElement('div');
      card.className = 'sk-card' + (n.depth === 1 ? ' is-cat' : '');

      const head = document.createElement('div');
      head.className = 'sk-card-head';
      const name = document.createElement('span');
      name.className = 'sk-card-name';
      name.textContent = n.label;
      const lv = document.createElement('span');
      lv.className = 'sk-card-lv';
      lv.textContent = levelOf(n.progress);
      const pct = document.createElement('span');
      pct.className = 'sk-card-pct';
      pct.textContent = n.progress + '%';
      head.append(name, lv, pct);

      const bar = document.createElement('div');
      bar.className = 'sk-card-bar';
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-label', n.label);
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', String(n.progress));
      const fill = document.createElement('i');
      fill.style.width = n.progress + '%';
      bar.append(fill);

      const desc = document.createElement('p');
      desc.className = 'sk-card-desc';
      desc.textContent = n.desc;

      card.append(head, bar, desc);
      li.append(card);

      if (n.kids.length) {
        const ul = document.createElement('ul');
        n.kids.forEach(k => ul.append(item(k)));
        li.append(ul);
      }
      return li;
    }

    roots.forEach(id => tree.append(item(id)));
  }

  const modeBtn = $('sk-mode');

  function setMode(list) {
    document.body.classList.toggle('sk-list-mode', list);
    if (modeBtn) {
      modeBtn.textContent = list ? '星圖模式' : '清單模式';
      modeBtn.setAttribute('aria-pressed', String(list));
    }
    if (list) {
      stopFloat();
      hideTip();
    } else {
      window.scrollTo(0, 0);
      fitLabels();
      fit(0);
      startFloat();
    }
  }

  if (modeBtn) modeBtn.addEventListener('click', () => {
    setMode(!document.body.classList.contains('sk-list-mode'));
  });

  renderList();
  drawAll();
  setMode(window.matchMedia('(max-width: 700px)').matches);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!document.body.classList.contains('sk-list-mode')) fit(0);
    }, 120);
  });

  document.addEventListener('navmenu:toggle', () => hideTip());
})();
