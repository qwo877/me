cytoscape.use( cytoscapeDagre );
const skills = [
  { id: 'AI', label: 'AI', progress: 90, desc: '人工智慧，涉及多種子領域' },
  { id: 'ML', label: '機器學習', progress: 80, desc: '從數據中訓練模型進行預測或分類' },
  { id: 'DL', label: '深度學習', progress: 60, desc: '使用神經網路進行多層次數據處理' },
  { id: 'RL', label: '強化學習', progress: 50, desc: '代理學習透過獎勵與懲罰進行行為決策' },
  { id: 'CNN', label: 'CNN神經捲積模型', progress: 30, desc: 'ai模型之一 常用於生成圖片' },
  { id: 'FE', label: '前端開發', progress: 70, desc: '使用者所看到、所互動的部分' },
  { id: 'Web Dev', label: '網頁', progress: 70, desc: '在一個網站頁面中所看到的部分' },
  { id: 'SW', label: '軟體', progress: 30, desc: 'app....這能怎麼解釋?' },
  { id: 'BE', label: '後端開發', progress: 70, desc: '一個正常網站的核心 多數處理的部分' },
  { id: 'PF', label: 'flask', progress: 70, desc: '輕量化的後端框架' },
  { id: 'MS', label: 'mysql', progress: 70, desc: '資料庫系統' },
  { id: 'PG', label: '遊戲開發', progress: 70, desc: '使用C#與pygame開發小糞game' },
  { id: 'a', label: '關於這個網頁', progress: 0, desc: '我知道它有一堆bug 但我修不好 我是廢物qwp 而且好醜XD' },
  { id: '專業基礎學科', label: '專業基礎學科', progress: 20, desc: '自動控制科的專業學科' },
  { id: 'Algo', label: '演算法', progress: 20, desc: '基礎的演算法' },
  { id: 'MLP', label: '多層感知機', progress: 70, desc: '在感知機的基礎上做感知機堆疊(隱藏層)' },
  { id: 'Perceptron', label: '感知機', progress: 90, desc: '一切ai的始祖,神經網路的雛形' },
  { id: 'DS', label: '資料結構', progress: 90, desc: '演算法的基礎，資料如何儲存與操作會直接影響效率與表現' },
  {id: 'PSM', label: '演算方法', progress: 70, desc: '各種解題策略與思維模式，如動態規劃、貪婪法、回溯法等，是寫出有效演算法的核心技巧'},
  {id: 'I don\'t fucking know', label: '其他', progress: 100, desc: '各種無法分類'},
  { id: 'FileIO', label: '檔案操作', progress: 85, desc: '讀寫文字、CSV、JSON 等檔案，是資料處理與自動化不可或缺的技能' },
  { id: 'ImageRec', label: '影像識別', progress: 60, desc: '讓電腦看得懂圖片，基於 CNN 等技術，廣泛應用於 AI 與電腦視覺領域' },
  { id: 'SysOps', label: '系統操作', progress: 50, desc: '透過程式控制系統資源，如檔案系統、執行程序、環境變數與權限設定' },
  { id: 'OOP', label: '物件導向', progress: 75, desc: '以類別與物件為核心的程式設計方式，強調封裝、繼承與多型' }
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
  { source: 'I don\'t fucking know', target: 'FileIO' },
  { source: 'I don\'t fucking know', target: 'OOP' },
  { source: 'I don\'t fucking know', target: 'SysOps' },
  { source: 'I don\'t fucking know', target: 'ImageRec' },
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
  name: 'dagre',        // 改用 dagre 佈局
  rankDir: 'LR',        // LR: 左→右 排；想要上下排就改 'TB'
  nodeSep: 50,          // 同層節點間距
  edgeSep: 20,          // 不同組(邊)間距
  rankSep: 80,          // 各層之間間距
  ranker: 'network-simplex'
},

  minZoom: 1,
  maxZoom: 1,
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
function showToast() {
      const toast = document.getElementById('toast');
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);

    }

