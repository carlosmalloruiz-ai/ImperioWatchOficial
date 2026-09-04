// Menú móvil
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav.main-links');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
});

function formatPrecio(n){
  return n.toLocaleString('es-ES', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €';
}

function cardTemplate(p){
  return `
    <div class="card" data-tilt>
      <a class="thumb-link" href="producto.html?id=${p.id}">
        <div class="thumb"><img src="${p.imagen}" alt="${p.nombre}" loading="lazy"></div>
      </a>
      <div class="info">
        <span class="cat">${p.categoria}</span>
        <h3><a href="producto.html?id=${p.id}">${p.nombre}</a></h3>
        <span class="price">${formatPrecio(p.precio)}</span>
      </div>
    </div>
  `;
}

// ---------- DESTACADOS (home) ----------
function renderDestacados(){
  const grid = document.getElementById('grid-destacados');
  if(!grid) return;
  const categorias = getCategorias();
  const destacados = categorias.map(cat => PRODUCTOS.find(p => p.categoria === cat)).filter(Boolean);
  PRODUCTOS.forEach(p => {
    if(destacados.length < 4 && !destacados.includes(p)) destacados.push(p);
  });
  grid.innerHTML = destacados.slice(0, 4).map(cardTemplate).join('');
  initTiltAll();
}

// ---------- CATÁLOGO ----------
function renderCatalogo(){
  const grid = document.getElementById('grid-productos');
  const filtros = document.getElementById('filtros');
  if(!grid) return;

  const categorias = getCategorias();

  // Construir botones de filtro
  if(filtros){
    let html = `<button class="active" data-cat="todos">Todos</button>`;
    categorias.forEach(cat => {
      html += `<button data-cat="${cat}">${cat}</button>`;
    });
    filtros.innerHTML = html;

    filtros.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        filtros.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pintarProductos(btn.dataset.cat);
      });
    });
  }

  function pintarProductos(cat){
    const lista = cat === 'todos' ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === cat);
    grid.innerHTML = lista.map(cardTemplate).join('');
    initTiltAll();
  }

  pintarProductos('todos');
}

// ---------- FICHA DE PRODUCTO ----------
function renderProducto(){
  const cont = document.getElementById('producto-detalle');
  if(!cont) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const p = getProducto(id) || PRODUCTOS[0];

  document.title = p.nombre + ' — IMPERIOWATCH';

  cont.innerHTML = `
    <div class="gallery-main" data-tilt><img src="${p.imagen}" alt="${p.nombre}"></div>
    <div class="details">
      <a class="crumb" href="catalogo.html">Catálogo</a>
      <span class="cat">${p.categoria}</span>
      <h1>${p.nombre}</h1>
      <div class="price">${formatPrecio(p.precio)}</div>
      <p class="desc">${p.descripcion}</p>
      <div class="opt-row">
        <label>Opción</label>
        <div class="opt-pills">
          ${p.tallas.map((t,i) => `<span class="${i===0?'sel':''}">${t}</span>`).join('')}
        </div>
      </div>
      <div class="purchase-box">
        <div class="purchase-note"><span class="purchase-dot"></span> Pedido gestionado por Instagram · Pago contra reembolso</div>
        <a class="btn instagram-btn" id="btn-instagram-pedido" href="#">Comprar por Instagram <span>↗</span></a>
        <a class="btn outline" href="catalogo.html">← Volver al catálogo</a>
      </div>
    </div>
  `;

  initTiltAll();

  const instagramBtn = cont.querySelector('#btn-instagram-pedido');
  const getSelectedOption = () => cont.querySelector('.opt-pills .sel')?.textContent.trim() || p.tallas?.[0] || '';

  function actualizarInstagram(){
    if(!instagramBtn) return;
    const opcion = getSelectedOption();
    const params = new URLSearchParams({
      producto: p.id,
      opcion
    });
    instagramBtn.href = `pedido.html?${params.toString()}`;
  }

  cont.querySelectorAll('.opt-pills span').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.parentElement.querySelectorAll('span').forEach(s => s.classList.remove('sel'));
      pill.classList.add('sel');
      actualizarInstagram();
    });
  });
  actualizarInstagram();

  // JSON-LD estructurado para buscadores
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.nombre,
    "description": p.descripcion,
    "category": p.categoria,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": p.precio,
      "availability": "https://schema.org/InStock"
    }
  });
  document.head.appendChild(ld);
}

// ---------- PRELOADER / LOGO INTRO ----------
(function(){
  const pl = document.getElementById('preloader');
  if(!pl) return;
  const seen = sessionStorage.getItem('iw_intro_seen');
  if(seen){
    // Navegación interna: sin parpadeo de logo, solo se retira al instante.
    pl.classList.add('skip', 'hide');
  } else {
    pl.classList.add('full-intro');
    sessionStorage.setItem('iw_intro_seen', '1');
    window.addEventListener('load', () => setTimeout(() => pl.classList.add('hide'), 1650));
  }
})();

// ---------- PAGE TRANSITIONS ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || a.target === '_blank') return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = href; }, 300);
    });
  });
});

// ---------- TILT 3D (cards, imagen de producto, info-boxes) ----------
const TILT_ENABLED = window.matchMedia
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  && !window.matchMedia('(hover: none)').matches;

function attachTilt(el){
  if(!TILT_ENABLED || el.dataset.tiltReady) return;
  el.dataset.tiltReady = '1';
  const strength = el.classList.contains('card') ? 9 : 6;

  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * strength * 2;
    const ry = (px - 0.5) * strength * 2.2;
    el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    el.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    el.classList.add('tilting');
  });

  el.addEventListener('pointerleave', () => {
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('tilting');
  });
}

function initTiltAll(){
  document.querySelectorAll('[data-tilt]').forEach(attachTilt);
}

// ---------- SCROLL REVEAL ----------
function initReveal(){
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if(!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  targets.forEach(t => io.observe(t));
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalogo();
  renderProducto();
  renderDestacados();
  initReveal();
  initTiltAll();
});
