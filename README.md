# Comunidad Indra — Red de reciprocidad (Vercel)

Página que muestra los **perfiles** y los **encuentros (matches)** de la comunidad.
Se alimenta **sola y en tiempo real** de tu Google Form: cada vez que alguien abre la
página, una función lee las respuestas más recientes de tu Google Sheet, arma los
perfiles y calcula los cruces entre lo que unas personas ofrecen y lo que otras
necesitan. Los 8 miembros fundadores vienen precargados.

## Archivos

- `index.html` — la página (diseño Indra, en modo claro).
- `api/responses.js` — función que lee tu Google Sheet (CSV publicado) y devuelve los perfiles en JSON.

## Cómo publicarlo en Vercel

### Opción A — GitHub + Vercel (recomendado, sin comandos)

1. Crea una cuenta gratis en **github.com** y en **vercel.com** (puedes entrar a Vercel con tu cuenta de GitHub).
2. En GitHub: **New repository** → ponle un nombre (ej. `indra`) → **Create**.
3. Dentro del repo: **Add file → Upload files** y sube **`index.html`** y la **carpeta `api`** (con `responses.js` dentro). Mantén la carpeta `api/` tal cual. Confirma con **Commit changes**.
4. En Vercel: **Add New… → Project** → elige el repositorio → **Deploy**.
5. En un minuto te da una URL tipo `https://indra.vercel.app`. ¡Eso es todo!

### Opción B — Vercel CLI (si prefieres terminal)

```bash
npm i -g vercel
cd indra-vercel
vercel          # sigue los pasos
vercel --prod   # publica la versión final
```

## Tu dominio propio

En el proyecto de Vercel → **Settings → Domains → Add** → escribe tu dominio
(ej. `indra.tudominio.org`) y sigue las instrucciones de DNS que te muestra Vercel.

## Requisitos para que se actualice solo

- Tu **Google Sheet de respuestas** debe seguir **Publicada en la web como CSV**
  (Archivo → Compartir → Publicar en la web → CSV). Ese enlace ya está puesto dentro
  de `api/responses.js` en la constante `SHEET_CSV_URL`.
- Si algún día cambias de hoja, edita `SHEET_CSV_URL` en `api/responses.js`, o crea
  una variable de entorno **`SHEET_CSV_URL`** en Vercel
  (Settings → Environment Variables) con el nuevo enlace.

## Notas

- La página cachea las respuestas ~1 minuto para no saturar a Google; los cambios del
  formulario aparecen a los pocos segundos/minutos.
- Los **miembros fundadores** están en `api/responses.js` (arreglo `SEEDS`): ahí puedes
  editarlos, corregir sus datos o quitarlos.
- Las **categorías** deben coincidir con las del formulario (arreglo `CANON` en
  `api/responses.js` y `CATS` en `index.html`).
- El botón **"Publica tu perfil"** apunta a tu Google Form; si cambias el formulario,
  actualiza esa URL en `index.html` (constante `FORM_URL`) y en el botón del `<header>`.
