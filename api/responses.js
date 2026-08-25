// Indra — lee la hoja del Google Form (CSV publicado) y devuelve Person[]
// en el formato del diseño (categoryId por área). Incluye fundadores.

const SHEET_CSV_URL =
  process.env.SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDz1-fwRZMpPLP3fZD2tIat6yruu6xfcFlNCDUplqYwbRSOTCnRRY_syQrpYtza3LU2gRtvbZtPxTM/pub?output=csv";

// label del formulario -> id de categoría del diseño
const LABEL2ID = {
  "idioma / aleman": "idioma", "comida": "comida", "movilidad": "movilidad",
  "video / foto / media": "media", "jardin": "jardin", "comunidad": "comunidad",
  "salud": "salud", "tramites": "tramites", "tecnologia": "tecnologia",
  "vivienda y alojamiento": "vivienda", "empleo y trabajo": "empleo",
  "educacion y clases": "educacion", "familia y ninez": "familia",
  "ropa y objetos": "ropa", "legal y migracion": "legal"
};
function norm(s){return (s==null?"":String(s)).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\s+/g," ").trim();}
function toId(label){ return LABEL2ID[norm(label)] || null; }
function splitCats(cell){
  if(!cell) return [];
  const out=[];
  String(cell).split(/[,;]+/).forEach(function(x){ const id=toId(x.trim()); if(id && out.indexOf(id)<0) out.push(id); });
  return out;
}
function initialOf(name){ const t=String(name||"").trim(); return (t?t[0]:"?").toUpperCase(); }
function slug(s){ return norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "p"; }

function parseCSV(text){
  const rows=[]; let row=[],field="",i=0,q=false;
  while(i<text.length){ const c=text[i];
    if(q){ if(c=='"'){ if(text[i+1]=='"'){field+='"';i+=2;continue;} q=false;i++;continue;} field+=c;i++;continue; }
    if(c=='"'){q=true;i++;continue;}
    if(c==','){row.push(field);field="";i++;continue;}
    if(c=='\r'){i++;continue;}
    if(c=='\n'){row.push(field);rows.push(row);row=[];field="";i++;continue;}
    field+=c;i++;
  }
  if(field.length||row.length){row.push(field);rows.push(row);}
  return rows;
}
function mapCols(header){
  const H=header.map(norm); const f=p=>{for(let i=0;i<H.length;i++)if(p(H[i]))return i;return -1;};
  return {
    nombre:f(h=>h.includes("nombre")), correo:f(h=>h.includes("correo")||h.includes("mail")),
    bio:f(h=>h.includes("bio")||h.includes("perfil")), ciudad:f(h=>h.includes("residencia")||h.includes("lugar")),
    ofreceTxt:f(h=>h.includes("ofrecer")||h.includes("puedes dar")),
    ofreceCats:f(h=>h.includes("categoria")&&h.includes("puedes")),
    recibeCats:f(h=>h.includes("categoria")&&(h.includes("necesitas")||h.includes("recibir")))
  };
}

const SEEDS = [
  {id:"paul",name:"Paul",city:"Berlín",isFounder:true,accent:"movilidad",offers:["movilidad","comida","idioma","vivienda","empleo"],offerDetail:"Construcción, ingeniería civil, licencia y carro, cocina, alemán",needs:["comida"],bio:"Construcción de casas, ingeniería civil y trabajo físico.",email:"schwarzpail.paul@googlemail.com"},
  {id:"marita",name:"Marita",city:"Berlín",isFounder:true,accent:"jardin",offers:["jardin","idioma","movilidad"],offerDetail:"Jardín, gramática de alemán y español, traducción, conducción",needs:["tecnologia"],bio:"Jardín, traducción y gramática de alemán y español.",email:"mradajewshi@googlemail.com"},
  {id:"marilyn",name:"Marilyn",city:"Berlín",isFounder:true,accent:"comunidad",offers:["comunidad","comida","media","educacion","movilidad"],offerDetail:"Conexiones y contactos, arte terapia, arepas, karaoke, radio digital",needs:["media","movilidad","jardin","educacion"],bio:"Conexiones de comunidades y artistas, arte terapia y radio digital.",email:"marilyn@masterpeace.org"},
  {id:"rebeca",name:"Rebeca",city:"Berlín",isFounder:true,accent:"media",offers:["media","comida","ropa","tramites"],offerDetail:"Videos y edición, comida de Brasil, croché, asesoría en burocracia",needs:["empleo","tramites","idioma"],bio:"Videos y edición, comida de Brasil, croché y burocracia.",email:"Rebecca.desantana@gmail.com"},
  {id:"dolly",name:"Dolly",city:"Berlín",isFounder:true,accent:"comida",offers:["comida","idioma","legal","comunidad"],offerDetail:"Sopita y café, libros, vida alemana, visas, organizaciones",needs:["comunidad","media"],bio:"Sopita y café, vida alemana, visas y organizaciones.",email:"berlin@casalatinoamericana.de"},
  {id:"magali",name:"Magali",city:"Berlín",isFounder:true,accent:"comunidad",offers:["comunidad"],offerDetail:"Paz y no violencia, autoconocimiento, nuevo humanismo",needs:["tecnologia","movilidad","comunidad"],bio:"Paz y no violencia, autoconocimiento y nuevo humanismo.",email:"maganavarrete8@gmail.com"},
  {id:"melisa",name:"Melisa",city:"Berlín",isFounder:true,accent:"salud",offers:["salud","comunidad"],offerDetail:"Contacto en redes de médicos, comunidad latina",needs:["salud","comunidad"],bio:"Contacto en redes de médicos y comunidad latina.",email:"Alisongomezm01@gmail.com"},
  {id:"alfonso",name:"Alfonso",city:"Berlín",isFounder:true,accent:"comunidad",offers:["comunidad","comida","jardin"],offerDetail:"Procesos de organización, cocina, medio ambiente",needs:["idioma","salud"],bio:"Procesos de organización, cocina y medio ambiente.",email:"Intercambiojusto@yahoo.es"}
];

function buildPeople(csv){
  const rows=parseCSV(csv).filter(r=>r.some(c=>(c||"").trim()!==""));
  const form=[];
  if(rows.length>1){
    const col=mapCols(rows[0]);
    for(let r=1;r<rows.length;r++){
      const row=rows[r]; const g=i=>(i>=0&&i<row.length?String(row[i]||"").trim():"");
      const name=g(col.nombre); if(!name) continue;
      const offers=splitCats(g(col.ofreceCats)); const needs=splitCats(g(col.recibeCats));
      form.push({ id:slug(name)+"-"+r, name, city:g(col.ciudad)||"Berlín", isFounder:false,
        accent: offers[0]||"comunidad", offers, offerDetail:g(col.ofreceTxt),
        needs, bio:g(col.bio), email:g(col.correo), initial:initialOf(name), source:"form" });
    }
  }
  const map=new Map();
  const key=p=>(p.email&&p.email.trim()?"e:"+norm(p.email):"n:"+norm(p.name));
  SEEDS.forEach(p=>map.set(key(p), Object.assign({initial:initialOf(p.name),source:"fundador"},p)));
  form.forEach(p=>map.set(key(p), p));
  return Array.from(map.values());
}

module.exports = async function handler(req,res){
  res.setHeader("Cache-Control","s-maxage=60, stale-while-revalidate=120");
  let people, source="live", error=null;
  try{
    const r=await fetch(SHEET_CSV_URL,{redirect:"follow"});
    if(!r.ok) throw new Error("HTTP "+r.status);
    people=buildPeople(await r.text());
  }catch(e){ error=String(e&&e.message||e); source="seeds-only";
    people=SEEDS.map(p=>Object.assign({initial:initialOf(p.name),source:"fundador"},p)); }
  res.status(200).json({ updatedAt:new Date().toISOString(), source, error, people });
};
module.exports.buildPeople=buildPeople;
