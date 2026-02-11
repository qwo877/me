document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => navMenu.classList.toggle('show'));
  }

  window.showToast = function() {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.classList.add('show');
    setTimeout(()=> toast.classList.remove('show'), 3000);
  };

  (function(){
    const link = document.getElementById('dynamic-favicon');
    function setFavicon(dataURL) { if(link) link.setAttribute('href', dataURL + '#v=' + Date.now()); }
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        document.title = 'qwo877'; setFavicon("images/1276100847951941776.png");
      } else {
        document.title = '為什麼跑了'; setFavicon("images/4751354.webp");
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    handleVisibilityChange();
  })();

  const friendSites = [
    {name:'小一', url:'https://www.instagram.com/littleonechung/', img:'images/vul3.png'},
    {name:'su2u4', url:'https://github.com/su2u4-1/', img:'images/su.jpg'},
    {name:'橘子喵', url:'https://xn--gew.tw/', img:'images/rm6.png'},
    {name:'Icrack', url:'https://lbc0841.github.io/icrack41-blog/', img:'images/D.png'},
    {name:'伊藤有栖', url:'https://siewilly.github.io/', img:'images/iw6.png'},
    {name:'PepperSauce', url:'https://peppersauce0712.github.io/', img:'images/PepperSauce_icon.jpg'},
    {name:'Small Z', url:'https://yuzen9622.github.io/', img:'images/zr.webp'},
    {name:'Justin', url:'https://justin0711.com/', img:'images/ju.png'},
    {name:'南宮柳信', url:'https://nangong5421.github.io/', img:'images/s06.jpg'},
    {name:'伊藤蒼太', url:'https://itousouta15.github.io/', img:'images/itou.png'},
    {name:'伊藤喵貓', url:'https://github.com/twcat0503', img:'images/aul.gif'},
    {name:'鴨鴨', url:'https://ya-ya-12.github.io/', img:'images/u8.png'},
    {name:'SSD', url:'https://linktr.ee/ssd0', img:'images/ssdcom.webp'},
    {name:'Frank', url:'https://frankk.uk/', img:'images/frk.tw.png'},
    {name:'LDN', url:'https://ldn970110.github.io/', img:'images/LDN.jpeg'},
    {name:'Raymond Weng', url:'https://rwc.dpdns.org/', img:'images/ray.png'},
    {name:'郭10', url:'https://yilinguo121.github.io/', img:'images/avatar.webp'},
  ];

  function computeBubbleConfig() {
    const w = window.innerWidth;
    if (w <= 480) return {TOTAL_BUBBLES: 12, BIG_RATIO: 0.05};
    if (w <= 768) return {TOTAL_BUBBLES: 20, BIG_RATIO: 0.07};
    if (w <= 992) return {TOTAL_BUBBLES: 30, BIG_RATIO: 0.09};
    return {TOTAL_BUBBLES: 40, BIG_RATIO: 0.1};
  }

  let cfg = computeBubbleConfig();
  window.addEventListener('resize', () => { cfg = computeBubbleConfig(); });

  const COLORS = ['#48DEDB','#E3AA47','rgba(75, 192, 192, 0.6)'];

  function shuffle(array){
    const a = array.slice();
    for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  const avatarBtn = document.getElementById('avatarBtn');
  const bubbleLayer = document.getElementById('bubbleLayer');

  if(!avatarBtn || !bubbleLayer) {
    console.warn('avatarBtn 或 bubbleLayer 找不到');
    return;
  }

  avatarBtn.addEventListener('click', () => {
    avatarBtn.classList.remove('jump'); void avatarBtn.offsetWidth; avatarBtn.classList.add('jump');
    removeAllBubbles(true); // 清除所有泡泡
    setTimeout(spawnBubbles, 160);
  });

  function removeAllBubbles(force=false){
    const all = bubbleLayer.querySelectorAll('.bubble');
    if(all.length===0) return;
    all.forEach(b=>{
      if(force){ b.remove(); } else { b.classList.add('fade-out'); setTimeout(()=>{ b.remove(); maybeClearLayerPointer(); }, 240); }
    });
  }

  function getValidScatterX(startX, startY, isBig, existing){
    let scatterX, finalX, tries=0;
    do {
      scatterX = (Math.random() - 0.5) * 1200;
      finalX = startX + scatterX;
      tries++;
      var overlap = existing.some(pos => {
        const dx = finalX - pos.x;
        const dy = startY - pos.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        return dist < 100;
      });
    } while(isBig && overlap && tries < 30);
    return scatterX;
  }

  function spawnBubbles(){
    const layerRect = bubbleLayer.getBoundingClientRect();
    const btnRect = avatarBtn.getBoundingClientRect();

    let availableSites = shuffle(friendSites);
    let bigBubblePositions = [];

    bubbleLayer.style.pointerEvents = 'auto';

    for(let i=0;i<cfg.TOTAL_BUBBLES;i++){
      const isBig = Math.random() < cfg.BIG_RATIO && availableSites.length>0;
      const bubble = document.createElement('div');
      bubble.classList.add('bubble', isBig? 'big':'small');

      const color = COLORS[Math.floor(Math.random()*COLORS.length)];
      bubble.style.background = color;
      bubble.style.borderColor = color;

      const startX = btnRect.left - layerRect.left + btnRect.width/2;
      const startY = btnRect.top - layerRect.top - (isBig ? 55 : -10);
      bubble.style.left = (startX - (isBig?55:18)) + 'px';
      bubble.style.top = startY + 'px';

      const scatterX = getValidScatterX(startX, startY, isBig, bigBubblePositions);
      const duration = isBig ? (8000 + Math.random()*9000) : (1000 + Math.random()*9000);

      if(isBig && availableSites.length>0){
        const site = availableSites.shift();
        const a = document.createElement('a');
        a.href = site.url.trim();
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const imgSrc = site.img && site.img.length>0 ? site.img : 'images/default.png';
        a.innerHTML = `
            <img src="${imgSrc}" 
                style="width:86%;height:86%;border-radius:50%;object-fit:cover;">
            <div class="name" style="font-size:12px;margin-top:4px">${escapeHtml(site.name)}</div>`;
        bubble.appendChild(a);

        bubble.addEventListener('click', (e)=>{
            if(e.target.tagName.toLowerCase() !== 'a') window.open(site.url, '_blank', 'noopener');
        });

        bigBubblePositions.push({x:startX+scatterX, y:startY});
      }

      animateUpAndRemoveWithWave(bubble, startX, startY, scatterX, duration);
      bubbleLayer.appendChild(bubble);
    }
  }

  function animateUpAndRemoveWithWave(el, startX, startY, scatterX, duration){
    const startTime = performance.now();
    const amplitude = 12 + Math.random()*12;
    const frequency = 0.0007 + Math.random()*0.0007;

    function animate(time){
      const elapsed = time - startTime;
      const progress = Math.min(elapsed/duration,1);
      const y = startY - progress * (startY + 20);
      const x = startX + scatterX * progress + Math.sin(elapsed * frequency) * amplitude;

      el.style.top = y + 'px';
      el.style.left = (x - (el.classList.contains('big')?55:18)) + 'px';
      el.style.opacity = 1-progress;

      if(progress < 1){
        requestAnimationFrame(animate);
      } else {
        el.remove();
        maybeClearLayerPointer();
      }
    }
    requestAnimationFrame(animate);
  }

  function maybeClearLayerPointer(){
    if(!bubbleLayer.hasChildNodes()){
      bubbleLayer.style.pointerEvents = 'none';
    }
  }

  function escapeHtml(s){ return String(s).replace(/[&<>\"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]); }
  function shortenUrl(u){ try{ const url = new URL(u.trim()); return url.hostname.replace(/^www\./,''); }catch(e){ return u; } }
});