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

/* Rotatable camera lens and live aperture iris */
(() => {
  const stage = document.getElementById('lensStage');
  const lens = stage?.querySelector('.camera-lens');
  const aperture = stage?.querySelector('.lens-aperture');
  const range = document.getElementById('apertureRange');
  const apertureValue = document.getElementById('apertureValue');
  const rotationReadout = document.getElementById('rotationReadout');
  const left = document.getElementById('rotateLeft');
  const right = document.getElementById('rotateRight');
  const reset = document.getElementById('resetLens');
  if (!stage || !lens || !aperture || !range) return;

  let rotation = 0;
  let dragging = false;
  let startAngle = 0;
  let startRotation = 0;
  let activePointer = null;

  const paintRotation = () => {
    lens.style.setProperty('--lens-rotation', rotation + 'deg');
    lens.style.rotate = rotation + 'deg';
    rotationReadout.textContent = 'ROT ' + String(((Math.round(rotation) % 360) + 360) % 360).padStart(3, '0') + '°';
  };
  const setRotation = value => {
    rotation = value;
    paintRotation();
  };
  const getAngle = event => {
    const rect = lens.getBoundingClientRect();
    return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI;
  };

  lens.addEventListener('pointerdown', event => {
    if (event.target.closest('.lens-controls')) return;
    dragging = true;
    activePointer = event.pointerId;
    startAngle = getAngle(event);
    startRotation = rotation;
    lens.classList.add('is-dragging');
    lens.setPointerCapture?.(event.pointerId);
  });
  lens.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== activePointer) return;
    const next = startRotation + getAngle(event) - startAngle;
    setRotation(next);
  });
  const endDrag = event => {
    if (event.pointerId !== activePointer) return;
    dragging = false;
    activePointer = null;
    lens.classList.remove('is-dragging');
  };
  lens.addEventListener('pointerup', endDrag);
  lens.addEventListener('pointercancel', endDrag);
  left?.addEventListener('click', () => setRotation(rotation - 15));
  right?.addEventListener('click', () => setRotation(rotation + 15));
  reset?.addEventListener('click', () => {
    setRotation(0);
    range.value = '14';
    updateAperture();
  });

  function updateAperture() {
    const f = Number(range.value) / 10;
    const open = 44 - ((f - 1.4) / (16 - 1.4)) * 31;
    aperture.style.setProperty('--aperture-open', open.toFixed(1) + '%');
    aperture.style.opacity = String(0.96 - ((f - 1.4) / (16 - 1.4)) * 0.2);
    apertureValue.textContent = 'F/' + f.toFixed(1);
    stage.style.setProperty('--aperture-brightness', (1.16 - ((f - 1.4) / (16 - 1.4)) * 0.48).toFixed(2));
    stage.style.setProperty('--aperture-blur', (((f - 1.4) / (16 - 1.4)) * 2.5).toFixed(2) + 'px');
  }
  range.addEventListener('input', updateAperture);
  updateAperture();
  paintRotation();
})();

/* Cinematic section reveals and keyboard controls, with reduced-motion support */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.section-head, .work-card, .about-grid, .service, .contact');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealTargets.forEach(target => observer.observe(target));
  }
  const lens = document.querySelector('.camera-lens');
  if (lens) {
    lens.addEventListener('keydown', event => {
      if (event.target !== lens) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        document.getElementById(event.key === 'ArrowLeft' ? 'rotateLeft' : 'rotateRight')?.click();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        document.getElementById('resetLens')?.click();
      }
    });
  }
})();
