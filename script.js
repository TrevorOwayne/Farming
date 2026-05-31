/* ============================================================
   script.js — Airdrop Farming Landing Page
   Handles: ticker bar, scroll animations, counter,
            FAQ accordion, scroll utility
============================================================ */


/* ============================================================
   TICKER BAR
   Fake live crypto prices that update slightly every 2s
   to give a "live market" feel.
============================================================ */

const tickerData = [
  { sym: 'BTC/USD',  price: 62408.21, chg: '+2.14%', up: true  },
  { sym: 'ETH/USD',  price: 3201.44,  chg: '+1.83%', up: true  },
  { sym: 'SOL/USD',  price: 142.87,   chg: '-0.44%', up: false },
  { sym: 'ARB/USD',  price: 0.8312,   chg: '+5.21%', up: true  },
  { sym: 'OP/USD',   price: 1.9401,   chg: '+3.67%', up: true  },
  { sym: 'STRK/USD', price: 0.4432,   chg: '-1.12%', up: false },
  { sym: 'ZK/USD',   price: 0.1908,   chg: '+8.34%', up: true  },
  { sym: 'SUI/USD',  price: 0.9874,   chg: '+4.55%', up: true  },
];

/* Build ticker HTML — duplicated for seamless loop */
function buildTicker() {
  const items  = [...tickerData, ...tickerData]; // duplicate for infinite scroll
  const inner  = document.getElementById('tickerInner');
  if (!inner) return;

  inner.innerHTML = items.map(t => `
    <div class="ticker-item">
      <span>${t.sym}</span>
      <span class="ticker-price" data-base="${t.price}">
        $${formatTickerPrice(t.price)}
      </span>
      <span class="${t.up ? 'up' : 'down'}">${t.chg}</span>
    </div>
  `).join('');
}

/* Format price based on magnitude */
function formatTickerPrice(price) {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toFixed(4);
}

/* Slightly jitter prices every 2s to look "live" */
function startTickerUpdates() {
  setInterval(() => {
    document.querySelectorAll('.ticker-price').forEach(el => {
      const base   = parseFloat(el.dataset.base);
      const jitter = base * (Math.random() * 0.002 - 0.001);
      const newVal = base + jitter;
      el.textContent = '$' + formatTickerPrice(newVal);
    });
  }, 2000);
}


/* ============================================================
   ANIMATED COUNTER
   Counts up from 0 to target when the stats bar scrolls
   into view. Uses an ease-out cubic for a natural feel.
============================================================ */

function animateCounter(el, target, duration) {
  duration = duration || 1500;
  const start   = performance.now();
  const initial = parseInt(el.textContent.replace(/,/g, '')) || 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.round(initial + (target - initial) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* Trigger counter when stats bar enters viewport */
function initCounter() {
  const heroEl = document.getElementById('hero');
  if (!heroEl) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        const el = document.getElementById('statFarmers');
        if (el) animateCounter(el, 2841);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(heroEl);
}


/* ============================================================
   FADE-IN ON SCROLL
   Cards and list items fade + slide up as they enter the
   viewport. Applied to: feature cards, proof cards,
   product cards, pain items, FAQ items, flow nodes.
============================================================ */

function initFadeIn() {
  const selector = [
    '.feature-card',
    '.proof-card',
    '.product-card',
    '.pain-item',
    '.faq-item',
    '.flow-node'
  ].join(', ');

  const targets = document.querySelectorAll(selector);
  targets.forEach(function(el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function(el) {
    observer.observe(el);
  });
}


/* ============================================================
   FAQ ACCORDION
   Opens the clicked item and closes any other open item.
============================================================ */

function toggleFaq(btn) {
  const clickedItem = btn.closest('.faq-item');
  const wasOpen     = clickedItem.classList.contains('open');

  // Close all items
  document.querySelectorAll('.faq-item').forEach(function(item) {
    item.classList.remove('open');
  });

  // Open the clicked one if it wasn't already open
  if (!wasOpen) {
    clickedItem.classList.add('open');
  }
}


/* ============================================================
   SCROLL UTILITY
   Used by CTA buttons to jump to the products section.
============================================================ */

function scrollToProducts() {
  const el = document.getElementById('products');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}


/* ============================================================
   INIT — Run everything on DOM ready
============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  buildTicker();
  startTickerUpdates();
  initCounter();
  initFadeIn();
});
