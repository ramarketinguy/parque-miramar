// ══════════════════════════════════════════
// PARQUE MIRAMAR — LANDING PAGE SCRIPTS
// ══════════════════════════════════════════

// ── PRELOADER ──────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1800);
});

// ── NAV SCROLL ──────────────────────────────
const nav = document.getElementById('mainNav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
    lastScroll = window.scrollY;
});

// ── MOBILE MENU ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Stagger mobile menu items
mobileMenu.querySelectorAll('a').forEach((a, i) => {
    a.style.transitionDelay = `${0.1 + i * 0.08}s`;
});

// ── INTERSECTION OBSERVER ───────────────────
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .stat-item, .dist-item').forEach(el => io.observe(el));

// Stagger stat items
document.querySelectorAll('.stat-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
});

// Stagger dist items
document.querySelectorAll('.dist-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
});

// ── ANIMATED COUNTERS ───────────────────────
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            if (!target) return;

            let current = 0;
            const duration = 2000;
            const step = target / (duration / 16);

            const animate = () => {
                current += step;
                if (current >= target) {
                    el.textContent = target + suffix;
                    return;
                }
                el.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(animate);
            };
            animate();
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── TABS ────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    });
});

// ── FAQ ACCORDION ───────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// ── LIGHTBOX GALLERY ────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const galleryItems = document.querySelectorAll('.gallery-item img');
let currentIndex = 0;

const allImages = [
    'Fotos/Fotos pque Miramar/3.webp',
    'Fotos/Fotos pque Miramar/7.webp',
    'Fotos/Fotos pque Miramar/4.webp',
    'Fotos/Fotos pque Miramar/13.webp',
    'Fotos/Fotos pque Miramar/10.webp',
    'Fotos/Fotos pque Miramar/1.webp',
    'Fotos/Fotos pque Miramar/5.webp',
    'Fotos/Fotos pque Miramar/8.webp',
    'Fotos/Fotos pque Miramar/9.webp',
    'Fotos/Fotos pque Miramar/11.webp',
    'Fotos/Fotos pque Miramar/12.webp',
    'Fotos/Fotos pque Miramar/2.webp',
    'Fotos/Fotos pque Miramar/6.webp',
];

function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = allImages[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${allImages.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    currentIndex = (currentIndex + dir + allImages.length) % allImages.length;
    lightboxImg.src = allImages[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${allImages.length}`;
}

galleryItems.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard nav
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ── SMOOTH SCROLL FOR NAV LINKS ─────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── META PIXEL — CONVERSION EVENTS ──────────
// ── META PIXEL — CONVERSION EVENTS ──────────
// ── META PIXEL — CONVERSION EVENTS ──────────
// Helper: dual-fire to browser pixel AND server-side CAPI

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// Generate unique ID for deduplication (fallback)
function generateEventID() {
    return 'evt-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
}

function trackFBEvent(eventName, params, manualID = null) {
    const eventID = manualID || generateEventID();
    console.log(`[FB-TRACK] Event: ${eventName} | ID: ${eventID}`, params);

    // 1) Fire browser pixel (with eventID)
    // ONLY if not manually passed (because manual means Pixel already fired in HTML) OR forced via params
    // But to keep it simple: we usually want to fire pixel unless specifically told not to.
    // However, for PageView, we ONLY want to fire CAPI here because Pixel fired in HTML.

    if (manualID) {
        // If ID is provided manually (like for PageView from head), 
        // prompt pixel ONLY if it wasn't the initial PageView.
        // But here we use manualID for the initial PageView CAPI call.
        // So we skip Browser Pixel.
        console.log('[FB-TRACK] Skipping Browser Pixel (Assumed verified by HTML)');
    } else {
        if (typeof fbq === 'function') {
            fbq('track', eventName, params, { eventID: eventID });
        } else {
            console.warn('[FB-TRACK] "fbq" not defined. Check adblocker.');
        }
    }

    // 2) Fire server-side CAPI (with same eventID)
    const payload = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        event_id: eventID, // DEDUPLICATION KEY
        action_source: 'website',
        user_data: {
            client_user_agent: navigator.userAgent,
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc'),
        }
    };
    if (params) payload.custom_data = params;

    fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
    }).then(res => {
        if (!res.ok) console.error('[FB-CAPI] Error:', res.status);
    }).catch(err => console.error('[FB-CAPI] Network Error:', err));
}

// Fire Server-Side PageView (using the ID from HTML)
if (window.pageViewID) {
    // Send CAPI event matching the HTML pixel event
    trackFBEvent('PageView', null, window.pageViewID);
} else {
    // Fallback if HTML execution failed (rare)
    trackFBEvent('PageView');
}

// Track WhatsApp & Schedule links
document.querySelectorAll('a[href*="wa.me"], a.btn-whatsapp, a.btn-primary[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        const text = link.textContent.trim().toLowerCase();
        const eventName = text.includes('agendar') ? 'Schedule' : 'Contact';
        trackFBEvent(eventName, {
            content_name: eventName === 'Schedule' ? 'Agendar Visita' : 'WhatsApp Contact',
            content_category: 'Real Estate',
            value: 380000,
            currency: 'USD'
        });
    });
});

// Track Photo Request
document.querySelectorAll('.gallery-header a.btn-primary').forEach(link => {
    link.addEventListener('click', () => trackFBEvent('Lead', { content_name: 'Pedir fotos' }));
});

// Track Floating WA
const waFloat = document.querySelector('.wa-float');
if (waFloat) {
    waFloat.addEventListener('click', () => trackFBEvent('Contact', { content_name: 'WhatsApp Flotante' }));
}

// Track Nav CTA
document.querySelectorAll('.nav-cta').forEach(link => {
    link.addEventListener('click', () => trackFBEvent('Lead', { content_name: 'Nav Agendar' }));
});

// ViewContent for key sections
const sectionsToTrack = ['contacto', 'galeria'];
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && sectionsToTrack.includes(entry.target.id)) {
            trackFBEvent('ViewContent', { content_name: `Sección ${entry.target.id}` });
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
sectionsToTrack.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
});
