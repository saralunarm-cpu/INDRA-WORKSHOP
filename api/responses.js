// Indra — Vercel serverless function
// Lee la hoja de respuestas del Google Form (publicada como CSV),
// la combina con los miembros fundadores y devuelve los perfiles en JSON.
// La página calcula los matches a partir de estos perfiles.

const SHEET_CSV_URL =
  process.env.SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDz1-fwRZMpPLP3fZD2tIat6yruu6xfcFlNCDUplqYwbRSOTCnRRY_syQrpYtza3LU2gRtvbZtPxTM/pub?output=csv";

// ---- Categorías canónicas (deben coincidir con las del formulario y la página) ----
const CANON = [
  "Idioma / Alemán", "Comida", "Movilidad", "Video / Foto / Media", "Jardín",
  "Comunidad", "Salud", "Trámites", "Tecnología", "Vivienda y alojamiento",
  "Empleo y trabajo", "Educación y clases", "Familia y niñez", "Ropa y objetos",
  "Legal y migración", "Otro"
];

function norm(s) {
  return (s == null ? "" : String(s))
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/\s+/g, " ").trim();
}
const CANON_NORM = CANON.map(norm);
function canonCat(s) {
  const n = norm(s);
  const i = CANON_NORM.indexOf(n);
  if (i >= 0) return CANON[i];
  if (n.includes("otro")) return "Otro";
  return String(s).trim();
}
function splitCats(cell) {
  if (!cell) return [];
  const out = [];
  String(cell).split(/[,;]+/).forEach(function (x) {
    const t = x.trim();
    if (t) { const c = canonCat(t); if (out.indexOf(c) < 0) out.push(c); }
  });
  return out;
}

// ---- Parser CSV robusto (maneja comillas y saltos de línea internos) ----
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", i = 0, inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      field += c; i++; continue;
    } else {
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++; continue;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// ---- Localiza columnas por palabras clave del encabezado ----
function mapColumns(header) {
  const H = header.map(norm);
  function find(pred) { for (let i = 0; i < H.length; i++) if (pred(H[i])) return i; return -1; }
  return {
    nombre:      find(h => h.includes("nombre")),
    correo:      find(h => h.includes("correo") || h.includes("email") || h.includes("mail")),
    bio:         find(h => h.includes("bio") || h.includes("perfil")),
    residencia:  find(h => h.includes("residencia") || h.includes("lugar")),
    ofreceTexto: find(h => h.includes("ofrecer") || (h.includes("puedes dar"))),
    ofreceCats:  find(h => h.includes("categoria") && h.includes("puedes")),
    recibeTexto: find(h => h.includes("recibir") || h.includes("ayudarte")),
    recibeCats:  find(h => h.includes("categoria") && (h.includes("necesitas") || h.includes("recibir")))
  };
}

// ---- Miembros fundadores (precargados) ----
const SEEDS = [
  { name: "Paul", email: "schwarzpail.paul@googlemail.com", residencia: "Berlin",
    bio: "Construcción de casas, ingeniería civil y trabajo físico.",
    offerText: "Construcción, ingeniería civil, problemas estructurales, licencia y carro, cocina, alemán",
    offerCats: ["Movilidad", "Comida", "Idioma / Alemán", "Vivienda y alojamiento", "Empleo y trabajo"],
    needText: "Comida y recetas", needCats: ["Comida"] },
  { name: "Marita", email: "mradajewshi@googlemail.com", residencia: "Berlin",
    bio: "Jardín, traducción y gramática de alemán y español.",
    offerText: "Jardín, gramática de alemán y español, traducción, carro y conducción",
    offerCats: ["Jardín", "Idioma / Alemán", "Movilidad"],
    needText: "Computación, IA y ayuda en tecnología", needCats: ["Tecnología"] },
  { name: "Marilyn", email: "marilyn@masterpeace.org", residencia: "Berlin",
    bio: "Conexiones de comunidades y artistas, arte terapia y radio digital.",
    offerText: "Conexiones y base de contactos, movimiento y arte terapia, apoyo logístico, arepas, karaoke, estudio de arte y música, bicicleta, radio digital",
    offerCats: ["Comunidad", "Comida", "Video / Foto / Media", "Educación y clases", "Movilidad"],
    needText: "Logística, fotografía y video, comunicación y media, carros, alguien que maneje, talleres de arte, jardinería",
    needCats: ["Video / Foto / Media", "Movilidad", "Jardín", "Educación y clases"] },
  { name: "Rebeca", email: "Rebecca.desantana@gmail.com", residencia: "Berlin",
    bio: "Videos y edición, comida de Brasil, croché y asesoría en burocracia.",
    offerText: "Videos y edición, enseñar y dar comida de Brasil, croché-tejido, asesoría en administración y burocracia",
    offerCats: ["Video / Foto / Media", "Comida", "Ropa y objetos", "Trámites"],
    needText: "Cómo buscar trabajo y portafolio, trámites burocráticos, financiero, postular a la ayuda social, alemán",
    needCats: ["Empleo y trabajo", "Trámites", "Idioma / Alemán"] },
  { name: "Dolly", email: "berlin@casalatinoamericana.de", residencia: "Berlin",
    bio: "Sopita y café, vida alemana, visas y organizaciones.",
    offerText: "Sopita y café, libros, vida alemana, visas, organizaciones",
    offerCats: ["Comida", "Idioma / Alemán", "Legal y migración", "Comunidad"],
    needText: "Participación y creación de comunidad, videos, fotos y medios sociales",
    needCats: ["Comunidad", "Video / Foto / Media"] },
  { name: "Magali", email: "maganavarrete8@gmail.com", residencia: "Berlin",
    bio: "Paz y no violencia, autoconocimiento y nuevo humanismo.",
    offerText: "Paz y no violencia, autoconocimiento, nuevo humanismo",
    offerCats: ["Comunidad"],
    needText: "Nuevas redes, nuevas tecnologías, voluntarios, choferes",
    needCats: ["Tecnología", "Movilidad", "Comunidad"] },
  { name: "Melisa", email: "Alisongomezm01@gmail.com", residencia: "Berlin",
    bio: "Contacto en redes de médicos y comunidad latina.",
    offerText: "Contacto en redes de médicos, comunidad latina",
    offerCats: ["Salud", "Comunidad"],
    needText: "Espacios de dispersión y salud latina",
    needCats: ["Salud", "Comunidad"] },
  { name: "Alfonso", email: "Intercambiojusto@yahoo.es", residencia: "Berlin",
    bio: "Procesos de organización, cocina y medio ambiente.",
    offerText: "Procesos de organización, cocina, medio ambiente",
    offerCats: ["Comunidad", "Comida", "Jardín"],
    needText: "Alemán y asesoría médica",
    needCats: ["Idioma / Alemán", "Salud"] }
];

// ---- Construye la lista de perfiles a partir del CSV + fundadores ----
function buildProfiles(csvText) {
  const rows = parseCSV(csvText).filter(r => r.some(c => (c || "").trim() !== ""));
  const out = [];
  if (rows.length > 1) {
    const col = mapColumns(rows[0]);
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const get = i => (i >= 0 && i < row.length ? String(row[i] || "").trim() : "");
      const name = get(col.nombre);
      if (!name) continue;
      out.push({
        name: name,
        email: get(col.correo),
        bio: get(col.bio),
        residencia: get(col.residencia),
        offerText: get(col.ofreceTexto),
        offerCats: splitCats(get(col.ofreceCats)),
        needText: get(col.recibeTexto),
        needCats: splitCats(get(col.recibeCats)),
        source: "form"
      });
    }
  }

  // Combinar con fundadores: la respuesta del formulario gana si coincide el correo/nombre
  const seeds = SEEDS.map(s => Object.assign({ source: "fundador" }, s,
    { offerText: s.offerText, needText: s.needText }));
  const byKey = new Map();
  const keyOf = p => (p.email && p.email.trim() ? "e:" + norm(p.email) : "n:" + norm(p.name));
  seeds.forEach(p => byKey.set(keyOf(p), p));
  out.forEach(p => byKey.set(keyOf(p), p)); // form overrides seed
  return Array.from(byKey.values());
}

async function fetchCSV(url) {
  const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "IndraBot/1.0" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return await res.text();
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  let profiles, source = "live", error = null;
  try {
    const csv = await fetchCSV(SHEET_CSV_URL);
    profiles = buildProfiles(csv);
  } catch (e) {
    error = String(e && e.message || e);
    source = "seeds-only";
    profiles = SEEDS.map(s => Object.assign({ source: "fundador" }, s));
  }
  res.status(200).json({
    updatedAt: new Date().toISOString(),
    count: profiles.length,
    source: source,
    error: error,
    categories: CANON,
    profiles: profiles
  });
};

// Exportado para pruebas locales
module.exports.buildProfiles = buildProfiles;
module.exports.parseCSV = parseCSV;
module.exports.splitCats = splitCats;
