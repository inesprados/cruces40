const state = {
  camareros: ['Ana', 'Carlos', 'María'],
  platos: [
    { nombre: 'Montadito', seccion: 'plancha' },
    { nombre: 'Croquetas', seccion: 'cocina' },
    { nombre: 'Tapa jamón', seccion: 'plancha' }
  ],
  ingredientes: [], // { id, nombre, unidad, stockInicial, stockActual, consumos: {nombrePlato: valor} }
  cola: [],
  contador: 1,
  catActiva: 'plancha',
  _editIngId: null
};

/* --- COOKIES --- */
function guardar() {
  const d = new Date(); d.setTime(d.getTime() + (7*24*60*60*1000));
  document.cookie = `comandas_pro_v5=${encodeURIComponent(JSON.stringify(state))};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function cargar() {
  const name = "comandas_pro_v5=";
  const ca = document.cookie.split(';');
  for(let i=0; i<ca.length; i++) {
    let c = ca[i].trim();
    if(c.indexOf(name) == 0) {
      try { Object.assign(state, JSON.parse(decodeURIComponent(c.substring(name.length)))); } catch(e){}
    }
  }
}

/* --- RENDER COMANDAS --- */
function renderCamareros() {
  const cont = document.getElementById('lista-camareros-drag');
  cont.innerHTML = '';
  state.camareros.forEach(c => {
    const el = document.createElement('div');
    el.className = 'camarero-card';
    el.draggable = true;
    el.textContent = c;
    el.ondragstart = (e) => e.dataTransfer.setData('text', c);
    cont.appendChild(el);
  });
}

function renderPlatos() {
  const cont = document.getElementById('lista-platos-drop');
  cont.innerHTML = '';
  document.getElementById('nombre-cat-actual').textContent = state.catActiva;

  state.platos.filter(p => p.seccion === state.catActiva).forEach(p => {
    const zone = document.createElement('div');
    zone.className = 'plato-drop-zone';
    zone.innerHTML = `<span class="plato-titulo">${p.nombre}</span><div class="pedidos-cont"></div>`;
    
    const pedidosCont = zone.querySelector('.pedidos-cont');
    state.cola.filter(ped => ped.plato === p.nombre && !ped.entregada).forEach(ped => {
      pedidosCont.innerHTML += `<div class="badge-pedido"><span>${ped.camarero}</span><small>#${ped.id}</small></div>`;
    });

    zone.ondragover = (e) => { e.preventDefault(); zone.classList.add('drag-over'); };
    zone.ondragleave = () => zone.classList.remove('drag-over');
    zone.ondrop = (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const cam = e.dataTransfer.getData('text');
      if(cam) nuevoPedido(p.nombre, cam);
    };
    cont.appendChild(zone);
  });
}

function nuevoPedido(plato, camarero) {
  const p = { id: state.contador++, plato, camarero, entregada: false, hora: new Date().toLocaleTimeString() };
  state.cola.push(p);
  // Descontar stock
  state.ingredientes.forEach(ing => {
    const gasto = ing.consumos[plato] || 0;
    ing.stockActual = Math.max(0, ing.stockActual - gasto);
  });
  guardar();
  actualizarUI();
}

function actualizarUI() {
  renderPlatos();
  renderStock();
  document.getElementById('stat-pendientes').textContent = state.cola.filter(p => !p.entregada).length;
}

/* --- GESTIÓN STOCK --- */
function renderStock() {
  const cont = document.getElementById('lista-ingredientes');
  cont.innerHTML = '';
  state.ingredientes.forEach(ing => {
    const alert = ing.stockActual < (ing.stockInicial * 0.2);
    const card = document.createElement('div');
    card.className = `stock-card ${alert ? 'alert' : ''}`;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:start">
        <strong>${ing.nombre}</strong>
        <button class="sub-tab" style="padding:2px 8px" onclick="editarIngrediente(${ing.id})">⚙</button>
      </div>
      <div style="font-size: 20px; margin: 10px 0;">${ing.stockActual.toFixed(2)} / ${ing.stockInicial} <small>${ing.unit || 'uds'}</small></div>
      <div style="height:8px; background:#eee; border-radius:4px; overflow:hidden">
        <div style="width:${(ing.stockActual/ing.stockInicial)*100}%; height:100%; background:${alert?'var(--red)':'var(--green)'}"></div>
      </div>
    `;
    cont.appendChild(card);
  });
}

/* --- MODAL --- */
const modal = document.getElementById('modal-stock');
document.getElementById('btn-nuevo-ingrediente').onclick = () => {
  state._editIngId = null;
  document.getElementById('mod-ing-nombre').value = '';
  abrirModal();
};

function abrirModal() {
  const listConsumos = document.getElementById('modal-consumos');
  listConsumos.innerHTML = state.platos.map(p => `
    <div class="consumo-edit-row" style="display:flex; justify-content:space-between; margin-bottom:5px">
      <span style="font-size:12px">${p.nombre}</span>
      <input type="number" step="0.001" class="add-input ing-cons" data-plato="${p.nombre}" style="width:70px; padding:2px" value="0">
    </div>
  `).join('');
  modal.classList.add('active');
}

document.getElementById('btn-modal-save').onclick = () => {
  const ing = {
    id: state._editIngId || Date.now(),
    nombre: document.getElementById('mod-ing-nombre').value,
    unit: document.getElementById('mod-ing-unidad').value,
    stockActual: parseFloat(document.getElementById('mod-ing-actual').value),
    stockInicial: parseFloat(document.getElementById('mod-ing-inicial').value),
    consumos: {}
  };
  document.querySelectorAll('.ing-cons').forEach(inp => {
    ing.consumos[inp.dataset.plato] = parseFloat(inp.value) || 0;
  });

  if(state._editIngId) state.ingredientes = state.ingredientes.map(i => i.id === ing.id ? ing : i);
  else state.ingredientes.push(ing);
  
  guardar(); modal.classList.remove('active'); renderStock();
};

document.getElementById('btn-modal-cancel').onclick = () => modal.classList.remove('active');

/* --- NAVEGACIÓN --- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn, .panel').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');
    if(btn.dataset.tab === 'cola') renderCola();
    if(btn.dataset.tab === 'config') renderConfig();
  };
});

document.querySelectorAll('.sub-tab').forEach(btn => {
  btn.onclick = () => {
    state.catActiva = btn.dataset.cat;
    document.querySelectorAll('.sub-tab').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    renderPlatos();
  };
});

/* --- CONFIG Y COLA --- */
function renderConfig() {
  document.getElementById('tag-camareros').innerHTML = state.camareros.map(c => `<span class="tag">${c}</span>`).join('');
  document.getElementById('tag-platos').innerHTML = state.platos.map(p => `<span class="tag">${p.seccion.toUpperCase()}: ${p.nombre}</span>`).join('');
}

document.getElementById('btn-add-plato').onclick = () => {
  const nom = document.getElementById('inp-plato').value;
  const sec = document.getElementById('sel-cat-nueva').value;
  if(nom) { state.platos.push({nombre: nom, seccion: sec}); guardar(); renderConfig(); renderPlatos(); }
};

function renderCola() {
  const cont = document.getElementById('lista-cola');
  cont.innerHTML = state.cola.map(p => `
    <div class="badge-pedido" style="padding:10px; margin-bottom:5px; opacity:${p.entregada?0.5:1}">
      <span>#${p.id} - ${p.plato} (${p.camarero})</span>
      <button onclick="toggleEntregado(${p.id})">${p.entregada?'Reabrir':'Entregar'}</button>
    </div>
  `).join('');
}

window.toggleEntregado = (id) => {
  const p = state.cola.find(x => x.id === id);
  if(p) p.entregada = !p.entregada;
  guardar(); renderCola(); actualizarUI();
};

document.getElementById('btn-limpiar').onclick = () => {
  state.cola = state.cola.filter(p => !p.entregada);
  guardar(); renderCola(); actualizarUI();
};

/* --- INIT --- */
cargar();
renderCamareros();
renderPlatos();
renderStock();
actualizarUI();
