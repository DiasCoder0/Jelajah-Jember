// =============================================
//  NAVBAR — scroll effect & hamburger
// =============================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// =============================================
//  FILTER — destinasi cards
// =============================================
const filterBtns    = document.querySelectorAll('.filter-btn');
const destCards     = document.querySelectorAll('.dest-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    destCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // Small stagger re-entry animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeUp .4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// =============================================
//  SAVE / WISHLIST button
// =============================================
document.querySelectorAll('.dest-save').forEach(btn => {
  btn.addEventListener('click', () => {
    const isSaved = btn.classList.toggle('saved');
    btn.textContent = isSaved ? '♥' : '♡';
    btn.title = isSaved ? 'Tersimpan' : 'Simpan destinasi';
  });
});

// =============================================
//  SCROLL REVEAL
// =============================================
const revealElements = document.querySelectorAll(
  '.kategori-card, .dest-card, .galeri-item, .section-header, .cta-box, .footer-col, .footer-brand'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on index within its parent
      const siblings = Array.from(entry.target.parentElement.children);
      const idx      = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// =============================================
//  CTA NEWSLETTER FORM
// =============================================
const ctaForm    = document.getElementById('ctaForm');
const ctaSuccess = document.getElementById('ctaSuccess');

ctaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  ctaForm.style.display = 'none';
  ctaSuccess.hidden     = false;
});

// =============================================
//  SMOOTH ACTIVE NAV LINK on scroll
// =============================================
const sections = document.querySelectorAll('section[id], footer[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.querySelectorAll('a').forEach(a => {
        a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '700' : '500';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// =============================================
//  CARD DETAIL BUTTON — simple alert placeholder
// =============================================
document.querySelectorAll('.dest-btn-detail').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.dest-card');
    const name = card.querySelector('.dest-name').textContent;
    alert(`Halaman detail untuk "${name}" segera hadir! 🌿`);
  });
});

// =============================================
//  CSS keyframe for filter fade-in
// =============================================
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// =============================================
//  CUSTOM CURSOR
// =============================================
const cursorDot    = document.getElementById('cursorDot');
const cursorRing   = document.getElementById('cursorRing');
const trailContainer = document.getElementById('cursorTrails');

// Posisi cursor sebenarnya
let mouseX = -100, mouseY = -100;
// Posisi ring yang diinterpolasi (lag effect)
let ringX  = -100, ringY  = -100;

// Trail color palette — nuansa hijau & emas
const trailColors = [
  '#74c69d', '#52b788', '#40916c', '#2d6a4f',
  '#e9c46a', '#d4a017', '#b7e4c7'
];

// Update posisi mouse
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot langsung mengikuti
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';

  // Spawn trail particle
  spawnTrail(mouseX, mouseY);
});

// Ring mengikuti dengan interpolasi (smooth lag)
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateRing);
}
animateRing();

// ---- Trail Particles ----
let lastTrailTime = 0;
function spawnTrail(x, y) {
  const now = Date.now();
  if (now - lastTrailTime < 30) return; // throttle ~30fps
  lastTrailTime = now;

  const particle = document.createElement('div');
  particle.classList.add('trail-particle');

  // Warna acak dari palette
  const color = trailColors[Math.floor(Math.random() * trailColors.length)];
  const size  = Math.random() * 5 + 3; // 3–8px

  particle.style.cssText = `
    left: ${x}px;
    top:  ${y}px;
    width:  ${size}px;
    height: ${size}px;
    background: ${color};
    opacity: 0.7;
  `;

  trailContainer.appendChild(particle);

  // Hapus partikel setelah animasi selesai
  setTimeout(() => particle.remove(), 600);
}

// ---- Cursor States ----
// Elemen klikable (link, button)
const clickables = 'a, button, .filter-btn, .dest-save, .dest-btn-detail, .kategori-card, .galeri-item';

document.querySelectorAll(clickables).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Elemen gambar / card visual
const imageEls = '.dest-img, .galeri-item img, .hero';

document.querySelectorAll(imageEls).forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.remove('cursor-hover');
    document.body.classList.add('cursor-image');
  });
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-image'));
});

// Elemen teks / input
const textEls = 'input, textarea, p, h1, h2, h3, .dest-desc, .hero-desc';

document.querySelectorAll(textEls).forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (!document.body.classList.contains('cursor-hover') &&
        !document.body.classList.contains('cursor-image')) {
      document.body.classList.add('cursor-text');
    }
  });
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
});

// Klik — efek "klik" singkat
document.addEventListener('mousedown', () => {
  document.body.classList.add('cursor-click');
  // Efek ripple saat klik
  spawnClickRipple(mouseX, mouseY);
});
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

// ---- Click Ripple ----
function spawnClickRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${x}px;
    top:  ${y}px;
    width:  12px;
    height: 12px;
    border: 2px solid var(--green-mid);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99996;
    transform: translate(-50%, -50%) scale(1);
    animation: rippleOut .5s ease forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// Inject ripple keyframe sekali
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleOut {
    0%   { transform: translate(-50%, -50%) scale(1);  opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(4);  opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// Sembunyikan cursor saat keluar window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});
