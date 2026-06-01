const MANIFEST_URL = './manifest.json';

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

async function renderList() {
  const listEl   = document.getElementById('article-list');
  const searchEl = document.getElementById('search-input');
  const tagEl    = document.getElementById('tag-filter');

  let articles;
  try {
    ({ articles } = await loadManifest());
  } catch (e) {
    listEl.innerHTML = `<p class="no-result">載入文章列表失敗：${e.message}</p>`;
    return;
  }

  const allTags = [...new Set(articles.flatMap(a => a.tags))];
  allTags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    tagEl.appendChild(opt);
  });

  function render(list) {
    listEl.innerHTML = '';
    if (!list.length) {
      listEl.innerHTML = '<p class="no-result">找不到符合的文章 :(</p>';
      return;
    }
    list.forEach(a => {
      const card = document.createElement('a');
      card.className = 'article-card';
      card.href = `article.html?id=${encodeURIComponent(a.id)}`;
      card.setAttribute('role', 'listitem');
      card.innerHTML = `
        <div class="card-header">
          <div class="card-tags">${a.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
          <time class="card-date" datetime="${escapeHtml(a.date)}">${formatDate(a.date)}</time>
        </div>
        <h2 class="card-title">${escapeHtml(a.title)}</h2>
        <p class="card-desc">${escapeHtml(a.description)}</p>
        <span class="card-arrow">閱讀全文 →</span>
      `;
      listEl.appendChild(card);
    });
  }

  function applyFilter() {
    const kw  = searchEl.value.trim().toLowerCase();
    const tag = tagEl.value;
    render(articles.filter(a =>
      (!tag || a.tags.includes(tag)) &&
      (!kw  || a.title.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw))
    ));
  }

  searchEl.addEventListener('input', applyFilter);
  tagEl.addEventListener('change', applyFilter);
  render(articles);
}

// 把 ```mermaid 區塊轉成 <div class="mermaid"> 並渲染成圖
async function renderMermaid(container) {
  const codes = container.querySelectorAll('pre code.language-mermaid');
  if (!codes.length) return;

  // type="module" 是非同步載入，等 window.mermaid 就緒（最多 5 秒）
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
        // 開頭/結尾不貼空白，避開 "$5 和 $10" 這類貨幣誤判
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

async function renderArticle(id) {
  const titleEl   = document.getElementById('article-title');
  const metaEl    = document.getElementById('article-meta');
  const contentEl = document.getElementById('article-content');
  const tocEl     = document.getElementById('article-toc');
  const backBtn   = document.getElementById('back-btn');

  let articles;
  try {
    ({ articles } = await loadManifest());
  } catch (e) {
    contentEl.innerHTML = `<p class="error-msg">manifest.json 載入失敗：${e.message}</p>`;
    return;
  }

  const meta = articles.find(a => a.id === id);
  if (!meta) {
    document.title = '文章不存在 — qwo877';
    contentEl.innerHTML = '<p class="error-msg">找不到此文章，確認 id 是否正確。</p>';
    return;
  }

  document.title = `${meta.title} — qwo877`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);

  titleEl.textContent = meta.title;
  metaEl.innerHTML = `
    <time datetime="${escapeHtml(meta.date)}">${formatDate(meta.date)}</time>
    <span class="sep">·</span>
    ${meta.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
  `;

  let md;
  try {
    const res = await fetch(meta.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    md = await res.text();
  } catch (e) {
    contentEl.innerHTML = `<p class="error-msg">文章載入失敗：${e.message}</p>`;
    return;
  }

  marked.setOptions({ breaks: true, gfm: true });
  setupMarkedMath();
  contentEl.innerHTML = marked.parse(md);

  // 先把 mermaid 區塊轉成圖（會移除對應的 <pre><code>）
  await renderMermaid(contentEl);

  // 程式碼高亮（mermaid 區塊此時已不是 pre code，不會被誤上色）
  if (window.hljs) {
    contentEl.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
  }

  // 數學式
  renderMath(contentEl);

  const headings = contentEl.querySelectorAll('h2, h3');
  if (headings.length) {
    const ul = document.createElement('ul');
    headings.forEach((h, i) => {
      const anchor = `h-${i}`;
      h.id = anchor;
      const li = document.createElement('li');
      li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
      li.innerHTML = `<a href="#${anchor}">${h.textContent}</a>`;
      ul.appendChild(li);
    });
    tocEl.appendChild(ul);
  }

  backBtn?.addEventListener('click', () => {
    window.location.href = 'article.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getParam('id');
  if (id) {
    renderArticle(id);
  } else {
    renderList();
  }
});
