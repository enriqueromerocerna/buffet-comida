/* ═══════════════════════════════════════
   LEGADO CRIOLLO • NOA NOA — main.js
   ═══════════════════════════════════════ */

/* ── Navbar sombra al scroll ── */
var nav = document.querySelector('nav');
window.addEventListener('scroll', function () {
  nav.style.boxShadow = window.scrollY > 30
    ? '0 4px 24px rgba(26,37,54,0.1)' : 'none';
});

/* ── Fade-in al entrar en viewport ── */
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .blog-card, .section-title, .section-label').forEach(function (el, i) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease ' + (i * 0.05) + 's, transform .5s ease ' + (i * 0.05) + 's';
  io.observe(el);
});

/* ════════════════════════════════════════
   MODAL — ARMA TU BUFFET
   ════════════════════════════════════════ */
var qty = 20;
var selected = {};   // name -> cat

function abrirBuffet() {
  var modal = document.getElementById('buffet-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  /* reset scroll */
  document.getElementById('bm-right').scrollTop = 0;
  activarStep('1');
  actualizarResumen();
}

function cerrarBuffet() {
  document.getElementById('buffet-modal').classList.remove('open');
  document.body.style.overflow = '';
}

/* Cerrar con ESC */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') cerrarBuffet();
});

/* ── Sticky scroll: detectar qué paso está en pantalla ── */
var bmRight = null;
window.addEventListener('load', function () {
  bmRight = document.getElementById('bm-right');
  if (!bmRight) return;

  var bmIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        activarStep(e.target.dataset.step);
      }
    });
  }, { root: bmRight, rootMargin: '-30% 0px -30% 0px', threshold: 0 });

  document.querySelectorAll('.bm-step').forEach(function (s) {
    bmIO.observe(s);
  });
});

function activarStep(n) {
  /* imagen sticky */
  document.querySelectorAll('.bm-img').forEach(function (img) {
    img.classList.toggle('active', img.id === 'bimg' + n);
  });
  /* badge */
  var badge = document.getElementById('bm-badge-num');
  if (badge) badge.textContent = n;
  /* nav tabs */
  document.querySelectorAll('.bm-snav').forEach(function (tab) {
    tab.classList.toggle('active', tab.dataset.step === n);
  });
  /* step opacity */
  document.querySelectorAll('.bm-step').forEach(function (s) {
    s.classList.toggle('active', s.dataset.step === n);
  });
}

function scrollToStep(n) {
  var el = document.getElementById('bm-step-' + n);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Selección de platos ── */
function toggleDish(el) {
  el.classList.toggle('selected');
  var name = el.dataset.name;
  var cat  = el.dataset.cat;
  if (el.classList.contains('selected')) {
    selected[name] = cat;
  } else {
    delete selected[name];
  }
  actualizarResumen();
}

/* ── Cantidad ── */
function cambiarQty(delta) {
  qty = Math.max(10, qty + delta);
  document.getElementById('bm-qty-display').textContent = qty;
  actualizarResumen();
}

/* ── Resumen y link WhatsApp ── */
function actualizarResumen() {
  var entradas = [], segundos = [];
  Object.keys(selected).forEach(function (n) {
    if (selected[n] === 'entrada') entradas.push(n);
    else segundos.push(n);
  });

  /* panel sticky */
  var lines = [];
  if (entradas.length) lines.push('<strong>🥗 Entradas:</strong><br>' + entradas.join(', '));
  if (segundos.length) lines.push('<strong>🍽️ Segundos:</strong><br>' + segundos.join(', '));
  lines.push('<strong>👥 Personas:</strong> ' + qty);
  document.getElementById('bm-summary-body').innerHTML = lines.join('<br><br>');

  /* card final */
  var fc = '';
  if (entradas.length) fc += '🥗 <strong>Entradas:</strong> ' + entradas.join(', ') + '<br>';
  if (segundos.length) fc += '🍽️ <strong>Segundos:</strong> ' + segundos.join(', ') + '<br>';
  fc += '👥 <strong>Personas:</strong> ' + qty;
  document.getElementById('bm-final-content').innerHTML = fc;

  /* mark done */
  var t1 = document.querySelector('.bm-snav[data-step="1"]');
  var t2 = document.querySelector('.bm-snav[data-step="2"]');
  if (t1) t1.classList.toggle('done', entradas.length > 0);
  if (t2) t2.classList.toggle('done', segundos.length > 0);

  /* WhatsApp */
  var msg = 'Hola! Quiero armar mi Buffet:%0A';
  if (entradas.length) msg += '🥗 Entradas: ' + entradas.join(', ') + '%0A';
  if (segundos.length) msg += '🍽️ Segundos: ' + segundos.join(', ') + '%0A';
  msg += '👥 Personas: ' + qty;
  var waBtn = document.getElementById('bm-wa-btn');
  if (waBtn) waBtn.href = 'https://wa.me/51904609346?text=' + msg;
}

/* ── La Experiencia: tabs ── */
document.querySelectorAll('.exp-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.exp-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.exp-cat').forEach(function(c) { c.classList.remove('active'); });
    tab.classList.add('active');
    var cat = tab.dataset.cat;
    var panel = document.getElementById('exp-' + cat);
    if (panel) panel.classList.add('active');
  });
});

/* ── Dish selection limits ── */
var LIMITS = { entrada: 2, segundo: 4 };

function toggleDish(el) {
  var name = el.dataset.name;
  var cat  = el.dataset.cat;
  var isSelected = el.classList.contains('selected');
  var currentCount = Object.values(selected).filter(function(c){ return c === cat; }).length;

  // If trying to select and limit reached → block
  if (!isSelected && currentCount >= LIMITS[cat]) {
    // shake animation
    el.style.animation = 'shake .35s ease';
    setTimeout(function(){ el.style.animation = ''; }, 360);
    return;
  }

  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    selected[name] = cat;
  } else {
    delete selected[name];
  }
  updateLimits(cat);
  actualizarResumen();
}

function updateLimits(cat) {
  var count = Object.values(selected).filter(function(c){ return c === cat; }).length;
  var limit = LIMITS[cat];
  var noteEl = document.getElementById('limit-' + cat);
  if (!noteEl) return;

  if (count >= limit) {
    noteEl.textContent = '⚠️ Límite alcanzado: ' + count + '/' + limit;
    noteEl.classList.add('reached');
    // disable unselected dishes of this cat
    document.querySelectorAll('.bm-dish[data-cat="' + cat + '"]:not(.selected)').forEach(function(d){
      d.classList.add('disabled');
    });
  } else {
    var remaining = limit - count;
    noteEl.innerHTML = '✓ Puedes elegir ' + remaining + ' más (máx. ' + limit + ')';
    noteEl.classList.remove('reached');
    document.querySelectorAll('.bm-dish[data-cat="' + cat + '"]').forEach(function(d){
      d.classList.remove('disabled');
    });
  }
}
