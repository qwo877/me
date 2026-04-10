const MANIFEST_URL = './manifest.json';

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
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
      card.href = `article.html?id=${a.id}`;
      card.setAttribute('role', 'listitem');
      card.innerHTML = `
        <div class="card-header">
          <div class="card-tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <time class="card-date">${formatDate(a.date)}</time>
        </div>
        <h2 class="card-title">${a.title}</h2>
        <p class="card-desc">${a.description}</p>
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
    <time>${formatDate(meta.date)}</time>
    <span class="sep">·</span>
    ${meta.tags.map(t => `<span class="tag">${t}</span>`).join('')}
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
  contentEl.innerHTML = marked.parse(md);

  if (window.hljs) {
    contentEl.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
  }

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
