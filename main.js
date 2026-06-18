/**
 * EcoCycle Solutions — main.js
 * Handles: navigation, accordion, tabs, search/filter,
 *          gallery lightbox, scroll animations, stats counter,
 *          Leaflet map, scroll-to-top
 */

/* ── DOM ready ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initAccordion();
    initTabs();
    initSearch();
    initLightbox();
    initScrollAnimations();
    initStatsCounter();
    initScrollTop();
    if (document.getElementById('map'))         initAboutMap();
    if (document.getElementById('contact-map')) initContactMap();
    highlightActiveNav();
});

/* ── 1. Navigation (hamburger) ─────────────────────────── */
function initNav() {
    const btn  = document.querySelector('.hamburger');
    const menu = document.querySelector('nav ul');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('nav')) {
            menu.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', false);
        }
    });
}

function highlightActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach(a => {
        if (a.getAttribute('href') === page) a.classList.add('active');
    });
}

/* ── 2. Accordion ──────────────────────────────────────── */
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.accordion-item');
            const body   = item.querySelector('.accordion-body');
            const isOpen = item.classList.contains('open');

            // Close all others
            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('open');
                el.querySelector('.accordion-body').classList.remove('open');
            });

            if (!isOpen) {
                item.classList.add('open');
                body.classList.add('open');
            }
        });
    });
}

/* ── 3. Tabs ───────────────────────────────────────────── */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('[data-category]').forEach(card => {
                const match = target === 'all' || card.dataset.category === target;
                card.style.display = match ? '' : 'none';
            });

            checkNoResults();
        });
    });
}

/* ── 4. Search / filter ────────────────────────────────── */
function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        const activeTab = document.querySelector('.tab-btn.active');
        const tabCat    = activeTab ? activeTab.dataset.tab : 'all';

        document.querySelectorAll('[data-category]').forEach(card => {
            const text = card.innerText.toLowerCase();
            const catMatch = tabCat === 'all' || card.dataset.category === tabCat;
            card.style.display = catMatch && text.includes(q) ? '' : 'none';
        });

        checkNoResults();
    });
}

function checkNoResults() {
    const grid  = document.getElementById('servicesGrid') || document.getElementById('resourcesGrid');
    const noRes = document.getElementById('noResults');
    if (!grid || !noRes) return;
    const visible = [...grid.querySelectorAll('[data-category]')].some(c => c.style.display !== 'none');
    noRes.style.display = visible ? 'none' : 'block';
}

/* ── 5. Gallery Lightbox ───────────────────────────────── */
let currentIdx = 0;
let galleryItems = [];

function initLightbox() {
    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lbImg');
    const lbCap   = document.getElementById('lbCaption');
    const closeBtn = document.getElementById('lbClose');
    const prevBtn  = document.getElementById('lbPrev');
    const nextBtn  = document.getElementById('lbNext');

    if (!lb) return;

    galleryItems = [...document.querySelectorAll('.gallery-item')];

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
        item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', item.querySelector('h4')?.textContent || 'View image');
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => showSlide(currentIdx - 1));
    nextBtn?.addEventListener('click', () => showSlide(currentIdx + 1));

    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  showSlide(currentIdx - 1);
        if (e.key === 'ArrowRight') showSlide(currentIdx + 1);
    });

    function openLightbox(idx) {
        currentIdx = idx;
        showSlide(idx);
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
    }

    function showSlide(idx) {
        if (!galleryItems.length) return;
        currentIdx = (idx + galleryItems.length) % galleryItems.length;
        const item = galleryItems[currentIdx];
        lbImg.src = item.querySelector('img').src;
        lbImg.alt = item.querySelector('img').alt;
        if (lbCap) lbCap.textContent = item.querySelector('h4')?.textContent || '';
    }

    function closeLightbox() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ── 6. Scroll-reveal animations ──────────────────────── */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── 7. Stats counter ──────────────────────────────────── */
function initStatsCounter() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target   = +el.dataset.count;
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const step     = 16;
    const inc      = target / (duration / step);
    let   current  = 0;

    const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
            clearInterval(timer);
            el.textContent = target.toLocaleString() + suffix;
        } else {
            el.textContent = Math.floor(current).toLocaleString() + suffix;
        }
    }, step);
}

/* ── 8. Scroll-to-top button ───────────────────────────── */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 9. Leaflet map — About page ───────────────────────── */
function initAboutMap() {
    const map = L.map('map').setView([-26.2041, 28.0473], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    const icon = L.divIcon({
        html: '<div style="background:#2e7d32;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

    L.marker([-26.2041, 28.0473], { icon })
     .addTo(map)
     .bindPopup('<strong>EcoCycle Solutions</strong><br>Johannesburg, South Africa')
     .openPopup();
}

/* ── 10. Leaflet map — Contact page ────────────────────── */
function initContactMap() {
    const map = L.map('contact-map').setView([-26.2041, 28.0473], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    const icon = L.divIcon({
        html: '<div style="background:#2e7d32;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    L.marker([-26.2041, 28.0473], { icon })
     .addTo(map)
     .bindPopup('<strong>EcoCycle Solutions HQ</strong><br>Johannesburg, Gauteng')
     .openPopup();
}

/* ── Toast helper (used by forms.js) ───────────────────── */
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const icon = type === 'success' ? '✅' : '❌';
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
};

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toastContainer';
    div.className = 'toast-container';
    document.body.appendChild(div);
    return div;
}
