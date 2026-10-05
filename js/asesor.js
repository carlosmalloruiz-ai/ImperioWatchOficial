// ================================================
// ASESOR IMPERIOWATCH
// 1) Asesor guiado: preguntas con botones, sin IA, sin enviar datos a nadie.
// 2) Chat libre con IA (opcional): usa el Worker de Cloudflare. Si no está
//    configurado, falla o se agota la cuota diaria, la web sigue funcionando
//    con el asesor guiado.
// Se carga con UNA sola línea en cada página:  <script src="js/asesor.js" defer></script>
// ================================================
(function(){
  'use strict';
  if(window.__iwAsesor) return;
  window.__iwAsesor = true;

  // ---- CONFIGURACIÓN ----
  const CONFIG = {
    ENDPOINT: 'https://imperiowatch-asesor.imperiowatch-asesor.workers.dev',
    POLITICA_URL: '',        // enlace a tu política de privacidad (si ya existe esa página)
    INSTAGRAM_URL: 'https://www.instagram.com/imperiowatchesp/',
    MAX_MENSAJES_USUARIO: 12,
    ESPERA_MIN_MS: 1500,
    MAX_CARACTERES: 300,
    TIEMPO_MAX_MS: 25000
  };

  const CLAVE = 'iw_asesor_v1';
  const BASE = (document.currentScript && document.currentScript.src)
    ? document.currentScript.src.replace(/[^/]*$/, '') : 'js/';
  const REDUCIDO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- carga de dependencias (por si la página no las incluye) ----------
  function cargar(nombre){
    return new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = BASE + nombre; s.onload = ok; s.onerror = () => ko(new Error(nombre));
      document.head.appendChild(s);
    });
  }
  async function iniciar(){
    try{
      if(typeof PRODUCTOS === 'undefined') await cargar('productos.js');
      if(typeof ASESOR_TAGS === 'undefined') await cargar('asesor-datos.js');
    }catch(e){ return; }
    montar();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  // ---------- datos ----------
  const agotado = (p) => p.estado === 'agotado';
  const tagsDe = (p) => (typeof ASESOR_TAGS !== 'undefined' && ASESOR_TAGS[p.id]) || {};
  const porId = (id) => PRODUCTOS.find(p => p.id === id);
  const precioTxt = (n) => Number(n).toFixed(2).replace('.', ',') + ' €';
  const disponible = (p) => !!p && !agotado(p);

  const ETIQ = {
    estilo: { elegante: 'elegante', deportivo: 'deportivo', llamativo: 'llamativo', discreto: 'discreto' },
    color:  { dorado: 'dorado', plateado: 'plateado', negro: 'negro', azul: 'azul', blanco: 'blanco', colorido: 'colores vivos', verde: 'verde' }
  };

  const PREGUNTAS = {
    tipo: { texto: '¿Qué te gustaría ver?', ops: [['reloj', 'Un reloj'], ['pack', 'Pack cinturón y cartera']] },
    estilo: { texto: '¿Qué estilo va más contigo?', ops: [['elegante', 'Elegante y clásico'], ['deportivo', 'Deportivo'], ['llamativo', 'Llamativo, que se note'], ['discreto', 'Discreto'], ['cualquiera', 'Me da igual']] },
    color: { texto: '¿Qué tono prefieres?', ops: [['dorado', 'Dorado'], ['plateado', 'Plateado'], ['negro', 'Negro'], ['azul', 'Azul'], ['blanco', 'Blanco'], ['colorido', 'Colores vivos'], ['cualquiera', 'Me da igual']] },
    color_pack: { texto: '¿Qué tono prefieres?', ops: [['dorado', 'Dorado'], ['plateado', 'Plateado'], ['negro', 'Negro'], ['verde', 'Verde'], ['cualquiera', 'Me da igual']] },
    presupuesto: { texto: '¿Hasta cuánto quieres gastar?', ops: [['50', 'Hasta 50 €'], ['60', 'Hasta 60 €']] }
  };
  const RUTAS = { reloj: ['estilo', 'color', 'presupuesto'], pack: ['color_pack'] };

  // ---------- recomendación ----------
  function intercalarPorMarca(lista){
    const grupos = new Map();
    lista.forEach(x => { const m = tagsDe(x.p).marca || '?'; if(!grupos.has(m)) grupos.set(m, []); grupos.get(m).push(x); });
    const cols = [...grupos.values()]; const salida = [];
    for(let i = 0; salida.length < lista.length; i++) cols.forEach(c => { if(c[i]) salida.push(c[i]); });
    return salida;
  }

  function recomendar(r){
    const tipo = r.tipo === 'pack' ? 'pack' : 'reloj';
    const maximo = r.presupuesto ? parseFloat(r.presupuesto) : Infinity;
    const color = r.color || r.color_pack;
    const quiereEstilo = r.estilo && r.estilo !== 'cualquiera';
    const quiereColor = color && color !== 'cualquiera';

    let lista = PRODUCTOS
      .filter(p => disponible(p) && tagsDe(p).tipo === tipo && p.precio <= maximo + 0.001)
      .map(p => {
        const t = tagsDe(p); let s = 0; const motivos = [];
        if(quiereEstilo && (t.estilo || []).includes(r.estilo)){ s += 3; motivos.push('estilo ' + ETIQ.estilo[r.estilo]); }
        if(quiereColor && (t.color || []).includes(color)){ s += 4; motivos.push('tono ' + ETIQ.color[color]); }
        return { p, s, motivos };
      })
      .sort((a, b) => (b.s - a.s) || (PRODUCTOS.indexOf(a.p) - PRODUCTOS.indexOf(b.p)));

    const maxPosible = (quiereEstilo ? 3 : 0) + (quiereColor ? 4 : 0);
    const mejor = lista.length ? lista[0].s : 0;
    if(maxPosible > 0 && mejor > 0) lista = lista.filter(x => x.s > 0);   // solo lo que encaja, aunque sea en parte
    else lista = intercalarPorMarca(lista);                               // sin preferencias: variedad de marcas
    return { lista, aproximado: maxPosible > 0 && mejor < maxPosible };
  }

  function similares(p){
    const t = tagsDe(p);
    return PRODUCTOS
      .filter(q => q.id !== p.id && disponible(q) && tagsDe(q).tipo === t.tipo)
      .map(q => {
        const u = tagsDe(q); const motivos = []; let s = 0;
        const e = (u.estilo || []).filter(x => (t.estilo || []).includes(x));
        const c = (u.color || []).filter(x => (t.color || []).includes(x));
        if(e.length){ s += 2 * e.length; motivos.push('estilo ' + ETIQ.estilo[e[0]]); }
        if(c.length){ s += 2 * c.length; motivos.push('tono ' + ETIQ.color[c[0]]); }
        if(u.marca && u.marca === t.marca){ s += 1; motivos.push('misma línea'); }
        return { p: q, s, motivos };
      })
      .filter(x => x.s > 0)
      .sort((a, b) => (b.s - a.s) || (PRODUCTOS.indexOf(a.p) - PRODUCTOS.indexOf(b.p)));
  }

  // ---------- estado (se guarda mientras dure la pestaña) ----------
  let S = leer() || nuevoEstado();
  function nuevoEstado(){ return { msgs: [], r: {}, ruta: [], i: 0, pagina: 0, usuario: 0 }; }
  function leer(){ try{ const j = JSON.parse(sessionStorage.getItem(CLAVE)); return j && Array.isArray(j.msgs) ? j : null; }catch(e){ return null; } }
  function guardar(){ try{ S.msgs = S.msgs.slice(-40); sessionStorage.setItem(CLAVE, JSON.stringify(S)); }catch(e){} }

  // ---------- interfaz ----------
  let raiz, fab, panel, lista, form, campo, enviar, punto, abierto = false, ocupado = false, ultimoEnvio = 0;

  function el(tag, cls, texto){
    const n = document.createElement(tag);
    if(cls) n.className = cls;
    if(texto != null) n.textContent = texto;
    return n;
  }

  function montar(){
    if(document.getElementById('asesor-root')) return;
    raiz = el('div'); raiz.id = 'asesor-root'; raiz.className = 'asesor';

    fab = el('button', 'asesor-fab'); fab.type = 'button';
    fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'asesor-panel');
    fab.append(el('span', 'asesor-fab-glifo', '◆'), el('span', 'asesor-fab-texto', 'Asesor'));
    punto = el('span', 'asesor-fab-punto'); punto.hidden = true; fab.appendChild(punto);

    panel = el('section', 'asesor-panel'); panel.id = 'asesor-panel';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Asesor de IMPERIOWATCH'); panel.hidden = true;

    const cab = el('header', 'asesor-head');
    const titulos = el('div', 'asesor-titulos');
    titulos.append(el('strong', null, 'Asesor IMPERIOWATCH'), el('span', null, 'Asistente automático'));
    const acciones = el('div', 'asesor-acciones');
    const btnReiniciar = el('button', 'asesor-icono', '↺'); btnReiniciar.type = 'button';
    btnReiniciar.setAttribute('aria-label', 'Empezar de nuevo'); btnReiniciar.title = 'Empezar de nuevo';
    const btnCerrar = el('button', 'asesor-icono', '✕'); btnCerrar.type = 'button';
    btnCerrar.setAttribute('aria-label', 'Cerrar el asesor'); btnCerrar.title = 'Cerrar';
    acciones.append(btnReiniciar, btnCerrar);
    cab.append(titulos, acciones);

    lista = el('div', 'asesor-msgs'); lista.setAttribute('role', 'log'); lista.setAttribute('aria-live', 'polite');

    panel.append(cab, lista);

    if(CONFIG.ENDPOINT){
      form = el('form', 'asesor-form'); form.autocomplete = 'off';
      campo = el('input', 'asesor-campo'); campo.type = 'text'; campo.maxLength = CONFIG.MAX_CARACTERES;
      campo.placeholder = 'O escribe tu duda…'; campo.setAttribute('aria-label', 'Escribe tu duda');
      enviar = el('button', 'asesor-enviar', 'Enviar'); enviar.type = 'submit';
      form.append(campo, enviar);
      const aviso = el('p', 'asesor-aviso');
      aviso.append('Asistente automático con IA. No escribas datos personales. Los mensajes que escribas aquí se procesan en Cloudflare para responderte. ');
      if(CONFIG.POLITICA_URL){ const a = el('a', null, 'Política de privacidad'); a.href = CONFIG.POLITICA_URL; aviso.appendChild(a); }
      panel.append(form, aviso);
      form.addEventListener('submit', (e) => { e.preventDefault(); const t = campo.value.trim(); if(t){ campo.value = ''; enviarChat(t); } });
    }

    raiz.append(panel, fab);
    document.body.appendChild(raiz);

    fab.addEventListener('click', () => alternar());
    btnCerrar.addEventListener('click', () => alternar(false));
    btnReiniciar.addEventListener('click', () => { if(!ocupado) reiniciar(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && abierto) alternar(false); });

    if(!S.msgs.length) bienvenida();
    else punto.hidden = false;       // hay una conversación guardada
    pintar();
  }

  function alternar(forzar){
    abierto = typeof forzar === 'boolean' ? forzar : !abierto;
    panel.hidden = !abierto;
    fab.setAttribute('aria-expanded', String(abierto));
    raiz.classList.toggle('abierto', abierto);
    if(abierto){
      punto.hidden = true;
      pintar();
      const objetivo = (campo && !campo.disabled) ? campo : lista.querySelector('.asesor-chip');
      if(objetivo && !(window.matchMedia && window.matchMedia('(max-width: 640px)').matches && objetivo === campo)) objetivo.focus({ preventScroll: true });
    }else{
      fab.focus({ preventScroll: true });
    }
  }

  // ---------- mensajes ----------
  function botDice(texto, extra){ S.msgs.push(Object.assign({ r: 'bot', t: texto }, extra || {})); guardar(); }
  function usuarioDice(texto, chat){ S.msgs.push({ r: 'user', t: texto, c: chat ? 1 : 0 }); guardar(); }

  function tarjeta(item){
    const p = porId(item.id);
    if(!disponible(p)) return null;
    const a = el('a', 'asesor-card'); a.href = 'producto.html?id=' + encodeURIComponent(p.id);
    const img = el('img'); img.src = p.imagen; img.alt = p.nombre; img.loading = 'lazy';
    const info = el('div', 'asesor-card-info');
    info.append(el('b', null, p.nombre), el('span', 'asesor-card-precio', precioTxt(p.precio)));
    if(item.m) info.appendChild(el('small', null, 'Encaja por: ' + item.m));
    a.append(img, info);
    return a;
  }

  function pintar(){
    if(!lista) return;
    lista.textContent = '';
    const ultimo = S.msgs.length - 1;
    S.msgs.forEach((m, i) => {
      const fila = el('div', 'asesor-fila ' + (m.r === 'bot' ? 'bot' : 'user'));
      if(i === ultimo && !REDUCIDO) fila.classList.add('nuevo');
      fila.appendChild(el('div', 'asesor-burbuja', m.t));
      if(m.cards && m.cards.length){
        const cont = el('div', 'asesor-cards');
        m.cards.forEach(c => { const t = tarjeta(c); if(t) cont.appendChild(t); });
        if(cont.children.length) fila.appendChild(cont);
      }
      if(m.ops && i === ultimo && !ocupado){
        const chips = el('div', 'asesor-chips');
        m.ops.forEach(([id, etiqueta]) => {
          const b = el('button', 'asesor-chip', etiqueta); b.type = 'button';
          b.addEventListener('click', () => elegir(m.k, id, etiqueta));
          chips.appendChild(b);
        });
        fila.appendChild(chips);
      }
      lista.appendChild(fila);
    });
    if(ocupado){
      const f = el('div', 'asesor-fila bot'); const b = el('div', 'asesor-burbuja escribiendo');
      b.setAttribute('aria-label', 'El asesor está escribiendo');
      b.append(el('i'), el('i'), el('i')); f.appendChild(b); lista.appendChild(f);
    }
    if(campo){ campo.disabled = ocupado; enviar.disabled = ocupado; }
    lista.scrollTo ? lista.scrollTo({ top: lista.scrollHeight, behavior: REDUCIDO ? 'auto' : 'smooth' }) : (lista.scrollTop = lista.scrollHeight);
  }

  // ---------- flujo guiado ----------
  function paginaActual(){
    const id = new URLSearchParams(location.search).get('id');
    return /producto(\.html)?\/?$/.test(location.pathname) && id ? porId(id) : null;
  }

  function bienvenida(){
    const base = 'Hola, soy el asistente automático de IMPERIOWATCH. Te ayudo a elegir en menos de un minuto.';
    const p = paginaActual();
    if(p && disponible(p) && similares(p).length){
      botDice(base + ' Veo que estás mirando "' + p.nombre + '". ¿Quieres ver alternativas parecidas o prefieres que te guíe desde cero?',
        { k: 'inicio', ops: [['similares', 'Ver parecidos a este'], ['guia', 'Guíame desde cero']] });
    }else{
      botDice(base + ' ' + PREGUNTAS.tipo.texto, { k: 'tipo', ops: PREGUNTAS.tipo.ops });
    }
  }

  function reiniciar(){
    S = nuevoEstado(); guardar();
    botDice('Empezamos de nuevo. ' + PREGUNTAS.tipo.texto, { k: 'tipo', ops: PREGUNTAS.tipo.ops });
    pintar();
  }

  function preguntar(clave){
    botDice(PREGUNTAS[clave].texto, { k: clave, ops: PREGUNTAS[clave].ops });
  }

  function elegir(clave, valor, etiqueta){
    if(ocupado) return;
    if(valor === 'instagram'){ window.open(CONFIG.INSTAGRAM_URL, '_blank', 'noopener'); return; }
    usuarioDice(etiqueta);

    if(clave === 'inicio'){
      if(valor === 'similares'){ mostrarSimilares(); }
      else{ preguntar('tipo'); }
    }
    else if(clave === 'final'){
      if(valor === 'mas') mostrarResultados(true);
      else if(valor === 'reiniciar'){ S = nuevoEstado(); preguntar('tipo'); }
      else if(valor === 'similares') mostrarSimilares();
    }
    else if(clave === 'tipo'){
      S.r = { tipo: valor }; S.ruta = RUTAS[valor]; S.i = 0; S.pagina = 0;
      preguntar(S.ruta[0]);
    }
    else{
      S.r[clave] = valor; S.i += 1;
      if(S.i < S.ruta.length) preguntar(S.ruta[S.i]);
      else{ S.pagina = 0; mostrarResultados(false); }
    }
    guardar(); pintar();
  }

  function opcionesFinal(hayMas){
    const ops = [];
    if(hayMas) ops.push(['mas', 'Ver otras opciones']);
    ops.push(['reiniciar', 'Empezar de nuevo']);
    ops.push(['instagram', 'Hablar por Instagram']);
    return ops;
  }

  function mostrarResultados(siguiente){
    const { lista: todos, aproximado } = recomendar(S.r);
    if(!todos.length){
      botDice('Ahora mismo no tengo piezas disponibles que encajen con eso. Puedes empezar de nuevo con otros gustos o escribirnos por Instagram.',
        { k: 'final', ops: opcionesFinal(false) });
      return;
    }
    if(siguiente) S.pagina += 1;
    const inicio = S.pagina * 3;
    const trozo = todos.slice(inicio, inicio + 3);
    if(!trozo.length){
      S.pagina = 0;
      botDice('Esas eran todas las opciones disponibles. Puedes empezar de nuevo o preguntarnos por Instagram.', { k: 'final', ops: opcionesFinal(false) });
      return;
    }
    let intro = siguiente ? 'Aquí tienes otras opciones:' : (S.pagina === 0 ? 'Estas son mis recomendaciones para ti:' : 'Estas son mis recomendaciones:');
    if(aproximado && !siguiente) intro = 'No hay ninguno que cumpla todo lo que buscas, pero estos son los que más se acercan:';
    botDice(intro, { cards: trozo.map(x => ({ id: x.p.id, m: x.motivos.join(' y ') })) });
    botDice('¿Quieres afinar o ver más?', { k: 'final', ops: opcionesFinal(inicio + 3 < todos.length) });
  }

  function mostrarSimilares(){
    const p = paginaActual();
    const lista = p ? similares(p).slice(0, 3) : [];
    if(!lista.length){ preguntar('tipo'); return; }
    botDice('Estos se parecen a "' + p.nombre + '":', { cards: lista.map(x => ({ id: x.p.id, m: x.motivos.join(' y ') })) });
    botDice('¿Quieres que te guíe desde cero?', { k: 'inicio', ops: [['guia', 'Guíame desde cero'], ['instagram', 'Hablar por Instagram']] });
  }

  // ---------- chat libre con IA ----------
  function volverAlAsistenteGuiado(mensaje){
    S.r = {}; S.ruta = []; S.i = 0; S.pagina = 0;
    botDice(mensaje + ' ' + PREGUNTAS.tipo.texto, { k: 'tipo', ops: PREGUNTAS.tipo.ops });
  }

  async function enviarChat(texto){
    if(ocupado || !CONFIG.ENDPOINT) return;
    const ahora = Date.now();
    if(ahora - ultimoEnvio < CONFIG.ESPERA_MIN_MS) return;
    if(S.usuario >= CONFIG.MAX_MENSAJES_USUARIO){
      usuarioDice(texto, true);
      botDice('Hemos llegado al límite de mensajes de esta conversación. Puedes seguir con las preguntas rápidas o escribirnos por Instagram.',
        { k: 'final', ops: opcionesFinal(false) });
      pintar(); return;
    }
    ultimoEnvio = ahora; S.usuario += 1;
    usuarioDice(texto, true);
    ocupado = true; pintar();

    const historial = S.msgs.filter(m => m.c).slice(-8).map(m => ({ role: m.r === 'bot' ? 'assistant' : 'user', content: m.t }));
    const agotados = PRODUCTOS.filter(agotado).map(p => p.id);
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), CONFIG.TIEMPO_MAX_MS);

    try{
      const r = await fetch(CONFIG.ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historial, agotados }), signal: control.signal
      });
      const d = await r.json();
      if(!d || !d.ok) throw Object.assign(new Error('fallback'), { motivo: d && d.motivo });
      const cards = (d.ids || []).map(id => porId(id)).filter(disponible).slice(0, 3).map(p => ({ id: p.id }));
      botDice(String(d.texto || ''), { c: 1, cards });
    }catch(e){
      const limite = e && e.motivo === 'limite';
      volverAlAsistenteGuiado(limite
        ? 'Has hecho muchas preguntas seguidas y el chat necesita un respiro.'
        : 'Ahora mismo el chat no está disponible, pero puedo guiarte con unas preguntas rápidas.');
    }finally{
      clearTimeout(reloj); ocupado = false; guardar(); pintar();
      if(abierto && campo) campo.focus({ preventScroll: true });
    }
  }
})();