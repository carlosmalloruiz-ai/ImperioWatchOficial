// ================================================
// FLUJO DE PEDIDO IMPERIOWATCH
// El pedido se confirma por Instagram. Este formulario
// prepara el mensaje con los datos y lo copia al portapapeles.
// ================================================
(function(){
  const form = document.getElementById('pedido-form');
  const productBox = document.getElementById('pedido-producto');
  if(!form || !productBox) return;

  const params = new URLSearchParams(window.location.search);
  const producto = getProducto(params.get('producto')) || PRODUCTOS[0];
  const opcion = params.get('opcion') || producto.tallas?.[0] || '—';
  const INSTAGRAM_URL = 'https://www.instagram.com/imperiowatchesp/';

  productBox.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <div><span class="cat">${producto.categoria}</span><h2>${producto.nombre}</h2><p>${opcion}</p><strong>${formatPrecio(producto.precio)}</strong></div>
  `;

  let mensaje = '';

  function construirMensaje(data){
    return `Hola, quiero realizar un pedido en IMPERIOWATCH.\n\nProducto: ${producto.nombre}\nOpción: ${opcion}\nPrecio: ${formatPrecio(producto.precio)}\n\nDATOS DE ENVÍO\nNombre: ${data.nombre}\nApellidos: ${data.apellidos}\nTeléfono: ${data.telefono}\nEmail: ${data.email}\nDirección: ${data.direccion}, nº ${data.numero}${data.piso ? ', ' + data.piso : ''}\nCódigo postal: ${data.cp}\nLocalidad: ${data.localidad}\nProvincia: ${data.provincia}\n\nMétodo de pago: Contra reembolso`;
  }

  async function copiarMensaje(){
    try {
      await navigator.clipboard.writeText(mensaje);
      return true;
    } catch(e) {
      const area = document.createElement('textarea');
      area.value = mensaje;
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.appendChild(area); area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    }
  }

  function abrirInstagram(){
    window.open(INSTAGRAM_URL, '_blank', 'noopener');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const error = document.getElementById('form-error');
    error.textContent = '';
    if(!form.checkValidity()){
      error.textContent = 'Revisa los campos obligatorios antes de continuar.';
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    mensaje = construirMensaje(data);
    const copied = await copiarMensaje();

    form.hidden = true;
    const success = document.getElementById('order-success');
    success.hidden = false;
    document.getElementById('success-text').textContent = copied
      ? 'Hemos preparado tu mensaje y lo hemos copiado. Pulsa “Abrir Instagram” y pégalo en nuestro chat para confirmar el pedido.'
      : 'Hemos preparado tu mensaje. Pulsa “Abrir Instagram” y copia el texto que aparecerá para enviarlo en nuestro chat.';

    document.getElementById('open-instagram').onclick = abrirInstagram;
    document.getElementById('copy-again').onclick = async () => {
      const ok = await copiarMensaje();
      document.getElementById('copy-again').textContent = ok ? '¡Mensaje copiado ✓' : 'No se pudo copiar';
      setTimeout(() => document.getElementById('copy-again').textContent = 'Copiar mensaje otra vez', 2200);
    };
    window.scrollTo({top:0, behavior:'smooth'});
  });
})();
