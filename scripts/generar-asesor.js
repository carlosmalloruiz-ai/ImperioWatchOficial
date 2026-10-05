// Genera data/asesor.json a partir de js/productos.js + js/asesor-datos.js
// Uso (desde la raíz del proyecto):  node scripts/generar-asesor.js
// Lo lee el Worker del chat para conocer el catálogo real.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..');
const leer = (f) => fs.readFileSync(path.join(raiz, f), 'utf8')
  .replace(/\bconst (PRODUCTOS|ESTADOS|ASESOR_TAGS)\b/g, 'var $1');

const ctx = vm.createContext({ console: { warn(){}, log(){} } });
vm.runInContext(leer('js/productos.js'), ctx);
vm.runInContext(leer('js/asesor-datos.js'), ctx);
const PRODUCTOS = vm.runInContext('PRODUCTOS', ctx);
const TAGS = vm.runInContext('ASESOR_TAGS', ctx);

const ids = new Set(PRODUCTOS.map(p => p.id));
const sinTags = PRODUCTOS.filter(p => !TAGS[p.id]).map(p => p.id);
const huerfanas = Object.keys(TAGS).filter(id => !ids.has(id));
if (sinTags.length) console.warn('⚠ Productos SIN etiquetas en asesor-datos.js:', sinTags.join(', '));
if (huerfanas.length) console.warn('⚠ Etiquetas de ids que ya no existen:', huerfanas.join(', '));

const salida = {
  generado: new Date().toISOString(),
  productos: PRODUCTOS.map(p => ({
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    estado: p.estado || 'disponible',
    imagen: p.imagen,
    descripcion: p.descripcion,
    tags: TAGS[p.id] || {}
  }))
};

fs.mkdirSync(path.join(raiz, 'data'), { recursive: true });
fs.writeFileSync(path.join(raiz, 'data/asesor.json'), JSON.stringify(salida, null, 1) + '\n');
console.log('✔ data/asesor.json generado con ' + salida.productos.length + ' productos');