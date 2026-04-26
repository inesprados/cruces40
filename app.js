/* ── Estado ── */
const state = {
  camareros: ['Ana', 'Carlos', 'María', 'Paco', 'Lucía'],
  platos: [
    { nombre: 'Tortilla', seccion: 'cocina' },
    { nombre: 'Arroz', seccion: 'cocina' },
    { nombre: 'Migas', seccion: 'cocina' },
    { nombre: 'Carne en salsa', seccion: 'cocina' },
    { nombre: 'Bocata tortilla', seccion: 'cocina' },
    { nombre: 'Bocata carne en salsa', seccion: 'cocina' },
    { nombre: 'Perrito', seccion: 'cocina' },
    { nombre: 'Bocata jamón', seccion: 'cocina' },
    { nombre: 'Bocata jamón y queso', seccion: 'cocina' },
    { nombre: 'Bocata jamón con tomate', seccion: 'cocina' },
    { nombre: 'Bocata atún con tomate', seccion: 'cocina' },
    { nombre: 'Bocata queso', seccion: 'cocina' },
    { nombre: 'Queso', seccion: 'cocina' },
    { nombre: 'Tomate aliñao', seccion: 'cocina' },
    { nombre: 'Pinchito', seccion: 'plancha' },
    { nombre: 'Longaniza', seccion: 'plancha' },
    { nombre: 'Morcilla', seccion: 'plancha' },
    { nombre: 'Lomo', seccion: 'plancha' },
    { nombre: 'Bocata lomo', seccion: 'plancha' },
    { nombre: 'Bocata lomo queso', seccion: 'plancha' },
    { nombre: 'Bocata lomo, queso y pimientos', seccion: 'plancha' },
    { nombre: 'Bocata morcilla', seccion: 'plancha' },
    { nombre: 'Bocata longaniza', seccion: 'plancha' },
    { nombre: 'Pimientos fritos', seccion: 'plancha' },
  ],
  cola: [],
  cantidades: {},
  contador: 1,
  seccionActiva: 'cocina',
  platoActivo: null,
  ingredientes: [
    {
      id: 1, nombre: 'Tortillas de patata', unidad: 'tortillas',
      stockInicial: 50, stockActual: 50, umbral: 25,
      consumos: { 'Tortilla': 1, 'Bocata tortilla': 0.5 }
    },
    {
      id: 2, nombre: 'Tortillas de patata TICKETS', unidad: 'tortillas',
      stockInicial: 50, stockActual: 50, umbral: 10,
      consumos: { 'Tortilla': 1, 'Bocata tortilla': 0.5 }
    },
    {
      id: 3, nombre: 'Barras de pan', unidad: 'barras',
      stockInicial: 0, stockActual: 0, umbral: 0,
      consumos: {
        'Bocata tortilla': 1, 'Bocata carne en salsa': 1,
        'Bocata jamón': 1, 'Bocata jamón y queso': 1,
        'Bocata jamón con tomate': 1, 'Bocata atún con tomate': 1,
        'Bocata queso': 1, 'Bocata lomo': 1, 'Bocata lomo queso': 1,
        'Bocata lomo, queso y pimientos': 1, 'Bocata morcilla': 1,
        'Bocata longaniza': 1, 'Perrito': 1,
      }
    },
     {
      id: 4, nombre: 'Bollo aliatar', unidad: 'bollo',
      stockInicial: 180, stockActual: 180, umbral: 25,
      consumos: {
        'Bocata tortilla': 1, 'Bocata carne en salsa': 1,
        'Bocata jamón': 1, 'Bocata jamón y queso': 1,
        'Bocata jamón con tomate': 1, 'Bocata atún con tomate': 1,
        'Bocata queso': 1, 'Bocata lomo': 1, 'Bocata lomo queso': 1,
        'Bocata lomo, queso y pimientos': 1, 'Bocata morcilla': 1,
        'Bocata longaniza': 1, 'Perrito': 1,
      }
    },
    {
      id: 5, nombre: 'Lomo', unidad: 'raciones',
      stockInicial: 40, stockActual: 40, umbral: 6,
      consumos: { 'Lomo': 1, 'Bocata lomo': 1, 'Bocata lomo queso': 1, 'Bocata lomo, queso y pimientos': 1 }
    },
    {
      id: 6, nombre: 'Morcilla', unidad: 'raciones',
      stockInicial: 15, stockActual: 15, umbral: 5,
      consumos: { 'Morcilla': 1, 'Bocata morcilla': 1 }
    },
    {
      id: 7, nombre: 'Longaniza fina', unidad: 'raciones',
      stockInicial: 30, stockActual: 30, umbral: 5,
      consumos: { 'Longaniza': 1, 'Bocata longaniza': 1 }
    },
    {
      id: 8, nombre: 'Jamón', unidad: 'raciones',
      stockInicial: 40, stockActual: 40, umbral: 6,
      consumos: { 'Bocata jamón': 1, 'Bocata jamón y queso': 1, 'Bocata jamón con tomate': 1 }
    },
    {
      id: 9, nombre: 'Queso semicurao', unidad: 'raciones',
      stockInicial: 35, stockActual: 35, umbral: 5,
      consumos: {
        'Queso': 1, 'Bocata queso': 5 }
    },
    {
      id: 10, nombre: 'Pinchitos', unidad: 'unidad',
      stockInicial: 200, stockActual: 200, umbral: 120,
      consumos: { 'Pinchito': 1 }
    },
    {
      id: 11, nombre: 'Pinchitos TICKETS', unidad: 'unidad',
      stockInicial: 200, stockActual: 200, umbral: 10,
      consumos: { 'Pinchito': 1 }
    },
    {
      id: 12, nombre: 'Queso en lonchas', unidad: 'raciones',
      stockInicial: 20, stockActual: 20, umbral: 4,
      consumos: {  'Bocata jamón y queso': 2, 'Bocata lomo queso': 0.5, 'Bocata lomo, queso y pimientos': 0.5, }
    },
  ],
  _ingEditId: null,
};

/* ── Persistencia (localStorage) ── */
function guardar() {
  try {
    localStorage.setItem('comandas_cruz_v3', JSON.stringify({
      camareros: state.camareros,
      platos: state.platos,
      cola: state.cola,
      cantidades: state.cantidades,
      contador: state.contador,
      ingredientes: state.ingredientes,
    }));
  } catch(e) { console.warn('No se pudo guardar:', e); }
}
function cargar() {
  try {
    const raw = localStorage.getItem('comandas_cruz_v3');
    if (!raw) return;
    const datos = JSON.parse(raw);
    if (datos.camareros) state.camareros = datos.camareros;
    if (datos.platos) state.platos = datos.platos;
    if (datos.cola) state.cola = datos.cola;
    if (datos.cantidades) state.cantidades = datos.cantidades;
    if (datos.contador) state.contador = datos.contador;
    if (datos.ingredientes) state.ingredientes = datos.ingredientes;
  } catch(e) { console.warn('No se pudo cargar:', e); }
}

/* ── Swipe to delete ── */
function addSwipeToDelete(el, onDelete) {
  let startX = null, startY = null, dx = 0, swiping = false;
  function pointerDown(e) {
    const t = e.touches ? e.touches[0] : e;
    startX = t.clientX; startY = t.clientY; dx = 0; swiping = false;
    el.style.transition = 'none';
  }
  function pointerMove(e) {
    if (startX === null) return;
    const t = e.touches ? e.touches[0] : e;
    dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (!swiping && Math.abs(dy) > Math.abs(dx)) { startX = null; return; }
    swiping = true;
    if (dx < 0) {
      el.style.transform = `translateX(${dx}px)`;
      el.style.opacity = Math.max(0, 1 + dx / 120);
      if (e.cancelable) e.preventDefault();
    }
  }
  function pointerUp() {
    if (startX === null) return;
    startX = null;
    if (dx < -60) {
      el.style.transition = 'transform 0.2s ease, opacity 0.2s ease, max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease';
      el.style.transform = 'translateX(-100%)';
      el.style.opacity = '0';
      el.style.overflow = 'hidden';
      setTimeout(() => { el.style.maxHeight = '0'; el.style.padding = '0'; el.style.marginTop = '0'; }, 150);
      setTimeout(onDelete, 400);
    } else {
      el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }
  }
  el.addEventListener('touchstart', pointerDown, { passive: true });
  el.addEventListener('touchmove', pointerMove, { passive: false });
  el.addEventListener('touchend', pointerUp);
  el.addEventListener('mousedown', pointerDown);
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);
}

/* ── Camareros: selección + tap ── */
state.camareroSeleccionado = null;

function seleccionarCamarero(nombre) {
  state.camareroSeleccionado = (state.camareroSeleccionado === nombre) ? null : nombre;
  renderCamarerosDrag();
  renderSeccion();
}

function renderCamarerosDrag() {
  const lista = document.getElementById('lista-camareros-drag');
  lista.innerHTML = '';
  state.camareros.forEach(nombre => {
    const el = document.createElement('div');
    const sel = state.camareroSeleccionado === nombre;
    el.className = 'camarero-chip' + (sel ? ' seleccionado' : '');
    el.innerHTML = sel ? '<span class="chip-check">✓</span> ' + nombre : nombre;
    el.addEventListener('click', () => seleccionarCamarero(nombre));
    lista.appendChild(el);
  });

  const label = document.querySelector('.bar-label');
  if (label) {
    if (state.camareroSeleccionado) {
      label.textContent = '↓ Pulsa el plato';
      label.style.color = 'var(--green)';
      label.style.fontWeight = '600';
    } else {
      label.textContent = '1. Elige camarero';
      label.style.color = '';
      label.style.fontWeight = '';
    }
  }
}

/* ── Render sección ── */
function renderSeccion() {
  // Actualizar badge contadores en subtabs
  ['cocina', 'plancha'].forEach(sec => {
    const total = state.cola.filter(p => {
      const plato = state.platos.find(pl => pl.nombre === p.plato);
      return plato && plato.seccion === sec && !p.entregada;
    }).length;
    const badgeEl = document.getElementById(`subtab-badge-${sec}`);
    if (badgeEl) { badgeEl.textContent = total; badgeEl.style.display = total > 0 ? 'inline-block' : 'none'; }
  });

  const lista = document.getElementById('lista-platos-drop');
  lista.innerHTML = '';
  const platosSeccion = state.platos.filter(p => p.seccion === state.seccionActiva);

  if (platosSeccion.length === 0) {
    lista.innerHTML = '<p style="opacity:0.4;text-align:center;padding:30px 0;font-size:14px;">Sin platos en esta sección.<br>Añade platos desde Configurar.</p>';
    return;
  }

  platosSeccion.forEach(({ nombre }) => {
    const zona = document.createElement('div');
    zona.className = 'camarero-drop-zone';
    zona.dataset.plato = nombre;

    const header = document.createElement('div');
    header.className = 'zona-header';

    const titulo = document.createElement('div');
    titulo.className = 'camarero-nombre';
    titulo.textContent = nombre;

    const pendientes = state.cola.filter(p => p.plato === nombre && !p.entregada).length;
    const rightSide = document.createElement('div');
    rightSide.style.cssText = 'display:flex;align-items:center;gap:8px;';

    if (pendientes > 0) {
      const badge = document.createElement('span');
      badge.className = 'plato-tab-badge';
      badge.textContent = pendientes;
      rightSide.appendChild(badge);
    }

    const btnDetalle = document.createElement('button');
    btnDetalle.className = 'btn-detalle';
    btnDetalle.textContent = 'Ver detalle';
    btnDetalle.addEventListener('click', (e) => { e.stopPropagation(); abrirDetallePlato(nombre); });
    rightSide.appendChild(btnDetalle);

    header.appendChild(titulo);
    header.appendChild(rightSide);
    zona.appendChild(header);

    const pedidosCont = document.createElement('div');
    pedidosCont.className = 'pedidos-list';
    state.cola.filter(p => p.plato === nombre && !p.entregada).forEach(p => {
      pedidosCont.appendChild(crearBadgePedido(p, false));
    });
    zona.appendChild(pedidosCont);

    zona.className = 'camarero-drop-zone' + (state.camareroSeleccionado ? ' zona-lista' : '');

    zona.addEventListener('click', (e) => {
      if (e.target.closest('.btn-detalle')) return;
      if (!state.camareroSeleccionado) {
        zona.classList.add('zona-shake');
        setTimeout(() => zona.classList.remove('zona-shake'), 500);
        return;
      }
      añadirPedido(nombre, state.camareroSeleccionado);
      zona.classList.add('zona-flash');
      setTimeout(() => zona.classList.remove('zona-flash'), 400);
    });

    lista.appendChild(zona);
  });
}

/* ── Badge pedido ── */
function crearBadgePedido(p, grande) {
  const badge = document.createElement('div');
  badge.className = grande ? 'pedido-badge pedido-badge-grande' : 'pedido-badge';
  badge.dataset.id = p.id;
  badge.innerHTML = `
    <span class="pedido-num">#${p.id}</span>
    <span class="pedido-camarero">${p.camarero}</span>
    <span class="pedido-hora">${p.hora}</span>
    <span class="swipe-hint">← desliza</span>
  `;
  addSwipeToDelete(badge, () => {
    state.cola = state.cola.filter(x => x.id !== p.id);
    guardar();
    actualizarTodo();
    if (state.platoActivo) renderDetallePlato(state.platoActivo);
  });
  return badge;
}

/* ── Detalle plato ── */
function abrirDetallePlato(plato) {
  state.platoActivo = plato;
  document.getElementById('detalle-titulo').textContent = plato;
  renderDetallePlato(plato);
  document.getElementById('panel-comandas').classList.remove('active');
  document.getElementById('panel-detalle').classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
}
function renderDetallePlato(plato) {
  const lista = document.getElementById('lista-detalle');
  lista.innerHTML = '';
  const pedidos = state.cola.filter(p => p.plato === plato && !p.entregada);
  if (pedidos.length === 0) {
    lista.innerHTML = '<p style="opacity:0.45;text-align:center;padding:30px 0;font-size:15px;">Sin pedidos pendientes</p>';
    return;
  }
  pedidos.forEach(p => lista.appendChild(crearBadgePedido(p, true)));
}
function cerrarDetalle() {
  state.platoActivo = null;
  document.getElementById('panel-detalle').classList.remove('active');
  document.getElementById('panel-comandas').classList.add('active');
  document.querySelector('.tab[data-tab="comandas"]').classList.add('active');
}
document.getElementById('btn-volver').addEventListener('click', cerrarDetalle);

/* ── Subtabs cocina/plancha ── */
document.querySelectorAll('.subtab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.subtab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.seccionActiva = btn.dataset.seccion;
    renderSeccion();
  });
});

/* ── Añadir pedido ── */
function añadirPedido(plato, camarero) {
  const pedido = {
    id: state.contador++,
    plato,
    camarero,
    hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    entregada: false
  };
  state.cola.push(pedido);
  state.cantidades[plato] = (state.cantidades[plato] || 0) + 1;
  state.ingredientes.forEach(ing => {
    const fraccion = ing.consumos && ing.consumos[plato];
    if (fraccion && fraccion > 0) {
      ing.stockActual = Math.max(0, (ing.stockActual || 0) - fraccion);
    }
  });
  guardar();
  actualizarTodo();
}

function actualizarTodo() {
  actualizarStats();
  renderSeccion();
  if (document.getElementById('panel-cantidades').classList.contains('active')) renderCantidades();
  if (document.getElementById('panel-avisos').classList.contains('active')) renderAvisos();
  actualizarAvisosBadge();
}

function actualizarStats() {
  const p = state.cola.filter(x => !x.entregada).length;
  const l = state.cola.filter(x => x.entregada).length;
  document.getElementById('stat-pendientes').textContent = `${p} pendientes`;
  document.getElementById('stat-listos').textContent = `${l} listos`;
}

/* ── Cantidades ── */
function renderCantidades() {
  const cont = document.getElementById('lista-cantidades');
  cont.innerHTML = '';

  ['cocina', 'plancha'].forEach(sec => {
    const platosGrupo = state.platos.filter(p => p.seccion === sec);
    if (platosGrupo.length === 0) return;

    const groupHeader = document.createElement('div');
    groupHeader.className = `cantidad-group-header seccion-${sec}`;
    groupHeader.textContent = sec.charAt(0).toUpperCase() + sec.slice(1);
    cont.appendChild(groupHeader);

    platosGrupo.forEach(({ nombre }) => {
      const count = state.cantidades[nombre] || 0;
      const row = document.createElement('div');
      row.className = 'cantidad-row';

      const nombreEl = document.createElement('span');
      nombreEl.className = 'cantidad-nombre';
      nombreEl.textContent = nombre;

      const controls = document.createElement('div');
      controls.className = 'cantidad-controls';

      const btnMinus = document.createElement('button');
      btnMinus.className = 'btn-count';
      btnMinus.textContent = '−';
      btnMinus.addEventListener('click', () => {
        if ((state.cantidades[nombre] || 0) > 0) {
          state.cantidades[nombre]--;
          guardar(); renderCantidades();
        }
      });

      const numEl = document.createElement('input');
      numEl.type = 'number';
      numEl.className = 'count-input';
      numEl.value = count;
      numEl.min = 0;
      numEl.addEventListener('change', () => {
        const v = parseInt(numEl.value);
        state.cantidades[nombre] = isNaN(v) || v < 0 ? 0 : v;
        numEl.value = state.cantidades[nombre];
        guardar();
      });

      const btnPlus = document.createElement('button');
      btnPlus.className = 'btn-count';
      btnPlus.textContent = '+';
      btnPlus.addEventListener('click', () => {
        state.cantidades[nombre] = (state.cantidades[nombre] || 0) + 1;
        guardar(); renderCantidades();
      });

      controls.appendChild(btnMinus);
      controls.appendChild(numEl);
      controls.appendChild(btnPlus);
      row.appendChild(nombreEl);
      row.appendChild(controls);
      cont.appendChild(row);
    });
  });

  const total = Object.values(state.cantidades).reduce((a, b) => a + b, 0);
  const totalRow = document.createElement('div');
  totalRow.className = 'cantidad-total';
  totalRow.innerHTML = `<span>Total del día</span><span class="total-num">${total}</span>`;
  cont.appendChild(totalRow);
}

document.getElementById('btn-reset-cantidades').addEventListener('click', () => {
  if (confirm('¿Borrar todos los contadores del día?')) {
    state.cantidades = {};
    guardar(); renderCantidades();
  }
});

/* ── Config ── */
function renderConfig() {
  const tagC = document.getElementById('tag-camareros');
  const tagP = document.getElementById('tag-platos');
  tagC.innerHTML = '';
  tagP.innerHTML = '';

  state.camareros.forEach(nombre => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `${nombre} <span class="tag-x">×</span>`;
    tag.querySelector('.tag-x').addEventListener('click', () => {
      state.camareros = state.camareros.filter(c => c !== nombre);
      guardar(); renderCamarerosDrag(); renderConfig();
    });
    tagC.appendChild(tag);
  });

  state.platos.forEach(({ nombre, seccion }) => {
    const tag = document.createElement('div');
    tag.className = 'tag tag-plato';

    const seccionSelect = document.createElement('select');
    seccionSelect.className = 'tag-seccion-select';
    ['cocina', 'plancha'].forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      if (s === seccion) opt.selected = true;
      seccionSelect.appendChild(opt);
    });
    seccionSelect.addEventListener('change', () => {
      const plato = state.platos.find(p => p.nombre === nombre);
      if (plato) plato.seccion = seccionSelect.value;
      guardar(); renderSeccion(); renderConfig();
    });

    const nombreSpan = document.createElement('span');
    nombreSpan.textContent = nombre;

    const x = document.createElement('span');
    x.className = 'tag-x';
    x.textContent = '×';
    x.addEventListener('click', () => {
      state.platos = state.platos.filter(p => p.nombre !== nombre);
      guardar(); renderSeccion(); renderConfig();
    });

    tag.appendChild(seccionSelect);
    tag.appendChild(nombreSpan);
    tag.appendChild(x);
    tagP.appendChild(tag);
  });
}

document.getElementById('btn-add-camarero').addEventListener('click', () => {
  const inp = document.getElementById('inp-camarero');
  const nombre = inp.value.trim();
  if (nombre && !state.camareros.includes(nombre)) {
    state.camareros.push(nombre);
    guardar(); renderCamarerosDrag(); renderConfig(); inp.value = '';
  }
});
document.getElementById('btn-add-plato').addEventListener('click', () => {
  const inp = document.getElementById('inp-plato');
  const sel = document.getElementById('sel-seccion-nueva');
  const nombre = inp.value.trim();
  if (nombre && !state.platos.find(p => p.nombre === nombre)) {
    state.platos.push({ nombre, seccion: sel.value });
    guardar(); renderSeccion(); renderConfig(); inp.value = '';
  }
});
document.getElementById('inp-camarero').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('btn-add-camarero').click(); });
document.getElementById('inp-plato').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('btn-add-plato').click(); });

/* ── Tabs principales ── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab, .panel').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');
    state.platoActivo = null;
    if (btn.dataset.tab === 'config') renderConfig();
    if (btn.dataset.tab === 'cantidades') renderCantidades();
    if (btn.dataset.tab === 'avisos') renderAvisos();
  });
});


/* ── Avisos: badge pestaña ── */
function actualizarAvisosBadge() {
  const enAlerta = state.ingredientes.filter(ing => ing.stockActual <= ing.umbral).length;
  const badge = document.getElementById('avisos-tab-badge');
  if (badge) { badge.textContent = enAlerta; badge.style.display = enAlerta > 0 ? 'inline-block' : 'none'; }
}

/* ── Avisos: render panel ── */
function renderAvisos() {
  renderAlertasStock();
  renderListaIngredientes();
  actualizarAvisosBadge();
}

function renderAlertasStock() {
  const cont = document.getElementById('avisos-alertas');
  cont.innerHTML = '';
  const enAlerta = state.ingredientes.filter(ing => ing.stockActual <= ing.umbral);
  if (enAlerta.length === 0) {
    cont.innerHTML = '<div style="background:var(--green-dim);border:1px solid var(--green);border-radius:var(--radius);padding:12px 16px;margin-bottom:16px;font-size:14px;color:var(--green);font-weight:500;">✓ Todo el stock está en niveles correctos</div>';
    return;
  }
  enAlerta.forEach(ing => {
    const critico = ing.stockActual <= ing.umbral * 0.5;
    const div = document.createElement('div');
    div.className = 'alerta-stock' + (critico ? ' critica' : '');
    div.innerHTML =
      '<span class="alerta-icono">' + (critico ? '🚨' : '⚠️') + '</span>' +
      '<span class="alerta-texto"><strong>' + ing.nombre + '</strong> — quedan ' +
      '<span class="alerta-stock-val">' + formatStock(ing.stockActual) + ' ' + ing.unidad + '</span>' +
      (critico ? ' · <em>¡Stock crítico!</em>' : ' (umbral: ' + ing.umbral + ' ' + ing.unidad + ')') +
      '</span>';
    cont.appendChild(div);
  });
}

function formatStock(val) {
  return Number.isInteger(val) ? val : parseFloat(val.toFixed(2));
}

function renderListaIngredientes() {
  const cont = document.getElementById('lista-ingredientes');
  cont.innerHTML = '';
  if (state.ingredientes.length === 0) {
    cont.innerHTML = '<p style="opacity:0.4;text-align:center;padding:30px 0;font-size:14px;">Sin ingredientes configurados.<br>Pulsa "+ Añadir ingrediente" para empezar.</p>';
    return;
  }
  state.ingredientes.forEach(ing => {
    const pct = ing.stockInicial > 0 ? Math.max(0, Math.min(100, (ing.stockActual / ing.stockInicial) * 100)) : 0;
    const enAlerta = ing.stockActual <= ing.umbral;
    const critico = ing.stockActual <= ing.umbral * 0.5;
    const colorBarra = critico ? 'roja' : enAlerta ? 'amarilla' : '';

    const row = document.createElement('div');
    row.className = 'ingrediente-row' + (critico ? ' critico' : enAlerta ? ' alerta' : '');

    const consumosValidos = Object.entries(ing.consumos || {}).filter(([, v]) => v > 0);
    const consumosHtml = consumosValidos.map(([plato, v]) =>
      '<span class="consumo-chip">' + plato + ': ' + formatStock(v) + ' ' + ing.unidad + '</span>').join('');

    row.innerHTML =
      '<div class="ingrediente-top">' +
        '<span class="ingrediente-nombre">' + ing.nombre + ' ' + (enAlerta ? (critico ? '🚨' : '⚠️') : '') + '</span>' +
        '<div class="ingrediente-stock-display">' +
          '<span class="stock-num">' + formatStock(ing.stockActual) + '</span>' +
          '<span class="stock-unidad">' + ing.unidad + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="stock-barra-wrap"><div class="stock-barra ' + colorBarra + '" style="width:' + pct + '%"></div></div>' +
      (consumosValidos.length > 0 ? '<div class="ingrediente-consumos">' + consumosHtml + '</div>' : '') +
      '<div class="ingrediente-acciones">' +
        '<button class="btn-ing-edit" data-id="' + ing.id + '">✏️ Editar</button>' +
        '<button class="btn-stock-reset" data-id="' + ing.id + '">↺ Reponer stock</button>' +
        '<button class="btn-ing-del" data-id="' + ing.id + '">🗑 Eliminar</button>' +
      '</div>';

    row.querySelector('.btn-ing-edit').addEventListener('click', () => abrirModalIngrediente(ing.id));
    row.querySelector('.btn-ing-del').addEventListener('click', () => {
      if (confirm('¿Eliminar ingrediente "' + ing.nombre + '"?')) {
        state.ingredientes = state.ingredientes.filter(i => i.id !== ing.id);
        guardar(); renderAvisos();
      }
    });
    row.querySelector('.btn-stock-reset').addEventListener('click', () => {
      ing.stockActual = ing.stockInicial;
      guardar(); renderAvisos();
    });
    cont.appendChild(row);
  });
}

/* ── Modal ingrediente ── */
function abrirModalIngrediente(id) {
  state._ingEditId = id || null;
  const ing = id ? state.ingredientes.find(i => i.id === id) : null;
  document.getElementById('inp-ing-nombre').value = ing ? ing.nombre : '';
  document.getElementById('inp-ing-stock').value = ing ? ing.stockInicial : 0;
  document.getElementById('inp-ing-unidad').value = ing ? ing.unidad : '';
  document.getElementById('inp-ing-umbral').value = ing ? ing.umbral : 10;
  renderModalConsumos(ing ? ing.consumos : {});
  document.getElementById('modal-ingrediente').style.display = 'flex';
}

function renderModalConsumos(consumosActuales) {
  const cont = document.getElementById('modal-consumos');
  cont.innerHTML = '';
  if (state.platos.length === 0) {
    cont.innerHTML = '<p style="opacity:0.4;font-size:13px;">No hay platos configurados.</p>';
    return;
  }
  state.platos.forEach(({ nombre }) => {
    const val = consumosActuales[nombre] !== undefined ? consumosActuales[nombre] : 0;
    const row = document.createElement('div');
    row.className = 'consumo-edit-row';
    row.innerHTML =
      '<span class="consumo-edit-nombre">' + nombre + '</span>' +
      '<input type="number" class="consumo-edit-input" data-plato="' + nombre + '" min="0" step="0.25" value="' + val + '" />' +
      '<span class="consumo-edit-label">por pedido</span>';
    cont.appendChild(row);
  });
}

function guardarModalIngrediente() {
  const nombre = document.getElementById('inp-ing-nombre').value.trim();
  if (!nombre) { alert('Indica el nombre del ingrediente'); return; }
  const stockInicial = parseFloat(document.getElementById('inp-ing-stock').value) || 0;
  const unidad = document.getElementById('inp-ing-unidad').value.trim() || 'uds';
  const umbral = parseFloat(document.getElementById('inp-ing-umbral').value) || 0;
  const consumos = {};
  document.querySelectorAll('#modal-consumos .consumo-edit-input').forEach(inp => {
    const v = parseFloat(inp.value);
    if (!isNaN(v) && v > 0) consumos[inp.dataset.plato] = v;
  });

  if (state._ingEditId) {
    const ing = state.ingredientes.find(i => i.id === state._ingEditId);
    if (ing) {
      const diffInicial = stockInicial - ing.stockInicial;
      ing.nombre = nombre; ing.stockInicial = stockInicial; ing.unidad = unidad;
      ing.umbral = umbral; ing.consumos = consumos;
      ing.stockActual = Math.max(0, ing.stockActual + diffInicial);
    }
  } else {
    state.ingredientes.push({ id: Date.now(), nombre, unidad, stockInicial, stockActual: stockInicial, umbral, consumos });
  }
  guardar();
  document.getElementById('modal-ingrediente').style.display = 'none';
  renderAvisos();
}

document.getElementById('btn-add-ingrediente-open').addEventListener('click', () => abrirModalIngrediente(null));
document.getElementById('btn-modal-save').addEventListener('click', guardarModalIngrediente);
document.getElementById('btn-modal-cancel').addEventListener('click', () => { document.getElementById('modal-ingrediente').style.display = 'none'; });
document.getElementById('modal-ingrediente').addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.style.display = 'none'; });

/* ── Descargar PDF cantidades ── */
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const RED = [139,16,16], GREEN = [45,90,39], DARK = [26,15,15];
  const LIGHT_RED = [250,235,235], LIGHT_GREEN = [235,245,233], LIGHT_ORANGE = [255,245,230], ORANGE = [184,92,0];
  const W = 210, MARGIN = 18, COL_W = W - MARGIN * 2;

  doc.setFillColor(...RED);
  doc.rect(0, 0, W, 32, 'F');
  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold'); doc.setFontSize(22);
  doc.text('Comandas · Día de la Cruz', MARGIN, 13);
  doc.setFont('helvetica','normal'); doc.setFontSize(10);
  doc.text('Granada', MARGIN, 20);
  doc.setFontSize(9);
  doc.text('Generado el ' + fecha + ' a las ' + hora, MARGIN, 27);

  let y = 42;
  const pendientes = state.cola.filter(x => !x.entregada).length;
  const listos = state.cola.filter(x => x.entregada).length;
  doc.setFillColor(245,245,245);
  doc.roundedRect(MARGIN, y, COL_W, 14, 3, 3, 'F');
  doc.setTextColor(...DARK); doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.text('Pedidos pendientes: ' + pendientes + '   ·   Entregados: ' + listos + '   ·   Total: ' + state.cola.length, MARGIN+4, y+9);
  y += 20;

  ['cocina','plancha'].forEach(sec => {
    const platosGrupo = state.platos.filter(p => p.seccion === sec);
    if (!platosGrupo.length) return;
    const bgSec = sec === 'cocina' ? LIGHT_RED : LIGHT_ORANGE;
    const colorSec = sec === 'cocina' ? RED : ORANGE;
    doc.setFillColor(...bgSec); doc.roundedRect(MARGIN, y, COL_W, 9, 2, 2, 'F');
    doc.setTextColor(...colorSec); doc.setFont('helvetica','bold'); doc.setFontSize(9);
    doc.text(sec.toUpperCase(), MARGIN+4, y+6);
    y += 13;
    platosGrupo.forEach(({ nombre }, idx) => {
      if (y > 265) { doc.addPage(); y = 20; }
      const count = state.cantidades[nombre] || 0;
      doc.setFillColor(...(idx%2===0 ? [255,255,255] : [250,248,246]));
      doc.rect(MARGIN, y, COL_W, 9, 'F');
      doc.setDrawColor(220,200,200); doc.rect(MARGIN, y, COL_W, 9);
      doc.setTextColor(...DARK); doc.setFont('helvetica','normal'); doc.setFontSize(10);
      doc.text(nombre, MARGIN+4, y+6.3);
      doc.setFont('helvetica','bold'); doc.setTextColor(...RED); doc.setFontSize(13);
      doc.text(String(count), MARGIN+COL_W-12, y+6.8, { align:'right' });
      y += 9;
    });
    y += 6;
  });

  doc.setDrawColor(...RED); doc.setLineWidth(0.5);
  doc.line(MARGIN, y, MARGIN+COL_W, y); y += 8;
  const total = Object.values(state.cantidades).reduce((a,b) => a+b, 0);
  doc.setFillColor(...LIGHT_RED); doc.roundedRect(MARGIN, y, COL_W, 14, 3, 3, 'F');
  doc.setTextColor(...RED); doc.setFont('helvetica','bold'); doc.setFontSize(12);
  doc.text('TOTAL DEL DÍA', MARGIN+4, y+9);
  doc.setFontSize(16); doc.text(String(total), MARGIN+COL_W-6, y+9.5, { align:'right' });
  y += 22;

  if (state.ingredientes.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setTextColor(...GREEN); doc.setFont('helvetica','bold'); doc.setFontSize(11);
    doc.text('Estado del stock', MARGIN, y); y += 8;
    state.ingredientes.forEach(ing => {
      if (y > 265) { doc.addPage(); y = 20; }
      const enAlerta = ing.stockActual <= ing.umbral;
      doc.setFillColor(...(enAlerta ? [255,240,220] : LIGHT_GREEN));
      doc.roundedRect(MARGIN, y, COL_W, 10, 2, 2, 'F');
      doc.setTextColor(...DARK); doc.setFont('helvetica','normal'); doc.setFontSize(10);
      doc.text(ing.nombre, MARGIN+4, y+7);
      const col = enAlerta ? ORANGE : GREEN;
      doc.setFont('helvetica','bold'); doc.setTextColor(...col);
      doc.text(formatStock(ing.stockActual) + ' / ' + ing.stockInicial + ' ' + ing.unidad, MARGIN+COL_W-4, y+7, { align:'right' });
      y += 12;
    });
    y += 4;
  }

  if (y > 265) { doc.addPage(); y = 20; }
  doc.setDrawColor(200,200,200); doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN+COL_W, y); y += 5;
  doc.setTextColor(150,150,150); doc.setFont('helvetica','italic'); doc.setFontSize(8);
  doc.text('Comandas · Día de la Cruz · Granada', W/2, y, { align:'center' });

  doc.save('comandas_' + new Date().toISOString().slice(0,10) + '.pdf');
}

document.getElementById('btn-descargar-pdf').addEventListener('click', descargarPDF);

/* ── Init ── */
cargar();
renderCamarerosDrag();
renderSeccion();
actualizarStats();
actualizarAvisosBadge();
