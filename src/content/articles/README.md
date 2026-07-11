# Cómo agregar un nuevo artículo

Para crear un nuevo artículo, copia uno de los archivos `.md` existentes y cambia el nombre siguiendo este formato:

```text
2026-07-10-titulo-del-articulo.md
```

Usa siempre:

- Fecha al inicio: `año-mes-día`
- Palabras separadas con guiones
- Sin espacios ni tildes en el nombre del archivo
- Extensión `.md`

La página de inicio mostrará automáticamente los últimos 3 artículos según la fecha del nombre del archivo. No hace falta marcar artículos como destacados.

## Plantilla

```md
---
title: "Título del artículo"
slug: "titulo-del-articulo"
date: "10 de julio de 2026"
category: "Opinión"
excerpt: "Resumen breve del artículo en una o dos líneas."
readingTime: "5 min de lectura"
---

Por Vladimir Huarachi Copa

Aquí empieza el artículo.

Cada párrafo debe estar separado por una línea en blanco.
```

## Campos importantes

- `title`: título visible del artículo.
- `slug`: dirección del artículo. Debe ir sin espacios, sin tildes y con guiones.
- `date`: fecha visible en la web.
- `category`: categoría del artículo.
- `excerpt`: resumen corto para tarjetas y listados.
- `readingTime`: tiempo aproximado de lectura.

Después de guardar el archivo en GitHub, Vercel actualizará la web automáticamente.
