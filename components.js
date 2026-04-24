// ===== SHARED NAVBAR & FOOTER =====

const navbarHTML = `
<nav class="navbar" id="navbar">
  <div class="container nav-container">
    <div class="nav-logo">
      <img src="/images/logo-hakli.png" alt="Logo HAKLI" class="logo-img"
        onerror="this.src='https://hakli.or.id/wp-content/uploads/2025/04/cropped-cropped-cropped-hakli-removebg-preview.png'" />
      <div>
        <span class="logo-title">HAKLI</span>
        <span class="logo-sub">Soppeng</span>
      </div>
    </div>
    <ul class="nav-links" id="navLinks">
      <li><a href="/" class="nav-link">Beranda</a></li>
      <li><a href="/#tentang" class="nav-link">Tentang</a></li>
      <li><a href="/#program" class="nav-link">Program</a></li>
      <li><a href="/#berita" class="nav-link">Berita</a></li>
      <li><a href="/#kontak" class="nav-link">Kontak</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

const footerHTML = `
<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <div class="nav-logo" style="margin-bottom:16px;">
        <img src="/images/logo-hakli.png" alt="Logo HAKLI" class="logo-img"
          onerror="this.src='https://hakli.or.id/wp-content/uploads/2025/04/cropped-cropped-cropped-hakli-removebg-preview.png'" />
        <div>
          <span class="logo-title" style="color:white;">HAKLI</span>
          <span class="logo-sub" style="color:rgba(255,255,255,0.5);">Soppeng</span>
        </div>
      </div>
      <p>Himpunan Ahli Kesehatan Lingkungan Indonesia Cabang Kabupaten Soppeng. Bersama membangun lingkungan sehat.</p>
    </div>
    <div class="footer-links">
      <h4>Navigasi</h4>
      <ul>
        <li><a href="/">Beranda</a></li>
        <li><a href="/#tentang">Tentang</a></li>
        <li><a href="/#program">Program</a></li>
        <li><a href="/#berita">Berita</a></li>
        <li><a href="/#kontak">Kontak</a></li>
      </ul>
    </div>
    <div class="footer-links">
      <h4>Program</h4>
      <ul>
        <li><a href="/program/sanitasi-air-bersih.html">Sanitasi Air Bersih</a></li>
        <li><a href="/program/pengelolaan-sampah.html">Pengelolaan Sampah</a></li>
        <li><a href="/program/sanitasi-rumah-sehat.html">Sanitasi Rumah Sehat</a></li>
        <li><a href="/program/penyuluhan-kesehatan.html">Penyuluhan Kesehatan</a></li>
        <li><a href="/program/pengendalian-vektor.html">Pengendalian Vektor</a></li>
      </ul>
    </div>
    <div class="footer-contact">
      <h4>Kontak</h4>
      <p><i class="fas fa-location-dot"></i> Jl. Salotungo, Watansoppeng, Sulawesi Selatan</p>
      <p><i class="fas fa-phone"></i> +62 812-3456-7890</p>
      <p><i class="fas fa-envelope"></i> hakli.soppeng@gmail.com</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 HAKLI Soppeng. Semua hak dilindungi.</p>
  </div>
</footer>`;

function initNavbar() {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Tandai active link
  const path = window.location.pathname;
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path.startsWith('/program') && href === '/#program')) {
      link.classList.add('active');
    }
  });
}

function renderComponents() {
  const navEl = document.getElementById('navbar-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.outerHTML = navbarHTML;
  if (footerEl) footerEl.outerHTML = footerHTML;
  initNavbar();
}

document.addEventListener('DOMContentLoaded', renderComponents);
