const menu=document.getElementById('menu');const nav=document.getElementById('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));

/* Interactive optical glass: cursor refraction, drifting haze and micro-bubbles */
(() => {
  const stage = document.getElementById('lensStage');
  const bubbleLayer = document.getElementById('lensBubbles');
  if (!stage || !bubbleLayer) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('i');
    bubble.className = 'glass-bubble';
    bubble.setAttribute('aria-hidden', 'true');
    const size = 5 + Math.random() * 23;
    bubble.style.setProperty('--size', size + 'px');
    bubble.style.setProperty('--left', (4 + Math.random() * 88) + '%');
    bubble.style.setProperty('--top', (4 + Math.random() * 88) + '%');
    bubble.style.setProperty('--duration', (7 + Math.random() * 11) + 's');
    bubble.style.setProperty('--opacity', (0.16 + Math.random() * 0.42).toFixed(2));
    bubble.style.animationDelay = (-Math.random() * 12) + 's';
    bubbleLayer.appendChild(bubble);
  }
  if (reduceMotion) return;
  let frame = 0;
  stage.addEventListener('pointermove', event => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    stage.style.setProperty('--mx', ((x - .5) * 2).toFixed(3));
    stage.style.setProperty('--my', ((y - .5) * 2).toFixed(3));
    const lensRect = bubbleLayer.getBoundingClientRect();
    bubbleLayer.style.setProperty('--glass-x', ((event.clientX - lensRect.left) / lensRect.width * 100).toFixed(1) + '%');
    bubbleLayer.style.setProperty('--glass-y', ((event.clientY - lensRect.top) / lensRect.height * 100).toFixed(1) + '%');
    stage.style.setProperty('--glass-x', ((event.clientX - lensRect.left) / lensRect.width * 100).toFixed(1) + '%');
    stage.style.setProperty('--glass-y', ((event.clientY - lensRect.top) / lensRect.height * 100).toFixed(1) + '%');
    if (!frame) frame = requestAnimationFrame(() => {
      const bubbles = bubbleLayer.querySelectorAll('.glass-bubble');
      bubbles.forEach((bubble, index) => {
        const rectB = bubble.getBoundingClientRect();
        const dx = event.clientX - (rectB.left + rectB.width / 2);
        const dy = event.clientY - (rectB.top + rectB.height / 2);
        if (Math.hypot(dx, dy) < 105) bubble.style.scale = '1.28';
        else bubble.style.scale = '';
      });
      frame = 0;
    });
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--mx', '0');
    stage.style.setProperty('--my', '0');
    bubbleLayer.querySelectorAll('.glass-bubble').forEach(bubble => bubble.style.scale = '');
  });
})();
