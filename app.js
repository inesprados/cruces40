/* ── Estado ── */
const state = {
  camareros: ['Ana', 'Carlos', 'María', 'Paco', 'Lucía'],
  platos: ['Montadito', 'Croquetas', 'Bravas', 'Tortilla', 'Pulpo', 'Salmorejo'],
  cola: [],
  contador: 1,
  platoActivo: null,
  camareroSeleccionado: null, // Para modo tablet
};

// Al inicio de app.js, después de las variables
(function() {
  // Forzar compatibilidad iPad
  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    document.addEventListener('touchstart', function(){}, {passive: true});
    // Prevenir zoom
    document.addEventListener('gesturestart', function(e) { e.preventDefault(); });
  }
})();

/* ── Gestión de Cookies ── */
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
  const toSave = { camareros: state.camareros, platos: state.platos, cola: state.cola, contador: state.contador };
  setCookie('comandas_cruz_v3', toSave);
}

function cargar() {
  const datos = getCookie('comandas_cruz_v3');
  if (datos) {
    state.camareros = datos.camareros || state.camareros;
    state.platos = datos.platos || state.platos;
    state.cola = datos.cola || [];
    state.contador = datos.contador || 1;
  }
}

/* ── Detectar si es táctil ── */
function esTactil() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

/* ── Swipe to delete ── */
function addSwipeToDelete(el, onDelete) {
  let startX = null;
  let startY = null;
  let dx = 0;
  let swiping = false;
  let threshold = 0;

  function pointerDown(e) {
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    dx = 0;
    swiping = false;
    threshold = 0;
    el.style.transition = 'none';
  }

  function pointerMove(e) {
    if (startX === null) return;
    const touch = e.touches ? e.touches[0] : e;
    dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    
    if (!swiping && Math.abs(dx) > 10) {
      if (Math.abs(dy) > Math.abs(dx)) {
        startX = null;
        return;
      }
      swiping = true;
    }
    
    if (swiping) {
      threshold = dx;
      if (dx < 0) {
        el.style.transform = `translateX(${dx}px)`;
        el.style.opacity = Math.max(0.4, 1 + dx / 200);
        if (e.cancelable) e.preventDefault();
      } else {
        el.style.transform = `translateX(0)`;
        el.style.opacity = '1';
      }
    }
  }

  function pointerUp() {
    if (startX === null) return;
    
    if (threshold < -80) {
      el.style.transition = 'transform 0.25s ease, opacity 0.25s ease, max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease';
      el.style.transform = 'translateX(-120%)';
      el.style.opacity = '0';
      el.style.overflow = 'hidden';
      el.style.pointerEvents = 'none';
      setTimeout(() => {
        el.style.maxHeight = '0';
        el.style.padding = '0 14px';
        el.style.marginTop = '0';
        el.style.marginBottom = '0';
      }, 150);
      setTimeout(onDelete, 350);
    } else {
      el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }
    startX = null;
    swiping = false;
  }

  el.addEventListener('touchstart', pointerDown, { passive: true });
  el.addEventListener('touchmove', pointerMove, { passive: false });
  el.addEventListener('touchend', pointerUp);
  
  // Soporte ratón
  el.addEventListener('mousedown', pointerDown);
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);
}

/* ── Render Camareros (modo tablet: tap para seleccionar) ── */
function renderCamarerosDrag() {
  const lista = document.getElementById('lista-camareros-drag');
  lista.innerHTML = '';
  
  // Instrucción según dispositivo
  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:13px; color:var(--text); opacity:0.6; margin:0 0 12px 0;';
  hint.textContent = esTactil() ? '👆 Toca un camarero, luego toca un plato' : 'Arrastra el camarero al plato';
  lista.appendChild(hint);
  
  state.camareros.forEach(nombre => {
    const el = document.createElement('div');
    el.className = 'plato-item';
    el.setAttribute('data-camarero', nombre);
    
    // Contenido
    el.innerHTML = `👤 ${nombre}`;
    
    // Indicador de selección
    if (state.camareroSeleccionado === nombre) {
      el.style.background = 'var(--red-dim)';
      el.style.borderColor = 'var(--red)';
      el.style.boxShadow = '0 0 0 2px var(--red-dim2)';
    }
    
    // MODO TÁCTIL: Tap para seleccionar
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.camareroSeleccionado === nombre) {
        state.camareroSeleccionado = null;
      } else {
        state.camareroSeleccionado = nombre;
      }
      renderCamarerosDrag();
    });
    
    // MODO RATÓN: Drag & drop (solo si no es táctil)
    if (!esTactil()) {
      el.draggable = true;
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', nombre);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
    }
    
    lista.appendChild(el);
  });
  
  // Botón para limpiar selección
  if (state.camareroSeleccionado) {
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '✕ Limpiar selección';
    clearBtn.style.cssText = 'margin-top:12px; padding:8px 16px; background:transparent; border:1px solid var(--border2); border-radius:var(--radius); color:var(--red); cursor:pointer; font-family:inherit; font-size:13px; width:100%;';
    clearBtn.addEventListener('click', () => {
      state.camareroSeleccionado = null;
      renderCamarerosDrag();
    });
    lista.appendChild(clearBtn);
  }
}

/* ── Render Platos Drop (vista general) ── */
function renderPlatosDrop() {
  const lista = document.getElementById('lista-platos-drop');
  lista.innerHTML = '';
  
  state.platos.forEach(plato => {
    const zona = document.createElement('div');
    zona.className = 'camarero-drop-zone';
    zona.dataset.plato = plato;

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;';

    const titulo = document.createElement('div');
    titulo.className = 'camarero-nombre';
    titulo.style.marginBottom = '0';
    titulo.textContent = plato;

    const pendientes = state.cola.filter(p => p.plato === plato && !p.entregada).length;
    const badge = document.createElement('span');
    badge.className = 'plato-tab-badge';
    badge.textContent = pendientes > 0 ? pendientes : '';
    badge.style.display = pendientes > 0 ? 'inline-block' : 'none';

    const btnDetalle = document.createElement('button');
    btnDetalle.className = 'btn-detalle';
    btnDetalle.textContent = 'Ver detalle';
    btnDetalle.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirDetallePlato(plato);
    });

    header.appendChild(titulo);
    const rightSide = document.createElement('div');
    rightSide.style.cssText = 'display:flex;align-items:center;gap:8px;';
    rightSide.appendChild(badge);
    rightSide.appendChild(btnDetalle);
    header.appendChild(rightSide);
    zona.appendChild(header);

    // MODO TÁCTIL: Zona clickeable
    zona.addEventListener('click', (e) => {
      // Si el click fue en el botón detalle, no hacer nada
      if (e.target.classList.contains('btn-detalle')) return;
      
      if (state.camareroSeleccionado) {
        añadirPedido(plato, state.camareroSeleccionado);
        state.camareroSeleccionado = null;
        renderCamarerosDrag();
      } else {
        // Feedback visual
        zona.style.transition = 'background 0.15s';
        zona.style.background = 'var(--red-dim)';
        setTimeout(() => zona.style.background = '', 150);
      }
    });

    const pedidosCont = document.createElement('div');
    pedidosCont.className = 'pedidos-list';

    state.cola.filter(p => p.plato === plato && !p.entregada).forEach(p => {
      const badge = crearBadgePedido(p);
      pedidosCont.appendChild(badge);
    });

    zona.appendChild(pedidosCont);

    // MODO RATÓN: Drag & drop
    if (!esTactil()) {
      zona.addEventListener('dragover', e => { e.preventDefault(); zona.classList.add('drag-over'); });
      zona.addEventListener('dragleave', () => zona.classList.remove('drag-over'));
      zona.addEventListener('drop', e => {
        e.preventDefault();
        zona.classList.remove('drag-over');
        const nombreCamarero = e.dataTransfer.getData('text/plain');
        if (nombreCamarero) añadirPedido(plato, nombreCamarero);
      });
    }

    lista.appendChild(zona);
  });
}

/* ── Crear badge de pedido con swipe ── */
function crearBadgePedido(p) {
  const badge = document.createElement('div');
  badge.className = 'pedido-badge';
  badge.dataset.id = p.id;
  badge.style.pointerEvents = 'auto';
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

/* ── Vista detalle de plato ── */
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
    lista.innerHTML = '<p style="color:var(--text);opacity:0.45;text-align:center;padding:30px 0;font-size:15px;">Sin pedidos pendientes</p>';
    return;
  }

  pedidos.forEach(p => {
    const badge = document.createElement('div');
    badge.className = 'pedido-badge pedido-badge-grande';
    badge.dataset.id = p.id;
    badge.style.pointerEvents = 'auto';
    badge.innerHTML = `
      <span class="pedido-num">#${p.id}</span>
      <span class="pedido-camarero">${p.camarero}</span>
      <span class="pedido-hora">${p.hora}</span>
      <span class="swipe-hint">← desliza para eliminar</span>
    `;
    addSwipeToDelete(badge, () => {
      state.cola = state.cola.filter(x => x.id !== p.id);
      guardar();
      actualizarTodo();
      renderDetallePlato(plato);
    });
    lista.appendChild(badge);
  });
}

function cerrarDetalle() {
  state.platoActivo = null;
  document.getElementById('panel-detalle').classList.remove('active');
  document.getElementById('panel-comandas').classList.add('active');
  document.querySelector('.tab[data-tab="comandas"]').classList.add('active');
  actualizarTodo();
}

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
  guardar();
  actualizarTodo();
}

function actualizarTodo() {
  actualizarStats();
  renderPlatosDrop();
  renderCamarerosDrag();
}

function actualizarStats() {
  const p = state.cola.filter(x => !x.entregada).length;
  const l = state.cola.filter(x => x.entregada).length;
  document.getElementById('stat-pendientes').textContent = `${p} pendientes`;
  document.getElementById('stat-listos').textContent = `${l} listos`;
}

/* ── Config ── */
function renderConfig() {
  const tagC = document.getElementById('tag-camareros');
  const tagP = document.getElementById('tag-platos');
  tagC.innerHTML = '';
  tagP.innerHTML = '';

  state.camareros.forEach(nombre => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `${nombre} <span class="tag-x" data-nombre="${nombre}">×</span>`;
    tag.querySelector('.tag-x').addEventListener('click', () => {
      state.camareros = state.camareros.filter(c => c !== nombre);
      guardar();
      renderCamarerosDrag();
      renderConfig();
    });
    tagC.appendChild(tag);
  });

  state.platos.forEach(plato => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `${plato} <span class="tag-x" data-plato="${plato}">×</span>`;
    tag.querySelector('.tag-x').addEventListener('click', () => {
      state.platos = state.platos.filter(p => p !== plato);
      guardar();
      renderPlatosDrop();
      renderConfig();
    });
    tagP.appendChild(tag);
  });
}

/* ── Tabs ── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab, .panel').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    const panelId = `panel-${btn.dataset.tab}`;
    document.getElementById(panelId).classList.add('active');
    state.platoActivo = null;
    state.camareroSeleccionado = null;
    if (btn.dataset.tab === 'config') {
      renderConfig();
    } else {
      renderCamarerosDrag();
    }
  });
});

/* ── Botón volver detalle ── */
document.getElementById('btn-volver').addEventListener('click', cerrarDetalle);

/* ── Config: añadir camarero/plato ── */
document.getElementById('btn-add-camarero').addEventListener('click', () => {
  const inp = document.getElementById('inp-camarero');
  const nombre = inp.value.trim();
  if (nombre && !state.camareros.includes(nombre)) {
    state.camareros.push(nombre);
    guardar();
    renderCamarerosDrag();
    renderConfig();
    inp.value = '';
  }
});

document.getElementById('btn-add-plato').addEventListener('click', () => {
  const inp = document.getElementById('inp-plato');
  const nombre = inp.value.trim();
  if (nombre && !state.platos.includes(nombre)) {
    state.platos.push(nombre);
    guardar();
    renderPlatosDrop();
    renderConfig();
    inp.value = '';
  }
});

document.getElementById('inp-camarero').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('btn-add-camarero').click(); });
document.getElementById('inp-plato').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('btn-add-plato').click(); });

/* ── Init ── */
cargar();
renderCamarerosDrag();
renderPlatosDrop();
actualizarStats();
