# La Bitacora de un ABAPer

Blog tecnico personal sobre ABAP, RAP, SAP, OData, Fiori Elements, bgPF, integraciones, buenas practicas y errores comunes.

Autor: Cesar David Sanchez Saldana

## Requisitos

- Node.js 24.16.0 o compatible.
- pnpm 10.29.3.

Este proyecto usa exclusivamente pnpm. No uses npm ni yarn para instalar dependencias.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

El servidor local usa el puerto configurado por la plantilla, normalmente `http://localhost:5000`. Si ese puerto esta ocupado, la plantilla puede usar `http://localhost:5001`.

## Crear un nuevo articulo

Los posts viven en `src/content/posts` y deben crearse con estructura folder-based para que Obsidian pueda guardar imagenes y recursos junto al articulo.

Ejemplo:

```text
src/content/posts/
+-- buenas-practicas-abap-evitar-select-dentro-de-loop/
    +-- index.md
    +-- diagrama.png
```

Frontmatter recomendado para `index.md`:

```markdown
---
title: Titulo del articulo
description: Resumen breve para SEO y listados.
date: 2026-06-08
updatedDate: 2026-06-08
author: Cesar David Sanchez Saldana
category: ABAP
tags:
  - ABAP
  - Buenas practicas
draft: false
---

Contenido del articulo.
```

Usa `draft: true` para ocultar borradores en produccion.

## Escribir desde Obsidian

Abre la carpeta `src/content` como vault de Obsidian.

- Crea nuevos posts en `posts/<slug-del-articulo>/index.md`.
- Guarda imagenes, capturas, diagramas y adjuntos en la misma carpeta del post.
- Crea paginas estaticas en `pages`.
- Usa tags compatibles con el frontmatter mostrado arriba.
- Puedes usar wikilinks, embeds, Mermaid y otras capacidades de Astro Modular si la plantilla las soporta.
- Astro Composer esta configurado para crear posts en modo carpeta usando `index.md`.
- Image Manager esta configurado para colocar adjuntos en la misma carpeta de la nota.

Flujo sugerido:

```bash
git status
git add src/content
git commit -m "Add new ABAP post"
git push
```

## GitHub Pages

El sitio esta configurado inicialmente para:

- `site`: `https://cdss2021.github.io`
- `base`: `/la-bitacora-de-un-abaper`

En GitHub, ve a `Settings > Pages` y selecciona:

- Source: GitHub Actions.

El workflow `.github/workflows/deploy.yml` instala dependencias con:

```bash
pnpm install --frozen-lockfile
```

y compila con:

```bash
pnpm build
```

Cuando el workflow termine correctamente, valida la publicacion en:

```text
https://cdss2021.github.io/la-bitacora-de-un-abaper/
```

## Comentarios con Giscus

La plantilla ya incluye un componente Giscus en `src/components/GiscusComments.astro`. La configuracion vive en `src/config.ts`, dentro de `siteConfig.postOptions.comments`.

Para activarlo:

1. En GitHub, habilita Discussions en el repositorio.
2. Instala o habilita la app de Giscus para el repositorio.
3. Entra a `https://giscus.app` y genera la configuracion.
4. Reemplaza estos valores en `src/config.ts`:

```ts
enabled: true,
repo: "CDSS2021/la-bitacora-de-un-abaper",
repoId: "REEMPLAZAR_REPO_ID",
category: "Announcements",
categoryId: "REEMPLAZAR_CATEGORY_ID",
mapping: "pathname",
```

No se usa base de datos propia para comentarios en esta version.

## Cambiar a dominio propio

Para un dominio como `zetabap.dev`, ajusta `astro.config.mjs`:

```js
site: "https://zetabap.dev",
base: "/",
```

Tambien actualiza `src/config.ts`:

```ts
site: "https://zetabap.dev",
```

En GitHub Pages deberas configurar el dominio personalizado, crear el registro DNS correspondiente y, si aplica, agregar el archivo `CNAME` con el dominio.

## Categorias principales

- ABAP
- RAP
- OData
- Fiori Elements
- bgPF
- SAP Integration
- Buenas practicas
- Errores comunes
- Performance
- Arquitectura SAP

## Estructura relevante

- `src/config.ts`: identidad del sitio, navegacion, comentarios y opciones de la plantilla.
- `astro.config.mjs`: configuracion de Astro, GitHub Pages y Markdown.
- `src/content/posts`: articulos del blog.
- `src/content/pages`: paginas estaticas.
- `.github/workflows/deploy.yml`: despliegue a GitHub Pages.
