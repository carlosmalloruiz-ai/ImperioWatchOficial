// ================================================
// RED DE PUNTOS FLOTANTES — hero de la home
// Los puntos derivan despacio; el cursor actúa como un punto más:
// los atrae un poco y se une con los que tiene cerca.
// ================================================
(function(){
  const canvas = document.getElementById('particulas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- AJUSTES ----
  const COLOR       = '198,161,91';   // dorado de la marca (rgb)
  const COLOR_HOVER = '227,193,132';  // dorado claro para las uniones con el cursor
  const LINK_DIST   = 140;            // distancia máxima para unir dos puntos
  const MOUSE_DIST  = 190;            // radio de conexión con el cursor
  const SPEED       = 0.22;           // velocidad de deriva
  const PULL        = 0.018;          // fuerza con la que el cursor atrae
  const AREA_PER_DOT = 11000;         // px² por punto (menos = más puntos)
  const MAX_DOTS    = 110;

  let w = 0, h = 0, dots = [], raf = null, visible = true;
  const mouse = { x: 0, y: 0, active: false };

  function nuevoPunto(){
    return {
      x: Math.random() * w, y: Math.random() * h,
      bx: (Math.random() - 0.5) * SPEED * 2,
      by: (Math.random() - 0.5) * SPEED * 2,
      ex: 0, ey: 0,
      r: Math.random() * 1.2 + 0.8
    };
  }

  function medir(){
    const rect = canvas.getBoundingClientRect();
    if(!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = Math.min(MAX_DOTS, Math.round((w * h) / AREA_PER_DOT));
    while(dots.length < n) dots.push(nuevoPunto());
    dots.length = Math.min(dots.length, n);
    dots.forEach(p => { p.x = Math.min(p.x, w); p.y = Math.min(p.y, h); });
    dibujar();
  }

  function mover(){
    for(const p of dots){
      if(mouse.active){
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if(d < MOUSE_DIST && d > 1){
          const f = (1 - d / MOUSE_DIST) * PULL;
          p.ex += (dx / d) * f;
          p.ey += (dy / d) * f;
        }
      }
      p.ex *= 0.94; p.ey *= 0.94;
      p.x += p.bx + p.ex;
      p.y += p.by + p.ey;
      if(p.x < 0 || p.x > w){ p.bx *= -1; p.x = Math.max(0, Math.min(w, p.x)); }
      if(p.y < 0 || p.y > h){ p.by *= -1; p.y = Math.max(0, Math.min(h, p.y)); }
    }
  }

  function dibujar(){
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;

    for(let i = 0; i < dots.length; i++){
      const a = dots[i];

      // uniones entre puntos
      for(let j = i + 1; j < dots.length; j++){
        const b = dots[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if(d2 < LINK_DIST * LINK_DIST){
          const o = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22;
          ctx.strokeStyle = 'rgba(' + COLOR + ',' + o.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }

      // uniones con el cursor
      if(mouse.active){
        const dx = a.x - mouse.x, dy = a.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if(d2 < MOUSE_DIST * MOUSE_DIST){
          const o = (1 - Math.sqrt(d2) / MOUSE_DIST) * 0.7;
          ctx.strokeStyle = 'rgba(' + COLOR_HOVER + ',' + o.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(' + COLOR + ',0.65)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }

    if(mouse.active){
      ctx.fillStyle = 'rgba(' + COLOR_HOVER + ',0.9)';
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  function bucle(){
    mover();
    dibujar();
    raf = requestAnimationFrame(bucle);
  }
  function arrancar(){ if(!raf && visible && !document.hidden) raf = requestAnimationFrame(bucle); }
  function parar(){ if(raf){ cancelAnimationFrame(raf); raf = null; } }

  medir();
  new ResizeObserver(medir).observe(canvas);
  if(REDUCED) return;               // sin movimiento: se queda una imagen fija

  // El cursor se lee en toda la ventana (el canvas queda detrás del texto)
  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = mouse.x >= 0 && mouse.x <= w && mouse.y >= 0 && mouse.y <= h;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { mouse.active = false; });
  window.addEventListener('pointerup', (e) => { if(e.pointerType === 'touch') mouse.active = false; });

  // Se pausa cuando el hero no se ve o la pestaña está en segundo plano
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    visible ? arrancar() : parar();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => document.hidden ? parar() : arrancar());

  arrancar();
})();