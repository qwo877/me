document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });

  const texts = [
    "一天天的你們都在電我qwp",
    "注意!!!!!!!!!!!!!     感謝你的注意。",
    "你有什麼不開心的事? 講出來讓大家開心一下嘛",
    "早安 你是來關注廢物的嗎",
    "..................沒事",
    "每次去回收場都差點一起被丟進回收場",
    "?你好  歡迎來到這裡",
    "每次看完這行字 就表示你的人生又被浪費10秒鐘",
    "你知道嗎?.....我不知道"
  ];

  const typeSpeed = 80;
  const backspaceSpeed = 50;
  const pauseTime = 1000;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const container = document.getElementById('typewriter');
  container.textContent = '';

  function typeWriter() {
    const currentText = texts[textIndex];
    container.textContent = currentText.substring(0, isDeleting ? charIndex-- : charIndex++);

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => isDeleting = true, pauseTime);
    }

    let delay = typeSpeed;
    if (isDeleting) {
      const currentChar = currentText.charAt(charIndex);
      delay = currentChar === ' ' ? 0 : backspaceSpeed;
    }

    setTimeout(typeWriter, delay);
  }

  typeWriter();
});
function showToast() {
      const toast = document.getElementById('toast');
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
(function () {
  const url = "https://qwo877.github.io/me/XD";
  let r = false;

  const d = {
    open: false,
    orientation: null,
  };

  const t = 160;

  const e = (state) => {
    if (state && !r) {
      r = true;
      window.location.href = url;
    }
  };

  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > t;
    const heightThreshold = window.outerHeight - window.innerHeight > t;

    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (
      !(heightThreshold && widthThreshold) &&
      ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) ||
        widthThreshold || heightThreshold)
    ) {
      if (!d.open || d.orientation !== orientation) {
        e(true);
      }
      d.open = true;
      d.orientation = orientation;
    } else {
      d.open = false;
      d.orientation = null;
    }
  }, 500);
})();
(function(){
    const link = document.getElementById('dynamic-favicon');

    function setFavicon(dataURL) {
      link.setAttribute('href', dataURL + '#v=' + Date.now());
    }
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        document.title = 'qwo877';
        setFavicon("images/1276100847951941776.png");
      } else {
        document.title = '為什麼跑了';
        setFavicon("images/4751354.webp");
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    handleVisibilityChange();
  })();