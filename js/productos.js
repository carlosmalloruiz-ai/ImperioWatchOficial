// ================================================
// PLANTILLA DE PRODUCTOS DE EJEMPLO — IMPERIOWATCH
// Edita, añade o elimina objetos de este array para
// gestionar tu catálogo. Cada producto necesita:
// id, nombre, categoria, precio, imagen, descripcion, tallas
// (el campo "tallas" se usa como opciones: color, correa, talla, etc.)
// ================================================

const PRODUCTOS = [
  {
    id: "reloj-cronografo-negro",
    nombre: "Reloj Cronógrafo Negro",
    categoria: "Relojes",
    precio: 89.90,
    imagen: "assets/productos/AP.png",
    descripcion: "Reloj cronógrafo con caja de acero inoxidable, correa de piel negra y resistencia al agua 5 ATM. Diseño elegante para uso diario o eventos formales.",
    tallas: ["Correa negra", "Correa marrón"]
  },
  {
    id: "reloj-clasico-dorado",
    nombre: "Reloj Clásico Dorado",
    categoria: "Relojes",
    precio: 74.90,
    imagen: "assets/productos/cartier.png",
    descripcion: "Reloj de esfera minimalista y bisel dorado, correa metálica ajustable. Un básico atemporal que combina con cualquier estilo.",
    tallas: ["Talla única"]
  },
  {
    id: "reloj-deportivo-acero",
    nombre: "Reloj Deportivo Acero",
    categoria: "Relojes",
    precio: 99.90,
    imagen: "https://placehold.co/800x800/1b1815/e3c184?text=IMPERIOWATCH",
    descripcion: "Reloj deportivo con correa de acero eslabonado, sumergible hasta 10 ATM e iluminación nocturna. Robusto y funcional.",
    tallas: ["Talla única"]
  },
  {
    id: "cartera-piel-negra",
    nombre: "Cartera de Piel Negra",
    categoria: "Carteras",
    precio: 29.90,
    imagen: "assets/productos/carteragoyard.png",
    descripcion: "Cartera de piel genuina con múltiples compartimentos para tarjetas, billetes y monedas. Costuras reforzadas y acabado mate.",
    tallas: ["Negro", "Marrón"]
  },
  {
    id: "cartera-tarjetero-slim",
    nombre: "Tarjetero Slim",
    categoria: "Carteras",
    precio: 19.90,
    imagen: "https://placehold.co/800x800/141210/c6a15b?text=IMPERIOWATCH",
    descripcion: "Tarjetero delgado de perfil bajo, ideal para llevar en el bolsillo delantero. Capacidad para hasta 6 tarjetas y billetes doblados.",
    tallas: ["Negro", "Marrón", "Gris"]
  },
  {
    id: "cinturon-cuero-clasico",
    nombre: "Cinturón de Cuero Clásico",
    categoria: "Cinturones",
    precio: 24.90,
    imagen: "assets/productos/lvcinturon.webp",
    descripcion: "Cinturón de cuero genuino con hebilla metálica de acabado dorado. Versátil para looks formales e informales.",
    tallas: ["90 cm", "100 cm", "110 cm", "120 cm"]
  },
  {
    id: "cinturon-reversible-negro-marron",
    nombre: "Cinturón Reversible Negro/Marrón",
    categoria: "Cinturones",
    precio: 27.90,
    imagen: "https://placehold.co/800x800/141210/c6a15b?text=IMPERIOWATCH",
    descripcion: "Cinturón reversible con hebilla giratoria: dos colores en una sola pieza. Práctico y elegante para cualquier ocasión.",
    tallas: ["90 cm", "100 cm", "110 cm", "120 cm"]
  },
];

function getProducto(id){
  return PRODUCTOS.find(p => p.id === id);
}

function getCategorias(){
  return [...new Set(PRODUCTOS.map(p => p.categoria))];
}
