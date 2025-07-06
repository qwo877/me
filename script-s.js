const skills = [
  { id: 'AI', label: 'AI', progress: 90, desc: '人工智慧，涉及多種子領域' },
  { id: 'ML', label: '機器學習', progress: 80, desc: '從數據中訓練模型進行預測或分類' },
  { id: 'DL', label: '深度學習', progress: 60, desc: '使用神經網路進行多層次數據處理' },
  { id: 'RL', label: '強化學習', progress: 50, desc: '代理學習透過獎勵與懲罰進行行為決策' },
  { id: 'NLP', label: 'CNN神經捲積模型', progress: 30, desc: 'ai模型之一 常用於生成圖片' },
  { id: 'FE', label: '前端開發', progress: 70, desc: '使用者所看到、所互動的部分' },
  { id: 'Web Dev', label: '網頁', progress: 70, desc: '在一個網站頁面中所看到的部分' },
  { id: 'SW', label: '軟體', progress: 30, desc: 'app....這能怎麼解釋?' },
  { id: 'BE', label: '後端開發', progress: 70, desc: '一個正常網站的核心 多數處理的部分' },
  { id: 'PF', label: 'flask', progress: 70, desc: '輕量化的後端框架' },
  { id: 'MS', label: 'mysql', progress: 70, desc: '資料庫系統' },
  { id: 'PG', label: '遊戲開發', progress: 70, desc: '使用C#與pygame開發小糞game' },
  { id: 'a', label: '關於這個網頁', progress: 0, desc: '我知道它有一堆bug 但我修不好 我是廢物qwp 而且好醜XD' },
  { id: '專業基礎學科', label: '專業基礎學科', progress: 20, desc: '專業的學科' },
  { id: 'Algo', label: '演算法', progress: 20, desc: '基礎的演算法' },
];

const edges = [
  { source: 'AI', target: 'ML' },
  { source: 'ML', target: 'DL' },
  { source: 'DL', target: 'RL' },
  { source: 'AI', target: 'NLP' },
  { source: 'FE', target: 'Web Dev' },
  { source: 'FE', target: 'SW' },
  { source: 'FE', target: 'PG' },
  { source: 'BE', target: 'PF' },
  { source: 'BE', target: 'MS' },
];

const cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [
    ...skills.map(s => ({ data: { id: s.id, label: s.label, progress: s.progress, desc: s.desc } })),
    ...edges.map(e => ({ data: e }))
  ],
  style: [
    {
      selector: 'node',
      style: {
        'shape': 'roundrectangle',
        'width': 120,
        'height': 60,
        'background-color': ele => {
          const p = ele.data('progress') || 0;
          const r = Math.floor(31 + (118 - 31) * p / 100);
          const g = Math.floor(42 + (199 - 42) * p / 100);
          const b = Math.floor(58 + (192 - 58) * p / 100);
          return `rgb(${r},${g},${b})`;
        },
        'label': 'data(label)',
        'color': 'white',
        'font-size': 14,
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'border-color': '#ffffff',
        'border-width': 2,
        'transition-property': 'background-color, border-color',
        'transition-duration': '0.4s',
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#66ccff',
        'target-arrow-color': '#66ccff',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 1.2,
        'curve-style': 'bezier',
        'line-style': 'solid',
        'opacity': 0.8
      }
    }
  ],
  layout: {
  name: 'breadthfirst',
  fit: true,
  directed: true,
  padding: 50,
  spacingFactor: 1.5,
  orientation: 'horizontal',
  nodeDimensionsIncludeLabels: true
},
  minZoom: 0.2,
  maxZoom: 2.5,
  wheelSensitivity: 0.2
});

cy.ready(() => {
  cy.fit();
});

const tooltip = document.getElementById('tooltip');
cy.on('mouseover', 'node', function(evt) {
  const node = evt.target;
  tooltip.innerText = node.data('desc');
  tooltip.style.display = 'block';
});
cy.on('mouseout', 'node', function() {
  tooltip.style.display = 'none';
});
cy.on('mousemove', function(evt) {
  tooltip.style.left = evt.originalEvent.pageX + 10 + 'px';
  tooltip.style.top = evt.originalEvent.pageY + 10 + 'px';
});
cy.on('zoom', () => {
  const zoom = cy.zoom();
  if (zoom < 0.3) {
    cy.zoom(0.3);
  } else if (zoom > 1.5) {
    cy.zoom(1.5);
  }
});
const floatParams = {};
const draggedSet = new Set();

cy.nodes().forEach(n => {
  floatParams[n.id()] = {
    angle: Math.random() * Math.PI * 2,
    speed: 0.005 + Math.random() * 0.003,
    amplitude: 5 + Math.random() * 3
  };
});

cy.on('grab', 'node', evt => {
  draggedSet.add(evt.target.id());
});

cy.on('free', 'node', evt => {
  const node = evt.target;
  node.data('originalPosition', { x: node.position('x'), y: node.position('y') });
  draggedSet.delete(node.id());
});

function animateFloating() {
  cy.nodes().forEach(n => {
    const id = n.id();
    const f = floatParams[id];
    if (!f || draggedSet.has(id)) return;

    f.angle += f.speed;
    const dx = Math.cos(f.angle) * f.amplitude;
    const dy = Math.sin(f.angle) * f.amplitude;

    const base = n.data('originalPosition') || { x: n.position('x'), y: n.position('y') };
    n.data('originalPosition', base);

    n.position({
      x: base.x + dx,
      y: base.y + dy
    });
  });

  requestAnimationFrame(animateFloating);
}

animateFloating();
