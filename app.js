/* ── Estado ── */
const state = {
  camareros: ['Ana', 'Carlos', 'María', 'Paco', 'Lucía'],
  platos: [
    { nombre: 'Montadito', seccion: 'cocina' },
    { nombre: 'Croquetas', seccion: 'cocina' },
    { nombre: 'Salmorejo', seccion: 'cocina' },
    { nombre: 'Bravas', seccion: 'plancha' },
    { nombre: 'Tortilla', seccion: 'plancha' },
    { nombre: 'Pulpo', seccion: 'plancha' },
  ],
  cola: [],
  cantidades: {},
  contador: 1,
  seccionActiva: 'cocina',
  platoActivo: null,
};

/* ── Cookies ── */
function setCookie(name, value) {
  const date = new Date();
  date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      try { return JSON.parse(decodeURIComponent(c.substring(nameEQ.length))); }
      catch (e) { return null; }
    }
  }
  return null;
}
function guardar() {
  setCookie('comandas_cruz_v3', {
    camareros: state.camareros,
    platos: state.platos,
    cola: state.cola,
    cantidades: state.cantidades,
    contador: state.contador,
  });
}
function cargar() {
  const datos = getCookie('comandas_cruz_v3');
  if (datos) {
    if (datos.camareros) state.camareros = datos.camareros;
    if (datos.platos) state.platos = datos.platos;
    if (datos.cola) state.cola = datos.cola;
    if (datos.cantidades) state.cantidades = datos.cantidades;
    if (datos.contador) state.contador = datos.contador;
  }
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

/* ── Camareros horizontal ── */
function renderCamarerosDrag() {
  const lista = document.getElementById('lista-camareros-drag');
  lista.innerHTML = '';
  state.camareros.forEach(nombre => {
    const el = document.createElement('div');
    el.className = 'camarero-chip';
    el.draggable = true;
    el.textContent = nombre;
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', nombre);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
    lista.appendChild(el);
  });
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

    zona.addEventListener('dragover', e => { e.preventDefault(); zona.classList.add('drag-over'); });
    zona.addEventListener('dragleave', () => zona.classList.remove('drag-over'));
    zona.addEventListener('drop', e => {
      e.preventDefault();
      zona.classList.remove('drag-over');
      const nombreCamarero = e.dataTransfer.getData('text/plain');
      if (nombreCamarero) añadirPedido(nombre, nombreCamarero);
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
  guardar();
  actualizarTodo();
}

function actualizarTodo() {
  actualizarStats();
  renderSeccion();
  if (document.getElementById('panel-cantidades').classList.contains('active')) renderCantidades();
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
  });
});

/* ── Init ── */
cargar();
renderCamarerosDrag();
renderSeccion();
actualizarStats();
