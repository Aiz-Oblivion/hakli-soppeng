// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// ===== HAMBURGER MENU =====
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

// ===== ACTIVE NAV =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 60 + 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = { threshold: 0.15 };

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// Card reveal observer
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.program-card').forEach(card => cardObserver.observe(card));

// ===== PROGRAM TOGGLE =====
const toggleBtn = document.getElementById('toggleProgram');
if (toggleBtn) {
  let expanded = false;
  toggleBtn.addEventListener('click', () => {
    expanded = !expanded;
    const hidden = document.querySelectorAll('.program-card-hidden');
    hidden.forEach((card, i) => {
      if (expanded) {
        card.classList.add('visible-extra');
        card.style.animationDelay = (i * 100) + 'ms';
        // trigger card observer
        setTimeout(() => card.classList.add('visible'), i * 100 + 400);
      } else {
        card.classList.remove('visible-extra', 'visible');
      }
    });
    toggleBtn.innerHTML = expanded
      ? '<i class="fas fa-chevron-up"></i> Sembunyikan'
      : '<i class="fas fa-th-large"></i> Lihat Semua Aspek Kerja';
  });
}
async function loadBerita() {
  const grid = document.getElementById('newsGrid');
  const empty = document.getElementById('newsEmpty');

  try {
    const res = await fetch('/berita.json?v=' + Date.now());
    if (!res.ok) throw new Error('Gagal memuat berita');
    const data = await res.json();

    const published = data.filter(b => b.published !== false);

    if (published.length === 0) {
      grid.style.display = 'none';
      empty.style.display = 'flex';
      return;
    }

    // Urutkan: featured dulu, lalu sisanya
    const sorted = [
      ...published.filter(b => b.featured),
      ...published.filter(b => !b.featured)
    ].slice(0, 6);

    grid.innerHTML = sorted.map((b, i) => {
      const isFeatured = i === 0 && b.featured;
      const fotoHtml = b.foto
        ? `<img src="${b.foto}" alt="${b.title}" style="width:100%;height:100%;object-fit:cover;" />`
        : `<div class="news-img-placeholder"><i class="fas fa-newspaper"></i></div>`;

      return `
        <div class="news-card ${isFeatured ? 'featured' : ''}" data-kategori="${b.kategori || 'Berita'}">
          <div class="news-img">
            ${fotoHtml}
            <span class="news-tag">${b.kategori || 'Berita'}</span>
          </div>
          <div class="news-body">
            <span class="news-date"><i class="fas fa-calendar"></i> ${b.date}</span>
            <h3>${b.title}</h3>
            <p>${b.ringkasan}</p>
            <a href="${b.url || '#'}" class="card-link">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      `;
    }).join('');

    // Tampilkan filter
    const filterEl = document.getElementById('newsFilter');
    if (filterEl) filterEl.style.display = 'flex';

    // Logika filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.news-card').forEach(card => {
          if (filter === 'semua' || card.dataset.kategori === filter) {
            card.classList.remove('hidden-filter');
          } else {
            card.classList.add('hidden-filter');
          }
        });
      });
    });

  } catch (err) {
    grid.innerHTML = `<p style="color:var(--gray);text-align:center;grid-column:1/-1;">Gagal memuat berita. Silakan coba lagi.</p>`;
    console.error(err);
  }
}

loadBerita();

// ===== NETLIFY IDENTITY =====
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}

// ===== CONTACT FORM — WhatsApp =====
const WA_NUMBER = '6281234567890'; // ganti dengan nomor WA HAKLI Soppeng

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nama    = document.getElementById('contactNama').value.trim();
  const kontak  = document.getElementById('contactKontak').value.trim();
  const subjek  = document.getElementById('contactSubjek').value.trim();
  const pesan   = document.getElementById('contactPesan').value.trim();

  const teks = `Halo HAKLI Soppeng 👋\n\n*Nama:* ${nama}\n*Kontak:* ${kontak}\n*Subjek:* ${subjek}\n\n*Pesan:*\n${pesan}`;
  const url  = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(teks)}`;

  const success = document.getElementById('formSuccess');
  success.classList.add('show');

  setTimeout(() => {
    window.open(url, '_blank');
    this.reset();
    setTimeout(() => success.classList.remove('show'), 3000);
  }, 600);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
