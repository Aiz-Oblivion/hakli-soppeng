// Script ini dijalankan saat build di Netlify
// Membaca semua file _berita/*.md dan generate berita.json

const fs = require('fs');
const path = require('path');

const beritaDir = path.join(__dirname, '_berita');
const outputFile = path.join(__dirname, 'berita.json');

if (!fs.existsSync(beritaDir)) {
  fs.writeFileSync(outputFile, '[]');
  process.exit(0);
}

const files = fs.readdirSync(beritaDir)
  .filter(f => f.endsWith('.md'))
  .sort()
  .reverse(); // terbaru dulu

const beritaList = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(beritaDir, file), 'utf-8');

  // Parse frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return;

  const frontmatter = match[1];
  const body = content.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();

  const get = (key) => {
    const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
  };

  const published = get('published');
  if (published === 'false') return;

  beritaList.push({
    title: get('title'),
    date: get('date'),
    kategori: get('kategori'),
    foto: get('foto'),
    ringkasan: get('ringkasan'),
    featured: get('featured') === 'true',
    published: true,
    isi: body.substring(0, 300)
  });
});

fs.writeFileSync(outputFile, JSON.stringify(beritaList, null, 2));
console.log(`✅ Generated berita.json with ${beritaList.length} entries`);
