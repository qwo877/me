
(function () {
  const meters = document.querySelectorAll('[data-meter]');
  if (!meters.length) return;

  if (!('IntersectionObserver' in window)) {
    meters.forEach(el => el.classList.add('shown'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    let n = 0;
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.style.transitionDelay = (n++ * 70) + 'ms';
      en.target.classList.add('shown');
      io.unobserve(en.target);
    });
  }, { threshold: 0.4 });

  meters.forEach(el => io.observe(el));
})();
