// ================================================
// DATOS DEL ASESOR — etiquetas de cada producto
// Sirven para recomendar (asesor guiado) y para que el chat conozca el catálogo.
// Cuando añadas un producto a productos.js, añade aquí su línea con el MISMO id.
//
//   tipo:     "reloj" | "pack"
//   marca:    texto libre (usa la misma abreviatura que en el nombre del producto)
//   estilo:   elegante | deportivo | llamativo | discreto
//   color:    dorado | plateado | negro | azul | blanco | colorido | verde
//   diamantes: true si es una versión "iced out"
// ================================================
const ASESOR_TAGS = {
  // ---- Relojes ----
  "rolex-batgirl":                   { tipo:"reloj", marca:"Rlx", estilo:["deportivo","elegante"],              color:["plateado","azul","negro"] },
  "rolex-rootbeer":                  { tipo:"reloj", marca:"Rlx", estilo:["elegante","llamativo"],              color:["dorado"] },
  "rolex-batman":                    { tipo:"reloj", marca:"Rlx", estilo:["deportivo"],                         color:["plateado","azul","negro"] },
  "rolex-yacht-master":              { tipo:"reloj", marca:"Rlx", estilo:["deportivo","elegante"],              color:["dorado","negro"] },
  "rolex-bruce-wayne":               { tipo:"reloj", marca:"Rlx", estilo:["deportivo","discreto"],              color:["plateado","negro"] },
  "rolex-oro-efera-celeste":         { tipo:"reloj", marca:"Rlx", estilo:["elegante","llamativo"],              color:["dorado","azul"] },
  "rolex-daytona-amarillo-dorado":   { tipo:"reloj", marca:"Rlx", estilo:["llamativo","elegante"],              color:["dorado"] },
  "rolex-daytona-plata":             { tipo:"reloj", marca:"Rlx", estilo:["elegante","discreto","deportivo"],   color:["plateado"] },
  "rolex-dorado-cierre-goma":        { tipo:"reloj", marca:"Rlx", estilo:["deportivo","llamativo"],             color:["dorado","negro"] },
  "rolex-yacht-master-esfera-azul":  { tipo:"reloj", marca:"Rlx", estilo:["elegante","deportivo"],              color:["plateado","azul"] },
  "rolex-yacht-master-42-titanio":   { tipo:"reloj", marca:"Rlx", estilo:["deportivo","discreto"],              color:["plateado","negro"] },

  "cartier-diamantes-negros":        { tipo:"reloj", marca:"Crtr", estilo:["llamativo"],                        color:["negro"], diamantes:true },
  "cartier-santos-negro":            { tipo:"reloj", marca:"Crtr", estilo:["elegante","discreto"],              color:["negro"] },
  "cartier-santos-azul":             { tipo:"reloj", marca:"Crtr", estilo:["elegante"],                         color:["plateado","azul"] },
  "cartier-santos-blanco":           { tipo:"reloj", marca:"Crtr", estilo:["elegante","discreto"],              color:["plateado","blanco"] },

  "omega-snoopy":                    { tipo:"reloj", marca:"Om x Sw", estilo:["deportivo","llamativo"],         color:["blanco","colorido"] },

  "richard-mille-rafael-nadal":      { tipo:"reloj", marca:"RM", estilo:["deportivo","llamativo"],              color:["azul","negro"] },
  "richard-mille-rafael-nadal-blanco":{ tipo:"reloj", marca:"RM", estilo:["deportivo","llamativo"],             color:["blanco"] },
  "richard-mille-rafael-nadal-negro":{ tipo:"reloj", marca:"RM", estilo:["deportivo","discreto"],               color:["negro"] },
  "richard-mille-rm-53-01-azul":     { tipo:"reloj", marca:"RM", estilo:["llamativo","deportivo"],              color:["azul"] },
  "richard-mille-rm-53-01-negro":    { tipo:"reloj", marca:"RM", estilo:["llamativo"],                          color:["negro"] },
  "richard-mille-rm-11-03-amarillo": { tipo:"reloj", marca:"RM", estilo:["llamativo","deportivo"],              color:["blanco","colorido"] },

  "ap-dorado":                       { tipo:"reloj", marca:"AP", estilo:["elegante","llamativo"],               color:["dorado"] },
  "ap-negro":                        { tipo:"reloj", marca:"AP", estilo:["elegante","discreto"],                color:["negro"] },
  "ap-oro-rosa":                     { tipo:"reloj", marca:"AP", estilo:["elegante"],                           color:["dorado"] },
  "ap-plata-celeste":                { tipo:"reloj", marca:"AP", estilo:["elegante","discreto"],                color:["plateado","azul"] },
  "ap-perlado-blanco":               { tipo:"reloj", marca:"AP", estilo:["llamativo"],                          color:["plateado","blanco"], diamantes:true },
  "ap-perlado-negro":                { tipo:"reloj", marca:"AP", estilo:["llamativo"],                          color:["negro"], diamantes:true },

  // ---- Packs cinturón y cartera ----
  "pack-lv-dorado":                  { tipo:"pack", marca:"LV",   estilo:["elegante","llamativo"],               color:["dorado"] },
  "pack-lv-plata":                   { tipo:"pack", marca:"LV",   estilo:["elegante"],                           color:["plateado"] },
  "pack-hermes-dorado":              { tipo:"pack", marca:"Hrms", estilo:["elegante","llamativo"],               color:["dorado"] },
  "pack-hermes-plata":               { tipo:"pack", marca:"Hrms", estilo:["elegante"],                           color:["plateado"] },
  "pack-gucci-negro":                { tipo:"pack", marca:"GC",   estilo:["elegante","discreto"],                color:["negro"] },
  "pack-gucci-verde-negro":          { tipo:"pack", marca:"GC",   estilo:["elegante","llamativo"],               color:["negro","verde"] }
};