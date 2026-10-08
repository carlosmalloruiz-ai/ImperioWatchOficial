# IMPERIOWATCH

Tienda web de relojes y packs de cinturón y cartera, de Córdoba (España). Los pedidos se cierran por Instagram.

Es una **web estática**: HTML, CSS y JavaScript puro, sin frameworks, sin base de datos y sin servidor propio. Lo único que no es estático es el **Asesor con IA**, que funciona con un pequeño worker de Cloudflare.

## Índice

1. [Cómo funciona de un vistazo](#1-cómo-funciona-de-un-vistazo)
2. [Páginas de la web](#2-páginas-de-la-web)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Ver la web en tu ordenador](#4-ver-la-web-en-tu-ordenador)
5. [Quiero cambiar… ¿dónde lo toco?](#5-quiero-cambiar-dónde-lo-toco)
6. [Tareas habituales paso a paso](#6-tareas-habituales-paso-a-paso)
7. [El flujo de pedido](#7-el-flujo-de-pedido)
8. [El Asesor (guiado + IA)](#8-el-asesor-guiado--ia)
9. [Cómo se publica cada parte](#9-cómo-se-publica-cada-parte)
10. [Normas de la tienda y de los datos](#10-normas-de-la-tienda-y-de-los-datos)
11. [Diseño y animaciones](#11-diseño-y-animaciones)
12. [Problemas frecuentes](#12-problemas-frecuentes)
13. [Checklist antes de subir cambios](#13-checklist-antes-de-subir-cambios)

---

## 1. Cómo funciona de un vistazo

```
Cliente ──► Catálogo ──► Ficha del producto ──► Formulario de pedido
                                                      │
                  la web prepara un mensaje y lo copia al portapapeles
                                                      ▼
                       el cliente lo pega en el chat de Instagram
                                                      ▼
              IMPERIOWATCH confirma pedido, envío y seguimiento por Instagram
```

- **No hay pagos online ni cuentas de usuario.** El pedido se confirma a mano por Instagram y el método de pago indicado en el mensaje es contra reembolso.
- **Los datos del cliente no pasan por ningún servidor nuestro.** El mensaje se construye en el navegador del cliente y solo llega a nosotros cuando él lo pega en Instagram.
- **La web no recoge correos electrónicos.** No hay formulario de contacto ni campo de email. Todo el contacto es por Instagram.
- **El catálogo vive en un solo archivo** (`js/productos.js`). Todas las páginas lo leen de ahí.

---

## 2. Páginas de la web

| Archivo | Qué es |
|---|---|
| `index.html` | Portada: presentación, destacados y ventajas de la tienda |
| `catalogo.html` | Catálogo con búsqueda, categorías, orden y filtro de disponibilidad |
| `producto.html` | Ficha de un producto (se abre con `producto.html?id=ID-DEL-PRODUCTO`) |
| `pedido.html` | Formulario de pedido (se abre con `pedido.html?producto=ID&opcion=OPCIÓN`) |
| `envios-devoluciones.html` | Plazos de envío, seguimiento y política de devoluciones |
| `preguntas-frecuentes.html` | Preguntas frecuentes |
| `sobre-nosotros.html` | Quiénes somos |
| `contacto.html` | Contacto (solo Instagram) |

---

## 3. Estructura de carpetas

```
ImperioWatchOficial-main/
├── index.html, catalogo.html, producto.html, pedido.html ...   Las páginas
├── css/
│   └── style.css            Todo el diseño (colores, tipografía, animaciones, intro)
├── js/
│   ├── productos.js         CATÁLOGO: aquí se añaden, editan y marcan productos
│   ├── asesor-datos.js      Etiquetas de cada producto para el Asesor (estilo, color...)
│   ├── asesor.js            Widget del Asesor (chat guiado + chat con IA)
│   ├── pedido.js            Lógica del formulario de pedido y del mensaje a Instagram
│   ├── site.js              Menú móvil, catálogo, ficha, intro, transiciones, efectos
│   └── particulas.js        Red de puntos dorados de la portada
├── assets/
│   ├── logo.jpeg            Logo
│   └── productos/           Fotos de los productos
├── data/
│   └── asesor.json          Catálogo para el Asesor. SE GENERA SOLO: no editar a mano
├── scripts/
│   └── generar-asesor.js    Genera data/asesor.json a partir de productos.js y asesor-datos.js
├── worker/
│   ├── index.js             Worker de Cloudflare: cerebro del chat con IA y sus instrucciones
│   └── wrangler.toml        Configuración del worker (nombre, dominios permitidos, catálogo)
└── .github/workflows/
    └── asesor-catalogo.yml  Regenera data/asesor.json automáticamente al hacer push
```

---

## 4. Ver la web en tu ordenador

No hace falta instalar nada para ver cambios básicos, pero lo cómodo es usar un servidor local:

- **VS Code:** instala la extensión *Live Server*, clic derecho en `index.html` → *Open with Live Server*.
- **XAMPP:** copia la carpeta del proyecto dentro de `htdocs` y abre `http://localhost/NOMBRE-CARPETA/`.
- **Terminal con Node:** `npx serve` dentro de la carpeta del proyecto.

> En local, el **chat con IA no responde** (el worker solo acepta peticiones desde el dominio real de la web). El **Asesor guiado sí funciona**. Para probar la IA en local tendrías que añadir temporalmente tu dirección local a `ALLOWED_ORIGINS` (ver [sección 8](#8-el-asesor-guiado--ia)).

---

## 5. Quiero cambiar… ¿dónde lo toco?

| Quiero cambiar | Archivo |
|---|---|
| Añadir, quitar o editar un producto, su precio o su foto | `js/productos.js` + `assets/productos/` |
| Marcar un producto como agotado o disponible | `js/productos.js` (campo `estado`) |
| Cómo el Asesor recomienda un producto (estilo, color...) | `js/asesor-datos.js` |
| Textos de envíos y devoluciones | `envios-devoluciones.html` **y** `preguntas-frecuentes.html` **y** `worker/index.js` |
| Lo que sabe o cómo responde el chat con IA | `worker/index.js` (después hay que redesplegar el worker) |
| Mensaje que se envía a Instagram al pedir | `js/pedido.js` (función `construirMensaje`) |
| Campos del formulario de pedido | `pedido.html` y `js/pedido.js` |
| Colores, tipografía, tamaños, animaciones | `css/style.css` |
| Duración de la intro de entrada | `js/site.js` (constante `INTRO_MIN`) |
| El usuario de Instagram | Ver [6.6](#66-cambiar-el-usuario-de-instagram) |
| Dominios desde los que funciona el chat con IA | `worker/wrangler.toml` (`ALLOWED_ORIGINS`) |

---

## 6. Tareas habituales paso a paso

### 6.1 Añadir un producto

1. **Foto:** copia la imagen a `assets/productos/`. Cuidado con las mayúsculas: en GitHub Pages `Foto.png` y `foto.png` son archivos distintos.
2. **Catálogo:** en `js/productos.js`, añade un objeto al array `PRODUCTOS`:

   ```js
   {
     id: "rolex-ejemplo",                 // ÚNICO, sin espacios ni tildes (va en la URL)
     nombre: "Rlx Ejemplo",
     categoria: "Relojes",                // las categorías salen solas de este campo
     precio: 49.99,
     estado: "disponible",                // "disponible" o "agotado"
     imagen: "assets/productos/RolexEjemplo.png",
     descripcion: "Texto que se ve en la ficha.",
     tallas: ["Talla única"]              // opciones: talla, color, correa...
   },
   ```

3. **Etiquetas del Asesor:** en `js/asesor-datos.js`, añade una línea con **el mismo `id`**:

   ```js
   "rolex-ejemplo": { tipo:"reloj", marca:"Rlx", estilo:["elegante"], color:["plateado"] },
   ```

   Valores permitidos: `tipo` (`reloj` o `pack`), `estilo` (`elegante`, `deportivo`, `llamativo`, `discreto`), `color` (`dorado`, `plateado`, `negro`, `azul`, `blanco`, `colorido`, `verde`) y, si lleva diamantes, `diamantes:true`.
4. **Subir:** haz commit y push. El workflow actualiza `data/asesor.json` solo (ver [sección 9](#9-cómo-se-publica-cada-parte)).

### 6.2 Marcar un producto como agotado (o volver a ponerlo disponible)

En `js/productos.js`, cambia el valor de `estado` a `"agotado"` o `"disponible"` y sube el cambio. Un producto agotado sale con la etiqueta "Agotado" y no deja pedir, ni siquiera con un enlace antiguo. Si escribes otro valor, la consola del navegador avisa del error.

### 6.3 Cambiar el precio o el texto de un producto

Edita `precio` o `descripcion` en su objeto de `js/productos.js` y sube el cambio.

### 6.4 Quitar un producto

Borra su objeto de `js/productos.js` y su línea de `js/asesor-datos.js`. La foto puedes borrarla o dejarla.

### 6.5 Cambiar las políticas de envío o devolución

El mismo texto aparece en **tres sitios** y los tres tienen que decir lo mismo:

1. `envios-devoluciones.html`
2. `preguntas-frecuentes.html`
3. `worker/index.js` (lo que le dice el Asesor a los clientes). Después, **redespliega el worker** (ver [sección 8](#8-el-asesor-guiado--ia)).

### 6.6 Cambiar el usuario de Instagram

La dirección aparece en estos archivos. Búscala con *Ctrl+Mayús+F* en VS Code y cámbiala en todos:

`catalogo.html`, `contacto.html`, `envios-devoluciones.html`, `index.html`, `pedido.html`, `preguntas-frecuentes.html`, `producto.html`, `sobre-nosotros.html`, `js/asesor.js` (`INSTAGRAM_URL`) y `js/pedido.js` (`INSTAGRAM_URL`).

---

## 7. El flujo de pedido

1. El cliente elige un producto y pulsa pedir. Llega a `pedido.html?producto=ID&opcion=OPCIÓN`.
2. Rellena sus datos de envío: nombre, apellidos, teléfono, dirección, número, piso, código postal, localidad y provincia.
3. Al pulsar **"Continuar a Instagram"**:
   - `js/pedido.js` construye el mensaje con el producto, la opción, el precio y los datos de envío.
   - Lo copia al portapapeles.
   - Oculta el formulario y muestra el panel **"Pedido preparado"**.
4. El cliente pulsa **"Abrir Instagram"** y pega el mensaje en el chat. También puede pulsar "Copiar mensaje otra vez".
5. IMPERIOWATCH confirma el pedido por Instagram.

Detalles que conviene saber:

- Si el producto está agotado, `pedido.html` no muestra el formulario, sino un aviso con enlace al catálogo.
- Si el navegador no deja copiar automáticamente, el panel lo indica y el cliente copia el texto a mano.
- Para añadir o quitar un campo hay que tocar **dos sitios**: el `<input>` en `pedido.html` y la plantilla del mensaje en `js/pedido.js`.

---

## 8. El Asesor (guiado + IA)

El Asesor es el botón flotante "Asesor" que aparece en la web (no en `pedido.html`). Tiene dos modos:

1. **Asesor guiado:** preguntas con botones (estilo, color...) que recomiendan productos. No usa IA ni envía datos a nadie. **Siempre funciona.**
2. **Chat libre con IA:** el cliente escribe y responde una IA que conoce el catálogo real. Funciona a través de un **worker de Cloudflare**. Si el worker falla, no está desplegado o se agota la cuota gratuita del día, la web pasa sola al asesor guiado.

### Cómo se conectan las piezas

```
Widget (js/asesor.js) ──► Worker (worker/index.js) ──► IA de Cloudflare (Workers AI)
                                   │
                                   └─ lee el catálogo de data/asesor.json (se guarda 5 min en memoria)
```

### Configuración

| Qué | Dónde | Para qué sirve |
|---|---|---|
| `ENDPOINT` | `js/asesor.js` | Dirección del worker |
| `ALLOWED_ORIGINS` | `worker/wrangler.toml` | Dominios desde los que se permite usar el chat. Solo el dominio, sin ruta ni barra final. Varios separados por comas |
| `CATALOGO_URL` | `worker/wrangler.toml` | Dirección pública de `data/asesor.json` |
| `MODELO`, `MODELO_RESPALDO` | `worker/index.js` | Modelos de IA que usa el worker |
| Límites | `worker/index.js` | Por IP: unas 8 peticiones por minuto y 60 por día. Mensajes de hasta 400 caracteres y respuestas cortas |
| Límites del widget | `js/asesor.js` | Hasta 12 mensajes del usuario por conversación, 300 caracteres por mensaje |

> **Importante:** si publicas la web en más de un dominio (por ejemplo, uno de pruebas), añade cada uno a `ALLOWED_ORIGINS` separados por comas, o el chat con IA no funcionará en ese dominio.

### Instrucciones del Asesor

Lo que el Asesor sabe de la tienda (envíos, devoluciones, tono, qué no debe hacer) está escrito en el prompt de `worker/index.js`. Ahí también está la norma de que **nunca debe pedir ni aceptar datos personales** (nombre completo, teléfono, dirección, email) y que **nunca debe prometer devoluciones sin condiciones**.

### Redesplegar el worker

Hace falta **solo cuando cambias `worker/index.js` o `worker/wrangler.toml`**. Si solo cambias HTML, CSS o el resto del JS, no.

**Opción A: desde el ordenador (Wrangler, requiere Node.js)**

1. En VS Code: clic derecho en la carpeta `worker` → *Open in Integrated Terminal*.
2. Primera vez: `npx wrangler login` (abre el navegador para entrar en Cloudflare).
3. Desplegar: `npx wrangler deploy`.

El nombre del worker es `imperiowatch-asesor`, así que se actualiza el que ya existe y la URL no cambia.

**Opción B: desde el panel de Cloudflare (sin instalar nada)**

1. Entra en dash.cloudflare.com → *Workers & Pages* → `imperiowatch-asesor` → *Edit code*.
2. Borra el contenido y pega el `worker/index.js` completo y actualizado.
3. Pulsa *Deploy*.

**Comprobar que funciona:** abre la web y pregúntale al Asesor algo que dependa del cambio, por ejemplo "¿puedo devolverlo si no me gusta?", y mira que responde con lo nuevo.

---

## 9. Cómo se publica cada parte

Son **tres cosas independientes**, y cada una se publica de forma distinta:

| Parte | Cómo se publica |
|---|---|
| **La web** (HTML, CSS, JS, fotos) | Con `git push`. GitHub Pages la sirve |
| **El catálogo del Asesor** (`data/asesor.json`) | Solo. Un workflow de GitHub Actions lo regenera cuando haces push de cambios en `js/productos.js` o `js/asesor-datos.js` |
| **El worker del Asesor** | A mano, con la opción A o B de la sección 8 |

Notas sobre el workflow del catálogo:

- Está en `.github/workflows/asesor-catalogo.yml` y solo salta en la rama `main`. Si tu rama se llama `master`, cámbialo ahí.
- El workflow hace un commit propio (`chore: actualizar data/asesor.json`). **Antes de tu siguiente push, haz `git pull`** para no tener conflictos.
- También puedes generarlo a mano, desde la raíz del proyecto: `node scripts/generar-asesor.js`. El script avisa si algún producto no tiene etiquetas o si hay etiquetas de productos que ya no existen.
- Después de cambiar el catálogo, el worker puede tardar hasta 5 minutos en verlo, porque lo guarda en memoria.

---

## 10. Normas de la tienda y de los datos

Decisiones tomadas para la tienda. Si las cambias, actualiza también el sitio que corresponda (ver [6.5](#65-cambiar-las-políticas-de-envío-o-devolución)).

**Devoluciones**

- **Defecto de fábrica, producto dañado o equivocado:** se cambia o se reembolsa, y el envío corre a cargo de IMPERIOWATCH.
- **Desistimiento (14 días naturales desde la recepción):** la ley de consumo da este derecho en las ventas a distancia y **no se puede excluir**. Por eso no se anuncian "devoluciones por la cara no". Lo que sí se exige: reloj sin usar, completo, en su embalaje original y con etiquetas; si hay signos de uso o manipulación se puede descontar la pérdida de valor; el envío de la devolución lo paga el cliente; el reembolso se hace al recibir y revisar el producto.
- Cualquier devolución se tramita **por Instagram** indicando el número de pedido.
- *Esto no es asesoramiento legal. Ante dudas, consulta con una gestoría.*

**Contacto y datos**

- **Todo el contacto y el seguimiento de pedidos se hace por Instagram.**
- **La web no recoge correos electrónicos:** no hay formulario de contacto ni campo de email en el pedido. Cualquier función nueva que necesite guardar un email se descarta.
- El Asesor tiene prohibido pedir o aceptar datos personales.
- El Asesor guiado no envía nada a ningún sitio. En el chat con IA, solo viajan al worker los mensajes que el cliente escribe.
- El historial del chat se guarda solo en la sesión del navegador (`sessionStorage`) y se borra al cerrar la pestaña.

---

## 11. Diseño y animaciones

**Paleta** (definida como variables al inicio de `css/style.css`):

| Variable | Color | Uso |
|---|---|---|
| `--void` | `#0a0908` | Fondo |
| `--charcoal` | `#141210` | Superficies |
| `--bone` | `#ece5d6` | Texto principal |
| `--bone-dim` | `#a89f8c` | Texto secundario |
| `--gold` | `#c6a15b` | Dorado de marca |
| `--gold-bright` | `#e3c184` | Dorado claro, destacados |

**Tipografía:** la del sistema (San Francisco en iPhone y Mac, Segoe UI en Windows). No se carga ninguna fuente externa.

**Curvas de animación:** `--ease-out`, `--ease-in-out` y `--ease-spring`, también en `style.css`. Úsalas en cualquier animación nueva para que todo se sienta igual.

**Intro de entrada** (solo la primera visita de cada sesión):

- Anillo dorado que se dibuja y estalla, el nombre IMPERIOWATCH que se despliega desde el centro, un brillo que recorre las letras y una línea con un rombo dorado.
- El CSS está en `css/style.css`, en el bloque que empieza por `.logo-intro` (comentado por pasos del 1 al 5). La lógica está en `js/site.js`, en la sección *PRELOADER*.
- Dura unos 3 segundos en total, contados desde que empieza la carga. Se controla con `INTRO_MIN` en `site.js`.
- Cada letra del HTML lleva un `animation-delay` en línea. El CSS los pisa con `!important`, así que no hace falta tocar esos números.
- No se repite al navegar entre páginas de la misma sesión (se guarda `iw_intro_seen` en `sessionStorage`).

**Accesibilidad:** con la opción "reducir movimiento" activada en el dispositivo, la intro no se muestra y las animaciones se simplifican.

---

## 12. Problemas frecuentes

| Problema | Causa y solución |
|---|---|
| Subí un cambio y sigo viendo la versión antigua | Caché del navegador. Prueba en pestaña privada o con recarga forzada (*Ctrl+F5*). GitHub Pages puede tardar uno o dos minutos en actualizar |
| La intro de entrada no sale | Solo sale una vez por sesión. Abre una pestaña nueva o privada. Tampoco sale con "reducir movimiento" activado |
| Un producto agotado deja pedirlo | El `estado` debe ser exactamente `"agotado"`, en minúsculas y con comillas. La consola del navegador avisa si el valor no es válido |
| Un producto nuevo no sale en el Asesor | Falta su línea en `js/asesor-datos.js` con el mismo `id`, o aún no se ha regenerado `data/asesor.json`. Recuerda que el worker puede tardar hasta 5 minutos en verlo |
| La foto de un producto no carga | Revisa mayúsculas y minúsculas en el nombre del archivo y la ruta en `imagen` |
| El chat con IA no responde y salta el asesor guiado | Puede ser: worker sin desplegar, cuota diaria agotada, límite por IP alcanzado o el dominio no está en `ALLOWED_ORIGINS` |
| El Asesor dice información antigua de envíos o devoluciones | No se redesplegó el worker después de cambiar `worker/index.js` |
| El workflow del catálogo no se ejecuta | Mira que tu rama sea `main` (o cambia el nombre en el workflow) y que hayas tocado `productos.js` o `asesor-datos.js` |
| `git push` rechazado | El workflow hizo un commit propio. Haz `git pull` y vuelve a hacer push |

---

## 13. Checklist antes de subir cambios

- [ ] Los ids de producto son únicos y cada uno tiene su línea en `asesor-datos.js`.
- [ ] Las fotos están en `assets/productos/` y el nombre coincide exactamente.
- [ ] Si toqué políticas, las cambié en las **tres** ubicaciones y redesplegué el worker.
- [ ] No añadí ningún campo ni función que recoja correos electrónicos.
- [ ] Probé en el móvil (la mayoría de los clientes entran desde Instagram, en el móvil).
- [ ] Hice `git pull` antes de `git push`.
