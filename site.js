// ---------- MENÚ MÓVIL: sheet con física de muelle, interrumpible ----------
// Sigue los principios de "Designing Fluid Interfaces" (WWDC 2018): la animación
// nace del valor actual en pantalla (nunca del destino), puede agarrarse y
// revertirse en cualquier instante, y respeta prefers-reduced-motion con un
// cross-fade en vez de deslizamiento con muelle.
(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let motionLib = null;
  const getMotion = () => {
    if (REDUCED) return Promise.resolve(null);
    if (motionLib) return motionLib;
    motionLib =
      import("https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm").catch(
        () => null,
      );
    return motionLib;
  };

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("nav.main-links");
    if (!toggle || !nav) return;

    let open = false;
    let animating = null; // controla la animación en curso para poder interrumpirla

    async function setOpen(next) {
      open = next;
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));

      if (open) nav.classList.add("open"); // visible desde ya para poder animar

      const motion = await getMotion();

      if (!motion) {
        // Sin muelle disponible (reduced-motion u offline): cross-fade simple, sin overshoot
        nav.style.transition = "opacity .18s ease";
        nav.style.opacity = open ? "1" : "0";
        nav.style.transform = "none";
        if (!open)
          setTimeout(() => {
            if (!open) nav.classList.remove("open");
          }, 180);
        return;
      }

      try {
        const { animate } = motion;
        // Anima siempre desde el valor de presentación actual: si el usuario
        // vuelve a tocar el botón a mitad de la animación, no hay salto.
        if (animating) animating.stop();
        animating = animate(
          nav,
          open
            ? { opacity: [null, 1], y: [null, "0%"] }
            : { opacity: [null, 0], y: [null, "3%"] },
          {
            type: "spring",
            bounce: open ? 0.16 : 0,
            duration: open ? 0.5 : 0.32,
          },
        );
        if (!open)
          animating.finished
            .then(() => {
              if (!open) nav.classList.remove("open");
            })
            .catch(() => {});
      } catch (err) {
        nav.style.opacity = open ? "1" : "0";
        if (!open) nav.classList.remove("open");
      }
    }

    toggle.addEventListener("click", () => setOpen(!open));

    // Tocar un enlace o pulsar Escape cierra la sheet igual que en iOS
    nav
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    });
  });
})();

function formatPrecio(n) {
  return (
    n.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

function cardTemplate(p) {
  const agotado = estaAgotado(p);
  return `
    <div class="card${agotado ? " agotado" : ""}" data-tilt>
      <a class="thumb-link" href="producto.html?id=${p.id}" aria-label="${p.nombre}${agotado ? " (agotado)" : ""}">
        <div class="thumb">
          <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
          ${agotado ? '<span class="estado-badge">Agotado</span>' : ""}
        </div>
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
function renderDestacados() {
  const grid = document.getElementById("grid-destacados");
  if (!grid) return;
  const categorias = getCategorias();
  const destacados = categorias
    .map((cat) => PRODUCTOS.find((p) => p.categoria === cat))
    .filter(Boolean);
  PRODUCTOS.forEach((p) => {
    if (destacados.length < 4 && !destacados.includes(p)) destacados.push(p);
  });
  grid.innerHTML = destacados.slice(0, 4).map(cardTemplate).join("");
  initTiltAll();
}

// ---------- CATÁLOGO: búsqueda, categoría, orden y disponibilidad ----------
// El estado vive en la URL (?q=&cat=&orden=&disp=1): se puede compartir una búsqueda
// y al volver atrás desde una ficha el catálogo reaparece como se dejó.
function renderCatalogo() {
  const grid = document.getElementById("grid-productos");
  const filtros = document.getElementById("filtros");
  if (!grid) return;

  const buscar = document.getElementById("buscar");
  const orden = document.getElementById("orden");
  const soloDisp = document.getElementById("solo-disp");
  const resultados = document.getElementById("resultados");
  const categorias = getCategorias();

  // sin acentos y en minúsculas: "reloj" encuentra "Reloj", "cadena" encuentra "Cadena"
  const norm = (t) =>
    String(t || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const indice = new Map(
    PRODUCTOS.map((p) => [
      p.id,
      norm(
        [p.nombre, p.categoria, p.descripcion, (p.tallas || []).join(" ")].join(
          " ",
        ),
      ),
    ]),
  );

  const qs = new URLSearchParams(window.location.search);
  const estado = {
    cat: categorias.includes(qs.get("cat")) ? qs.get("cat") : "todos",
    q: qs.get("q") || "",
    orden: ["precio-asc", "precio-desc"].includes(qs.get("orden"))
      ? qs.get("orden")
      : "relevancia",
    disp: qs.get("disp") === "1",
  };

  function filtrar() {
    const tokens = norm(estado.q).split(/\s+/).filter(Boolean);
    let lista = PRODUCTOS.filter(
      (p) =>
        (estado.cat === "todos" || p.categoria === estado.cat) &&
        (!estado.disp || !estaAgotado(p)) &&
        tokens.every((t) => indice.get(p.id).includes(t)),
    );
    if (estado.orden === "precio-asc")
      lista = lista.slice().sort((a, b) => a.precio - b.precio);
    if (estado.orden === "precio-desc")
      lista = lista.slice().sort((a, b) => b.precio - a.precio);
    return lista;
  }

  function guardarEnUrl() {
    const p = new URLSearchParams();
    if (estado.cat !== "todos") p.set("cat", estado.cat);
    if (estado.q.trim()) p.set("q", estado.q.trim());
    if (estado.orden !== "relevancia") p.set("orden", estado.orden);
    if (estado.disp) p.set("disp", "1");
    const str = p.toString();
    try {
      history.replaceState(
        null,
        "",
        window.location.pathname + (str ? "?" + str : ""),
      );
    } catch (e) {}
  }

  function sincronizarControles() {
    if (buscar) buscar.value = estado.q;
    if (orden) orden.value = estado.orden;
    if (soloDisp) {
      soloDisp.setAttribute("aria-pressed", String(estado.disp));
    }
    if (filtros)
      filtros
        .querySelectorAll("button")
        .forEach((b) =>
          b.classList.toggle("active", b.dataset.cat === estado.cat),
        );
  }

  // animar=false al teclear u ordenar: que las tarjetas no parpadeen en cada pulsación
  function pintar(animar) {
    const lista = filtrar();
    grid.classList.toggle("sin-anim", !animar);
    if (lista.length) {
      grid.innerHTML = lista.map(cardTemplate).join("");
    } else {
      grid.innerHTML =
        '<div class="vacio"><p>No hemos encontrado piezas con esos filtros.</p>' +
        '<button type="button" class="btn outline" id="limpiar-filtros">Quitar filtros</button></div>';
      grid.querySelector("#limpiar-filtros").addEventListener("click", () => {
        estado.cat = "todos";
        estado.q = "";
        estado.orden = "relevancia";
        estado.disp = false;
        sincronizarControles();
        pintar(true);
      });
    }
    if (resultados)
      resultados.textContent =
        lista.length === 1 ? "1 pieza" : lista.length + " piezas";
    guardarEnUrl();
    initTiltAll();
  }

  if (filtros) {
    let html = '<button data-cat="todos">Todos</button>';
    categorias.forEach((cat) => {
      html += '<button data-cat="' + cat + '">' + cat + "</button>";
    });
    filtros.innerHTML = html;
    filtros.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        estado.cat = btn.dataset.cat;
        sincronizarControles();
        pintar(true);
      });
    });
  }

  if (buscar) {
    let t;
    buscar.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        estado.q = buscar.value;
        pintar(false);
      }, 120);
    });
    // "Buscar" en el teclado móvil: cierra el teclado para ver los resultados
    buscar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        buscar.blur();
      }
    });
  }
  if (orden)
    orden.addEventListener("change", () => {
      estado.orden = orden.value;
      pintar(false);
    });
  if (soloDisp)
    soloDisp.addEventListener("click", () => {
      estado.disp = !estado.disp;
      sincronizarControles();
      pintar(false);
    });

  sincronizarControles();
  pintar(true);
}

// ---------- FICHA DE PRODUCTO ----------
function renderProducto() {
  const cont = document.getElementById("producto-detalle");
  if (!cont) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const p = getProducto(id) || PRODUCTOS[0];

  document.title = p.nombre + " — IMPERIOWATCH";
  const agotado = estaAgotado(p);

  cont.innerHTML = `
    <div class="gallery-main" data-tilt><img src="${p.imagen}" alt="${p.nombre}"></div>
    <div class="details">
      <a class="crumb" href="catalogo.html">Catálogo</a>
      <span class="cat">${p.categoria}</span>
      <h1>${p.nombre}</h1>
      <div class="price">${formatPrecio(p.precio)}${agotado ? ' <span class="estado-badge inline">Agotado</span>' : ""}</div>
      <p class="desc">${p.descripcion}</p>
      <div class="opt-row">
        <label>Opción</label>
        <div class="opt-pills">
          ${p.tallas.map((t, i) => `<span class="${i === 0 ? "sel" : ""}">${t}</span>`).join("")}
        </div>
      </div>
      <div class="purchase-box">
        ${
          agotado
            ? `
          <div class="purchase-note agotado"><span class="purchase-dot"></span> Este producto está agotado por ahora</div>
          <button class="btn instagram-btn" type="button" disabled aria-disabled="true">Agotado</button>
        `
            : `
          <div class="purchase-note"><span class="purchase-dot"></span> Pedido gestionado por Instagram · Pago contra reembolso</div>
          <a class="btn instagram-btn" id="btn-instagram-pedido" href="#">Comprar por Instagram <span>↗</span></a>
        `
        }
        <div class="btn-row">
          <button class="btn outline" type="button" id="btn-compartir" aria-live="polite"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 12.5V3M6.5 6.5L10 3l3.5 3.5M4.5 10v6h11v-6"/></svg>Compartir</button>
          <a class="btn outline" href="catalogo.html">← Catálogo</a>
        </div>
      </div>
    </div>
  `;

  initTiltAll();

  const instagramBtn = cont.querySelector("#btn-instagram-pedido");
  const getSelectedOption = () =>
    cont.querySelector(".opt-pills .sel")?.textContent.trim() ||
    p.tallas?.[0] ||
    "";

  function actualizarInstagram() {
    if (!instagramBtn) return;
    const opcion = getSelectedOption();
    const params = new URLSearchParams({
      producto: p.id,
      opcion,
    });
    instagramBtn.href = `pedido.html?${params.toString()}`;
  }

  cont.querySelectorAll(".opt-pills span").forEach((pill) => {
    pill.addEventListener("click", () => {
      pill.parentElement
        .querySelectorAll("span")
        .forEach((s) => s.classList.remove("sel"));
      pill.classList.add("sel");
      actualizarInstagram();
    });
  });
  actualizarInstagram();

  // ---- Compartir: hoja nativa del móvil (Instagram, WhatsApp…) o copiar enlace ----
  const shareBtn = cont.querySelector("#btn-compartir");
  if (shareBtn) {
    const etiquetaOriginal = shareBtn.innerHTML;
    const urlFicha = new URL(
      "producto.html?id=" + encodeURIComponent(p.id),
      window.location.href,
    ).href;
    const avisar = (texto) => {
      shareBtn.textContent = texto;
      setTimeout(() => {
        shareBtn.innerHTML = etiquetaOriginal;
      }, 2200);
    };
    const copiarEnlace = async () => {
      try {
        await navigator.clipboard.writeText(urlFicha);
        return avisar("Enlace copiado ✓");
      } catch (e) {}
      try {
        // respaldo para navegadores sin Clipboard API
        const ta = document.createElement("textarea");
        ta.value = urlFicha;
        ta.setAttribute("readonly", "");
        ta.style.cssText =
          "position:fixed;top:0;left:0;opacity:0;font-size:16px;";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        avisar(ok ? "Enlace copiado ✓" : "No se pudo copiar");
      } catch (e) {
        avisar("No se pudo copiar");
      }
    };
    shareBtn.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: p.nombre + " — IMPERIOWATCH",
            text: p.nombre + " · " + formatPrecio(p.precio),
            url: urlFicha,
          });
        } catch (err) {
          if (!err || err.name !== "AbortError") copiarEnlace(); // cancelar la hoja no es un error
        }
        return;
      }
      copiarEnlace();
    });
  }

  // JSON-LD estructurado para buscadores
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.descripcion,
    category: p.categoria,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: p.precio,
      availability: agotado
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  });
  document.head.appendChild(ld);
}

// ---------- PRELOADER / LOGO INTRO ----------
(function () {
  const pl = document.getElementById("preloader");
  if (!pl) return;
  const seen = sessionStorage.getItem("iw_intro_seen");
  if (seen) {
    // Navegación interna: sin parpadeo de logo, solo se retira al instante.
    pl.classList.add("skip", "hide");
  } else {
    pl.classList.add("full-intro");
    sessionStorage.setItem("iw_intro_seen", "1");
    const INTRO_MIN = 3000; // ms mínimos de intro, contados desde que empieza la carga
    window.addEventListener("load", () =>
      setTimeout(
        () => pl.classList.add("hide"),
        Math.max(300, INTRO_MIN - performance.now()),
      ),
    );
  }
})();

// ---------- PAGE TRANSITIONS ----------
// Al volver atrás, iOS/Android restauran la página desde la caché de navegación con
// la clase page-leaving aún puesta (opacity 0): pantalla en negro. Se limpia al mostrarla.
window.addEventListener("pageshow", () =>
  document.body.classList.remove("page-leaving"),
);

document.addEventListener("DOMContentLoaded", () => {
  // En táctil se navega al instante: el fade de salida de 300ms se nota como lag, no como estilo.
  const SIN_FADE = window.matchMedia("(hover: none)").matches;
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      a.target === "_blank"
    )
      return;
    a.addEventListener("click", (e) => {
      if (SIN_FADE) return;
      e.preventDefault();
      document.body.classList.add("page-leaving");
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
});

// ---------- TILT 3D (cards, imagen de producto, info-boxes) ----------
const TILT_ENABLED =
  window.matchMedia &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  !window.matchMedia("(hover: none)").matches;

function attachTilt(el) {
  if (!TILT_ENABLED || el.dataset.tiltReady) return;
  el.dataset.tiltReady = "1";
  const strength = el.classList.contains("card") ? 9 : 6;

  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * strength * 2;
    const ry = (px - 0.5) * strength * 2.2;
    el.style.setProperty("--rx", rx.toFixed(2) + "deg");
    el.style.setProperty("--ry", ry.toFixed(2) + "deg");
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    el.classList.add("tilting");
  });

  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.classList.remove("tilting");
  });
}

function initTiltAll() {
  document.querySelectorAll("[data-tilt]").forEach(attachTilt);
}

// ---------- SCROLL REVEAL ----------
function initReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!targets.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  targets.forEach((t) => io.observe(t));
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();
  renderProducto();
  renderDestacados();
  initReveal();
  initTiltAll();
});
