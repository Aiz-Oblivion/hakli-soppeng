// Script dijalankan saat build di Netlify
// Generate berita.json + halaman detail berita/[slug].html

try {
  const fs   = require('fs');
  const path = require('path');

  const beritaDir  = path.join(__dirname, '_berita');
  const outputJson = path.join(__dirname, 'berita.json');
  const outputDir  = path.join(__dirname, 'berita');

  // Pastikan folder berita/ ada
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Jika folder _berita tidak ada atau kosong
  if (!fs.existsSync(beritaDir)) {
    fs.writeFileSync(outputJson, '[]');
    console.log('✅ berita.json: kosong (folder _berita tidak ada)');
    process.exit(0);
  }

  const files = fs.readdirSync(beritaDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  if (files.length === 0) {
    fs.writeFileSync(outputJson, '[]');
    console.log('✅ berita.json: kosong (tidak ada file .md)');
    process.exit(0);
  }

  const beritaList = [];

  // Fungsi konversi markdown sederhana ke HTML
  function mdToHtml(md) {
    return md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul])/gm, '')
      .trim();
  }

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

      // Buat slug dari nama file
      const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');

      const berita = {
        title    : get('title'),
        date     : get('date'),
        kategori : get('kategori'),
        foto     : get('foto'),
        ringkasan: get('ringkasan'),
        featured : get('featured') === 'true',
        published: true,
        slug     : slug,
        url      : '/berita/' + slug + '.html'
      };

      beritaList.push(berita);

      // Generate halaman HTML detail
      const fotoHtml = berita.foto
        ? `<img src="${berita.foto}" alt="${berita.title}" class="berita-detail-img" />`
        : '';

      const bodyHtml = body
        ? `<div class="berita-body"><p>${mdToHtml(body)}</p></div>`
        : '';

      const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${berita.title} - HAKLI Soppeng</title>
  <link rel="stylesheet" href="/style.css" />
  <link rel="stylesheet" href="/berita/berita.css" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>
  <div id="navbar-placeholder"></div>

  <section class="berita-hero">
    <div class="container berita-hero-content">
      <a href="/#berita" class="back-link"><i class="fas fa-arrow-left"></i> Kembali ke Berita</a>
      <span class="news-tag-hero">${berita.kategori || 'Berita'}</span>
      <h1>${berita.title}</h1>
      <div class="berita-meta">
        <span><i class="fas fa-calendar"></i> ${berita.date}</span>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container berita-detail-container">
      <div class="berita-detail-main">
        ${fotoHtml}
        <p class="berita-ringkasan">${berita.ringkasan}</p>
        ${bodyHtml}
      </div>
      <aside class="berita-detail-sidebar">
        <div class="sidebar-card">
          <h3><i class="fas fa-newspaper"></i> Informasi</h3>
          <ul>
            <li><span>Kategori</span><strong>${berita.kategori || 'Berita'}</strong></li>
            <li><span>Tanggal</span><strong>${berita.date}</strong></li>
          </ul>
        </div>
        <div class="sidebar-card">
          <h3><i class="fas fa-share-nodes"></i> Bagikan</h3>
          <div class="share-buttons">
            <a href="https://wa.me/?text=${encodeURIComponent(berita.title + ' - HAKLI Soppeng')}" target="_blank" class="share-btn wa"><i class="fab fa-whatsapp"></i> WhatsApp</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=" target="_blank" class="share-btn fb"><i class="fab fa-facebook-f"></i> Facebook</a>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <div id="footer-placeholder"></div>
  <script src="/components.js"></script>
</body>
</html>`;

      fs.writeFileSync(path.join(outputDir, slug + '.html'), html);
      console.log('✅ Generated:', slug + '.html');

    } catch (e) {
      console.warn('⚠️ Skip:', file, e.message);
    }
  });

  fs.writeFileSync(outputJson, JSON.stringify(beritaList, null, 2));
  console.log('✅ berita.json generated:', beritaList.length, 'berita');

} catch (e) {
  console.error('❌ Error:', e.message);
  process.exit(1);
}
