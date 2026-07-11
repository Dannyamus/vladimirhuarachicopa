import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const articlesDir = 'src/content/articles';
const outputFile = 'src/app/core/data/articles.ts';

function parseFrontMatter(source, fileName) {
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`${fileName} no tiene front matter válido entre ---`);
  }

  const meta = {};
  const frontMatter = match[1];
  const body = match[2].trim();

  for (const line of frontMatter.split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (value === 'true') meta[key] = true;
    else if (value === 'false') meta[key] = false;
    else meta[key] = value;
  }

  const fallbackSlug = basename(fileName, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const content = body
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, ' ').trim())
    .filter(Boolean);

  return {
    slug: meta.slug || fallbackSlug,
    title: meta.title,
    excerpt: meta.excerpt,
    category: meta.category || 'Opinión',
    date: meta.date,
    readingTime: meta.readingTime || 'Lectura',
    content,
  };
}

const articles = readdirSync(articlesDir)
  .filter((file) => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md')
  .sort((a, b) => b.localeCompare(a))
  .map((file) => parseFrontMatter(readFileSync(join(articlesDir, file), 'utf8'), file));

for (const article of articles) {
  for (const key of ['slug', 'title', 'excerpt', 'category', 'date', 'readingTime']) {
    if (!article[key]) {
      throw new Error(`El artículo ${article.slug || '(sin slug)'} no tiene el campo requerido: ${key}`);
    }
  }
}

const generated = `// Archivo generado automáticamente desde src/content/articles/*.md. No editar manualmente.\nimport { Article } from '../models/article';\n\nexport const ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};\n`;

writeFileSync(outputFile, generated, 'utf8');
console.log(`Generados ${articles.length} artículos en ${outputFile}`);

