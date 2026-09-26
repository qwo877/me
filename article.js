const MANIFEST_URL = './manifest.json';
const STICKER = 'images/855301079788027914.png';

const ICON_ARROW = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_CAL   = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
const ICON_CLOCK = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
const ICON_COPY  = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg>';

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function loadManifest() {
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error('無法載入 manifest.json');
  return res.json();
}

const byNewest = (a, b) => new Date(b.date) - new Date(a.date);

async function renderList() {
  const listEl   = document.getElementById('article-list');
  const searchEl = document.getElementById('search-input');
  const tagEl    = document.getElementById('tag-filter');
  const countEl  = document.getElementById('list-count');

  let articles;
  try {
    ({ articles } = await loadManifest());
  } catch (e) {
    listEl.innerHTML = `<p class="no-result">載入文章列表失敗：${escapeHtml(e.message)}</p>`;
    return;
  }

  const newest = articles.slice().sort(byNewest)[0];

  const tagCounts = new Map();
  articles.forEach(a => a.tags.forEach(t => tagCounts.set(t, (tagCounts.get(t) || 0) + 1)));
  let activeTag = '';

  function chip(tag, label, count) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tag-btn';
    b.dataset.tag = tag;
    b.setAttribute('aria-pressed', String(tag === activeTag));
    b.innerHTML = `${escapeHtml(label)}<span class="tag-count">${count}</span>`;
    return b;
  }

  tagEl.append(chip('', '全部', articles.length), ...[...tagCounts].map(([t, c]) => chip(t, t, c)));

  tagEl.addEventListener('click', (e) => {
    const b = e.target.closest('.tag-btn');
    if (!b) return;
    activeTag = b.dataset.tag === activeTag ? '' : b.dataset.tag;
    tagEl.querySelectorAll('.tag-btn').forEach(x => {
      x.setAttribute('aria-pressed', String(x.dataset.tag === activeTag));
    });
    applyFilter();
  });

  function render(list) {
    listEl.innerHTML = '';
    if (countEl) {
      countEl.textContent = list.length === articles.length ? `共 ${list.length} 篇` : `找到 ${list.length} 篇`;
    }
    if (!list.length) {
      listEl.innerHTML = '<p class="no-result">找不到符合的文章 :(</p>';
      return;
    }
    list.forEach(a => {
      const cell = document.createElement('div');
      cell.className = 'card-cell reveal';
      cell.setAttribute('role', 'listitem');

      const card = document.createElement('a');
      card.className = 'article-card spot';
      card.href = `article.html?id=${encodeURIComponent(a.id)}`;
      const badge = newest && a.id === newest.id ? '<span class="badge-new">最新</span>' : '';
      card.innerHTML = `
        <div class="card-header">
          <div class="card-tags">${badge}${a.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
          <time class="card-date" datetime="${escapeHtml(a.date)}">${formatDate(a.date)}</time>
        </div>
        <h2 class="card-title">${escapeHtml(a.title)}</h2>
        <p class="card-desc">${escapeHtml(a.description)}</p>
        <span class="card-arrow">閱讀全文 ${ICON_ARROW}</span>
      `;
      cell.appendChild(card);
      listEl.appendChild(cell);
    });
  }

  function applyFilter() {
    const kw = searchEl.value.trim().toLowerCase();
    render(articles.filter(a =>
      (!activeTag || a.tags.includes(activeTag)) &&
      (!kw || a.title.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw))
    ));
  }

  searchEl.addEventListener('input', applyFilter);
  searchEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchEl.value = '';
      applyFilter();
      searchEl.blur();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    e.preventDefault();
    searchEl.focus();
  });

  render(articles);
}

/*  Mermaid  */
// 把 ```mermaid 區塊轉成 <div class="mermaid"> 並渲染成圖
async function renderMermaid(container) {
  const codes = container.querySelectorAll('pre code.language-mermaid');
  if (!codes.length) return;

  // type="module" 非同步載入，等 window.mermaid 就緒（
  if (!window.mermaid) {
    await new Promise(resolve => {
      let waited = 0;
      const timer = setInterval(() => {
        if (window.mermaid || waited >= 5000) { clearInterval(timer); resolve(); }
        waited += 50;
      }, 50);
    });
  }
  if (!window.mermaid) return;

  codes.forEach(code => {
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = code.textContent;   // textContent 會把 &gt; 等實體還原回 >
    code.closest('pre').replaceWith(div);
  });

  try {
    await window.mermaid.run({ nodes: container.querySelectorAll('.mermaid') });
  } catch (e) {
    console.error('Mermaid 渲染失敗：', e);
  }
}

/*  數學式  */
// 讓 marked 在解析階段把 $...$ / $$...$$ 當成獨立 token，
// 不被 breaks(<br>) 或斜體(_)等 markdown 規則破壞，也自動避開程式碼區塊。
function setupMarkedMath() {
  if (!window.marked || marked.__mathReady) return;
  marked.use({
    extensions: [
      {
        name: 'blockMath',
        level: 'block',
        start(src) { const i = src.indexOf('$$'); return i < 0 ? undefined : i; },
        tokenizer(src) {
          const m = /^\$\$([\s\S]+?)\$\$/.exec(src);
          if (m) return { type: 'blockMath', raw: m[0], text: m[1].trim() };
        },
        renderer(t) { return `<div class="math-block">${escapeHtml(t.text)}</div>`; }
      },
      {
        name: 'inlineMath',
        level: 'inline',
        start(src) { const i = src.indexOf('$'); return i < 0 ? undefined : i; },

        tokenizer(src) {
          const m = /^\$(?!\s)([^\n$]+?)(?<!\s)\$/.exec(src);
          if (m) return { type: 'inlineMath', raw: m[0], text: m[1] };
        },
        renderer(t) { return `<span class="math-inline">${escapeHtml(t.text)}</span>`; }
      }
    ]
  });
  marked.__mathReady = true;
}

// 把上面標好的節點交給 KaTeX 渲染（textContent 會還原 < & 等實體）
function renderMath(container) {
  if (!window.katex) return;
  container.querySelectorAll('.math-inline').forEach(el => {
    try { katex.render(el.textContent, el, { displayMode: false, throwOnError: false }); }
    catch (e) { console.error('KaTeX(inline) 失敗：', e); }
  });
  container.querySelectorAll('.math-block').forEach(el => {
    try { katex.render(el.textContent, el, { displayMode: true, throwOnError: false }); }
    catch (e) { console.error('KaTeX(block) 失敗：', e); }
  });
}

/*  加工  */

// 程式碼區塊加上語言標籤和複製鈕（要在 highlight.js 之前做，才抓得到寫的）
function enhanceCode(container) {
  container.querySelectorAll('pre > code').forEach(code => {
    const pre = code.parentElement;
    const m = /language-([\w+#.-]+)/.exec(code.className);
    // 沒標語言的多半是程式輸出，不要讓 highlight.js 亂猜顏色
    if (!m) code.classList.add('language-plaintext');
    const lang = m ? m[1] : 'text';

    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    const head = document.createElement('div');
    head.className = 'code-head';
    head.innerHTML = `<span class="code-lang">${escapeHtml(lang)}</span>` +
      `<button type="button" class="copy-btn" aria-label="複製程式碼">${ICON_COPY}<span>複製</span></button>`;
    pre.replaceWith(wrap);
    wrap.append(head, pre);
  });
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  const code = btn.closest('.code-block').querySelector('code');
  const text = code ? code.textContent : '';
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    ta.remove();
  }
  const label = btn.querySelector('span');
  btn.classList.toggle('done', ok);
  label.textContent = ok ? '已複製' : '複製失敗';
  clearTimeout(btn._timer);
  btn._timer = setTimeout(() => {
    btn.classList.remove('done');
    label.textContent = '複製';
  }, 1600);
});

//
function wrapTables(container) {
  container.querySelectorAll('table').forEach(t => {
    const w = document.createElement('div');
    w.className = 'table-wrap';
    t.replaceWith(w);
    w.append(t);
  });
}

function buildToc(contentEl, tocEl) {
  const headings = [...contentEl.querySelectorAll('h2, h3')];
  if (!headings.length) return;

  const details = document.createElement('details');
  details.className = 'toc-box';
  details.open = window.matchMedia('(min-width: 1200px)').matches;
  details.innerHTML = '<summary># 目錄</summary>';

  const ul = document.createElement('ul');
  const links = headings.map((h, i) => {
    const anchor = `h-${i}`;
    h.id = anchor;
    const li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
    const a = document.createElement('a');
    a.href = `#${anchor}`;
    a.textContent = h.textContent;
    li.append(a);
    ul.append(li);

    const mark = document.createElement('a');
    mark.className = 'h-anchor';
    mark.href = `#${anchor}`;
    mark.textContent = '#';
    mark.setAttribute('aria-label', `連結到「${h.textContent}」`);
    h.append(mark);
    return a;
  });

  details.append(ul);
  tocEl.append(details);

  let ticking = false;
  function spy() {
    ticking = false;
    const nav = document.getElementById('navbar');
    const line = (nav ? nav.offsetHeight : 70) + 90;
    let cur = 0;
    headings.forEach((h, i) => { if (h.getBoundingClientRect().top < line) cur = i; });
    links.forEach((a, i) => a.classList.toggle('is-current', i === cur));
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();

  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
}

// 只算正文：程式碼是用掃的、KaTeX 的 MathML 是給螢幕報讀器的重複內容，都不算
function setReadTime(contentEl) {
  const el = document.getElementById('read-time');
  if (!el) return;
  const clone = contentEl.cloneNode(true);
  clone.querySelectorAll('.code-block, pre, .mermaid, .katex-mathml').forEach(n => n.remove());
  const text = clone.textContent.replace(/\s+/g, '');
  const cjk = (text.match(/[㐀-鿿]/g) || []).length;
  const minutes = Math.max(1, Math.round(cjk / 400 + (text.length - cjk) / 1000));
  el.querySelector('span').textContent = `約 ${minutes} 分鐘`;
  el.hidden = false;
}

function renderPostNav(articles, id) {
  const nav = document.getElementById('post-nav');
  if (!nav) return;
  const sorted = articles.slice().sort(byNewest);
  const i = sorted.findIndex(a => a.id === id);
  if (i < 0) return;

  function link(a, cls, label) {
    const el = document.createElement('a');
    el.className = `post-link ${cls} spot`;
    el.href = `article.html?id=${encodeURIComponent(a.id)}`;
    el.innerHTML = `<small>${label}</small><strong></strong>`;
    el.querySelector('strong').textContent = a.title;
    return el;
  }

  nav.replaceChildren();
  if (sorted[i + 1]) nav.append(link(sorted[i + 1], 'prev', '← 上一篇'));
  if (sorted[i - 1]) nav.append(link(sorted[i - 1], 'next', '下一篇 →'));
}

// 不支援 scroll-driven animation 的瀏覽器，進度條由這裡更新
function setupProgressFallback() {
  const bar = document.getElementById('read-progress');
  if (!bar || (window.CSS && CSS.supports('animation-timeline: scroll()'))) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--read', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

function errorCard(msg) {
  return `<div class="error-card">
    <img src="${STICKER}" alt="網站作者想要做的太難，所以暫時放棄此網頁" width="324" height="179" decoding="async">
    <p class="error-msg">${escapeHtml(msg)}</p>
  </div>`;
}

/*  文章內頁  */
async function renderArticle(id) {
  const titleEl   = document.getElementById('article-title');
  const metaEl    = document.getElementById('article-meta');
  const contentEl = document.getElementById('article-content');
  const tocEl     = document.getElementById('article-toc');
  const backBtn   = document.getElementById('back-btn');

  // 先綁返回鈕：就算文章載入失敗也回得去
  backBtn?.addEventListener('click', () => {
    window.location.href = 'article.html';
  });

  let articles;
  try {
    ({ articles } = await loadManifest());
  } catch (e) {
    contentEl.innerHTML = errorCard(`manifest.json 載入失敗：${e.message}`);
    return;
  }

  const meta = articles.find(a => a.id === id);
  if (!meta) {
    document.title = '文章不存在 — qwo877';
    titleEl.textContent = '找不到這篇文章';
    contentEl.innerHTML = errorCard('找不到此文章，確認 id 是否正確。');
    return;
  }

  document.title = `${meta.title} — qwo877`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);

  titleEl.textContent = meta.title;
  metaEl.innerHTML = `
    <span class="meta-item">${ICON_CAL}<time datetime="${escapeHtml(meta.date)}">${formatDate(meta.date)}</time></span>
    <span class="meta-item" id="read-time" hidden>${ICON_CLOCK}<span></span></span>
    <span class="sep">·</span>
    ${meta.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
  `;

  renderPostNav(articles, id);
  setupProgressFallback();

  let md;
  try {
    const res = await fetch(meta.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    md = await res.text();
  } catch (e) {
    contentEl.innerHTML = errorCard(`文章載入失敗：${e.message}`);
    return;
  }

  marked.setOptions({ breaks: true, gfm: true });
  setupMarkedMath();
  contentEl.innerHTML = marked.parse(md);

  await renderMermaid(contentEl);

  // 程式碼區塊外框（要在上色之前，才分得出哪些沒標語言）
  enhanceCode(contentEl);

  // 程式碼高亮（mermaid 區塊此時已不是 pre code，不會被誤上色）
  if (window.hljs) {
    contentEl.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
  }

  // 數學式
  renderMath(contentEl);

  wrapTables(contentEl);
  buildToc(contentEl, tocEl);
  setReadTime(contentEl);
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getParam('id');
  if (id) {
    renderArticle(id);
  } else {
    renderList();
  }
});
