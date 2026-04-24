// Script dijalankan saat build di Netlify
// Membaca _berita/*.md dan generate berita.json

try {
  const fs   = require('fs');
  const path = require('path');

  const beritaDir  = path.join(__dirname, '_berita');
  const outputFile = path.join(__dirname, 'berita.json');

  // Jika folder tidak ada atau kosong, tulis array kosong
  if (!fs.existsSync(beritaDir)) {
    fs.writeFileSync(outputFile, '[]');
    console.log('✅ berita.json: folder _berita tidak ditemukan, ditulis kosong');
    process.exit(0);
  }

  const files = fs.readdirSync(beritaDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  if (files.length === 0) {
    fs.writeFileSync(outputFile, '[]');
    console.log('✅ berita.json: tidak ada file .md, ditulis kosong');
    process.exit(0);
  }

  const beritaList = [];

  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(beritaDir, file), 'utf-8');
      const match   = content.match(/^---\n([\s\S]*?)\n---/);
      if (!match) return;

      const frontmatter = match[1];
      const body        = content.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();

      const get = (key) => {
        const m = frontmatter.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'));
        return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
      };

      if (get('published') === 'false') return;

      beritaList.push({
        title    : get('title'),
        date     : get('date'),
        kategori : get('kategori'),
        foto     : get('foto'),
        ringkasan: get('ringkasan'),
        featured : get('featured') === 'true',
        published: true
      });
    } catch (e) {
      console.warn('⚠️ Skip file error:', file, e.message);
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(beritaList, null, 2));
  console.log('✅ berita.json generated:', beritaList.length, 'berita');

} catch (e) {
  console.error('❌ build-berita.js error:', e.message);
  process.exit(1);
}
