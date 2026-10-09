// ================================================
// CATÁLOGO DE PRODUCTOS — IMPERIOWATCH
// Edita, añade o elimina objetos de este array para
// gestionar tu catálogo. Cada producto necesita:
// id, nombre, categoria, precio, estado, imagen, descripcion, tallas
// (el campo "tallas" se usa como opciones: color, correa, talla, etc.)
//
// ESTADO DE CADA PRODUCTO
//   estado: "disponible"  → se puede pedir con normalidad
//   estado: "agotado"     → se muestra con la etiqueta "Agotado" y no se puede pedir
// Para cambiarlo, edita ese valor en el producto y sube el cambio.
// El id de cada producto debe ser ÚNICO (se usa en la URL de la ficha).
// ================================================

const PRODUCTOS = [
  {
    id: "rolex-batgirl",
    nombre: "Rlx GMT-Master II Batgirl",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexMasterIINegroAzul.png",
    descripcion: "Reloj de acero con esfera negra, bisel cerámico giratorio dividido en azul y negro, manecilla GMT azul y brazalete de acero estilo Jubilee.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-rootbeer",
    nombre: "Rlx GMT-Master II Oro Rosa",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexOroRosa.png",
    descripcion: "Reloj con caja y brazalete de tres eslabones oyster fabricados en oro rosa. Presenta una esfera negra y bisel cerámico bicolor en negro y marrón.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-batman",
    nombre: "Rlx GMT-Master II Batman",
    categoria: "Relojes",
    precio: 49.99,
    estado: "agotado",
    imagen: "assets/productos/RolexBatman.png",
    descripcion: "Reloj de acero con esfera negra, bisel cerámico bidireccional en azul y negro, manecilla de segundo huso horario azul y brazalete metálico de tres eslabones oyster.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-yacht-master",
    nombre: "Rlx Yacht Master Oro Rosa con Correa Oysterflex",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexOroRosaCierreGoma.png",
    descripcion: "Reloj con caja en oro rosa, esfera negra mate con el detalle Yacht-Master en rojo, bisel cerámico negro con relieve y correa de goma negro Oysterflex.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-bruce-wayne",
    nombre: "Rlx GMT-Master II Bruce Wayne",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexMasterIINegroGris.png",
    descripcion: "Reloj de acero con esfera negra, aguja GMT verde, bisel cerámico bicolor en negro y gris, y brazalete de acero de cinco eslabones Jubilee.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-oro-efera-celeste",
    nombre: "Rlx Cosmograph Daytona Oro Amarillo con Esfera Azul Celeste",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexDaytonaDoradoAzulCierreGoma.png",
    descripcion: "Reloj cronógrafo con caja de oro amarillo, bisel cerámico negro Tachymetre, esfera azul claro con subesferas negras en contraste y correa de goma negra Oysterflex.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-daytona-amarillo-dorado",
    nombre: "Rlx Cosmograph Daytona Oro Amarillo / Dorado",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexDaytonaDoradoCierreGoma.png",
    descripcion: "Reloj cronógrafo con caja en oro amarillo, bisel cerámico negro Tachymetre, esfera en tono dorado con subesferas negras y correa de goma negra Oysterflex.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-daytona-plata",
    nombre: "Rlx Cosmograph Daytona Acero Esfera Plata",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexDaytonaCierreGoma.png",
    descripcion: "Reloj cronógrafo con caja de acero/oro blanco, bisel cerámico negro Tachymetre, esfera en tono gris/plateado con subesferas negras y correa de goma negra Oysterflex.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-dorado-cierre-goma",
    nombre: "Rlx Yacht Master Oro Amarillo con Correa Oysterflex",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexDoradoCierreGoma.png",
    descripcion: "Reloj deportivo con caja en oro amarillo, bisel cerámico negro mate con números en relieve, esfera negra con texto en rojo y correa de goma negra Oysterflex.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-yacht-master-esfera-azul",
    nombre: "Rlx Yacht Master Acero Platino con Esfera Azul",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/Rolex.png",
    descripcion: "Reloj de acero con bisel metálico grabado en relieve, esfera en azul sol rayado con aguja del segundero en color rojo y correa de goma negra Oysterflex.",
    tallas: ["Talla única"]
  },
  {
    id: "rolex-yacht-master-42-titanio",
    nombre: "Rlx Yacht Master 42 en Titanio RLX Oro Blanco con Correa Oysterflex",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/RolexYachtMaster42.png",
    descripcion: "Reloj deportivo con caja en tono plateado/titanio, bisel cerámico Cerachrom negro mate con números en relieve, esfera negra y correa de goma negra Oysterflex.",
    tallas: ["Talla única"]
  },
  {
    id: "cartier-diamantes-negros",
    nombre: "Crtr Santos de Cartier Iced Out en Diamantes Negros",
    categoria: "Relojes",
    precio: 59.99,
    estado: "disponible",
    imagen: "assets/productos/CartierPerladoNegro.png",
    descripcion: "Reloj de forma cuadrada con acabado completo en pavé de diamantes/gemas en color negro tanto en la caja, el bisel y la esfera como en el brazalete metálico.",
    tallas: ["Talla única"]
  },
  {
    id: "cartier-santos-negro",
    nombre: "Crtr Santos de Cartier Negro con Esfera Negra",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/CartierSantosNegro.png",
    descripcion: "Reloj automático con caja y brazalete de acero en acabado negro mate, esfera negra con números romanos, indicador de fecha a las seis y corona con cabujón.",
    tallas: ["Talla única"]
  },
  {
    id: "cartier-santos-azul",
    nombre: "Crtr Santos de Cartier Acero con Esfera Azul Degradada",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/CartierSantosAzul.png",
    descripcion: "Reloj de acero con caja cuadrada, esfera azul degradada con números romanos, ventana de fecha, brazalete de acero con tornillos vistos y corona con cabujón azul.",
    tallas: ["Talla única"]
  },
  {
    id: "cartier-santos-blanco",
    nombre: "Crtr Santos de Cartier Acero con Esfera Blanca",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/CartierSantosBlanco.png",
    descripcion: "Reloj automático de acero con bisel satinado, esfera blanca plateada con números romanos negros, ventana de fecha, brazalete de acero con tornillos vistos y corona con cabujón azul.",
    tallas: ["Talla única"]
  },
  {
    id: "omega-snoopy",
    nombre: "Om x Sw Bioceramic MoonSwatch Mission to the Moonphase (Snoopy White)",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/OmegaBlanco.png",
    imagen: "assets/productos/OmegaBlanco.png",
    imagen: "assets/productos/OmegaBlanco.png",
    imagen: "assets/productos/OmegaBlanco.png",
    descripcion: "Reloj cronógrafo totalmente blanco fabricado en biocerámica, con correa de velcro blanca y subesfera superior derecha decorada con la ilustración del personaje Snoopy durmiendo sobre la luna.",
    tallas: ["Talla única"]
  },
  {
    id: "richard-mille-rafael-nadal",
    nombre: "RM 35-02 Rafael Nadal Carbono NTPT con Correa Azul",
    categoria: "Relojes",
    precio: 59.99,
    estado: "agotado",
    imagen: "assets/productos/RichardGomaAzul.png",
    descripcion: "Reloj de acero con esfera negra, bisel cerámico giratorio dividido en azul y negro, manecilla GMT azul y brazalete de acero estilo Jubilee.",
    tallas: ["Talla única"]
  },
  {
    id: "richard-mille-rafael-nadal-blanco",
    nombre: "RM 35-02 Rafael Nadal Cerámica Blanca con Correa Blanca",
    categoria: "Relojes",
    precio: 59.99,
    estado: "disponible",
    imagen: "assets/productos/RichardGomaBlanca.png",
    descripcion: "Reloj deportivo con caja de cerámica blanca, bisel interior azul claro, mecanismo totalmente esqueletizado visible y correa de goma blanca.",
    tallas: ["Talla única"]
  },
  {
    id: "richard-mille-rafael-nadal-negro",
    nombre: "RM 35-02 Rafael Nadal Carbono NTPT con Correa Negra",
    categoria: "Relojes",
    precio: 59.99,
    estado: "disponible",
    imagen: "assets/productos/RichardGomaNegra.png",
    descripcion: "Reloj de alta gama con caja de carbono NTPT veteada en tono negro/móvil, realce interior en azul cyan, movimiento automático esqueletizado y correa de goma negra.",
    tallas: ["Talla única"]
  },
  {
    id: "richard-mille-rm-53-01-azul",
    nombre: "RM 53-01 Tourbillon Pablo Mac Donough Zafiro con Correa Azul",
    categoria: "Relojes",
    precio: 59.99,
    estado: "agotado",
    imagen: "assets/productos/RichardTrasparenteGomaAzul.png",
    descripcion: "Reloj con caja transparente elaborada en cristal de zafiro, mecanismo tourbillon suspendido mediante cables de acero y correa de goma azul claro.",
    tallas: ["Talla única"]
  },
  {
    id: "richard-mille-rm-53-01-negro",
    nombre: "RM 53-01 Tourbillon Pablo Mac Donough Zafiro con Correa Negra",
    categoria: "Relojes",
    precio: 59.99,
    estado: "agotado",
    imagen: "assets/productos/RichardTrasparenteGomaNegra.png",
    descripcion: "Reloj con caja totalmente transparente de cristal de zafiro, estructura interna esqueletizada con puentes y cables metálicos, y correa de goma negra.",
    tallas: ["Talla única"]
  },
  {
    id: "richard-mille-rm-11-03-amarillo",
    nombre: "RM 11-03 Flyback Cerámica Blanca con Correa Amarilla",
    categoria: "Relojes",
    precio: 59.99,
    estado: "disponible",
    imagen: "assets/productos/RichardBlancoAmarillo.png",
    descripcion: "Reloj cronógrafo con caja tonneau en cerámica blanca, esfera esqueleto con detalles amarillos, indicador de fecha grande, pulsadores blancos y correa de goma amarilla.",
    tallas: ["Talla única"]
  },
  {
    id: "ap-dorado",
    nombre: "AP Royal Oak Cronógrafo Oro Amarillo",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/ApDorado.png",
    descripcion: "Reloj cronógrafo con caja y brazalete integrado en oro amarillo, bisel octogonal con tornillos expuestos y esfera monogramada con patrón Grande Tapisserie en tono dorado con subesferas a juego.",
    tallas: ["Talla única"]
  },
  {
    id: "ap-negro",
    nombre: "AP Royal Oak Cronógrafo Cerámica Negra",
    categoria: "Relojes",
    precio: 49.99,
    estado: "agotado",
    imagen: "assets/productos/ApFullBlack.png",
    descripcion: "Reloj cronógrafo fabricado integramente en cerámica negra mate cepillada, con esfera negra Grande Tapisserie, detalles y agujas en oro rosa, y brazalete de cerámica negra.",
    tallas: ["Talla única"]
  },
  {
    id: "ap-oro-rosa",
    nombre: "AP Royal Oak Cronógrafo Oro Rosa",
    categoria: "Relojes",
    precio: 49.99,
    estado: "disponible",
    imagen: "assets/productos/ApOroRosa.png",
    descripcion: "Reloj cronógrafo con caja y brazalete en oro rosa, bisel octogonal característico y esfera Grande Tapisserie en tono marrón rosa con subesferas a juego.",
    tallas: ["Talla única"]
  },
  {
    id: "ap-plata-celeste",
    nombre: "AP Royal Oak Cronógrafo Acero con Esfera Azul Celeste",
    categoria: "Relojes",
    precio: 49.99,
    estado: "agotado",
    imagen: "assets/productos/ApPlateadoEferaCeleste.png",
    descripcion: "Reloj cronógrafo con caja y brazalete integrado de acero inoxidable, bisel octogonal cepillado y esfera Grande Tapisserie en tono azul celeste.",
    tallas: ["Talla única"]
  },
  {
    id: "ap-perlado-blanco",
    nombre: "AP Royal Oak Iced Out Diamantes Blancos",
    categoria: "Relojes",
    precio: 59.99,
    estado: "disponible",
    imagen: "assets/productos/ApPerladoBlanco.png",
    descripcion: "Reloj de tres agujas con ventana de fecha, completamente engastado en pavé de diamantes brillantes en la caja, el bisel octogonal, la esfera y el brazalete.",
    tallas: ["Talla única"]
  },
  {
    id: "ap-perlado-negro",
    nombre: "AP Royal Oak Iced Out Diamantes Negros",
    categoria: "Relojes",
    precio: 59.99,
    estado: "disponible",
    imagen: "assets/productos/ApPerladoNegro.png",
    descripcion: "Reloj de tres agujas con ventana de fecha, cubierto por completo en pavé de diamantes en tono negro brillante, abarcando caja, bisel, esfera y brazalete.",
    tallas: ["Talla única"]
  },
  {
    id: "pack-lv-dorado",
    nombre: "Pack cinturon y cartera LV Dorado",
    categoria: "Cinturones",
    precio: 44.99,
    estado: "disponible",
    imagen: "assets/productos/lvdorado.jpeg",
    descripcion: "Conjunto compuesto por cinturón con hebilla en acabado dorado, y billetera a juego. Incluye bolsa de compra y caja original de la marca.",
    tallas: ["110 cm"]
  },
  {
    id: "pack-lv-plata",
    nombre: "Pack cinturon y cartera LV Plata",
    categoria: "Cinturones",
    precio: 44.99,
    estado: "disponible",
    imagen: "assets/productos/lvplata.jpeg",
    descripcion: "Conjunto compuesto por cinturón en lona Monogram con hebilla en acabado plateado, y billetera a juego. Incluye bolsa de compra y caja original de la marca.",
    tallas: ["110 cm"]
  },
  {
    id: "pack-hermes-dorado",
    nombre: "Pack cinturon y cartera Hrms Dorado",
    categoria: "Cinturones",
    precio: 44.99,
    estado: "agotado",
    imagen: "assets/productos/hermesdorado.jpeg",
    descripcion: "Conjunto compuesto por cinturón de piel negra con hebilla en acabado dorado, y billetera a juego con detalle metálico. Incluye bolsa de compra y caja original de la marca.",
    tallas: ["110 cm"]
  },
  {
    id: "pack-hermes-plata",
    nombre: "Pack cinturon y cartera Hrms Plata",
    categoria: "Cinturones",
    precio: 44.99,
    estado: "agotado",
    imagen: "assets/productos/hermesplata.jpeg",
    descripcion: "Conjunto compuesto por cinturón de piel negra con hebilla en acabado plateado, y billetera a juego con detalle metálico. Incluye bolsa de compra y caja original de la marca.",
    tallas: ["110 cm"]
  },
  {
    id: "pack-gucci-negro",
    nombre: "Pack cinturon y cartera GC Negro",
    categoria: "Cinturones",
    precio: 44.99,
    estado: "agotado",
    imagen: "assets/productos/guccinegro.jpeg",
    descripcion: "Conjunto compuesto por cinturón en tono gris con hebilla en acabado negro mate, y billetera a juego. Incluye bolsa de compra y caja original de la marca.",
    tallas: ["110 cm"]
  },
  {
    id: "pack-gucci-verde-negro",
    nombre: "Pack cinturon y cartera GC Verde y Negro",
    categoria: "Cinturones",
    precio: 44.99,
    estado: "agotado",
    imagen: "assets/productos/gucciverdenegro.jpeg",
    descripcion: "Conjunto compuesto por cinturón en piel negra con detalle tricolor en la hebilla, y billetera a juego con franja verde y roja. Incluye bolsa de compra y caja original de la marca.",
    tallas: ["110 cm"]
  },
];

function getProducto(id){
  return PRODUCTOS.find(p => p.id === id);
}

function getCategorias(){
  return [...new Set(PRODUCTOS.map(p => p.categoria))];
}

const ESTADOS = ["disponible", "agotado"];

function estaAgotado(p){
  return !!p && p.estado === "agotado";
}

// Aviso en consola si algún id está repetido o algún estado no es válido
(function validarCatalogo(){
  const vistos = new Set();
  PRODUCTOS.forEach(p => {
    if(vistos.has(p.id)) console.warn('[IMPERIOWATCH] id de producto repetido:', p.id);
    vistos.add(p.id);
    if(!ESTADOS.includes(p.estado)) console.warn('[IMPERIOWATCH] estado no válido en', p.id, '→', p.estado, '(usa "disponible" o "agotado")');
  });
})();
