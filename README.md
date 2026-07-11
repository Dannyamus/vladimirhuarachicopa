# Vladimir Huarachi Copa

Sitio web frontend para la publicación de artículos de Vladimir Huarachi Copa.

## Desarrollo local

```bash
npm install
npm start
```

El sitio local se abre normalmente en:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

Antes de compilar, el proyecto genera automáticamente `src/app/core/data/articles.ts` desde los archivos Markdown ubicados en:

```text
src/content/articles
```

No editar manualmente `src/app/core/data/articles.ts`.

## Artículos

Los artículos se editan como archivos `.md` dentro de:

```text
src/content/articles
```

La página de inicio muestra automáticamente los últimos 3 artículos según la fecha del nombre del archivo.

## Panel Decap CMS

El panel está disponible en:

```text
/admin
```

Los usuarios deben tener permisos en GitHub para guardar cambios en el repositorio.

Importante: en Vercel, Decap CMS necesita un proveedor OAuth compatible con GitHub para poder iniciar sesión y escribir en el repositorio. La interfaz ya está preparada en `public/admin`, pero el login debe completarse con una configuración OAuth/GitHub compatible.
