
/* ══════════════════════════════════════════════════════════
   All book / doctor / food / reservation data now comes from
   the backend (see API_BASE in index.html). apiFetch(), getToken(),
   etc. are defined there and shared globally since both files
   are plain (non-module) scripts on the same page.
══════════════════════════════════════════════════════════ */

// Local caches so modals can look up an item by id without a second
// network round trip (populated whenever a list is fetched/rendered).
window._bookIndex = window._bookIndex || {};
window._doctorIndex = window._doctorIndex || {};

/* ══════════════════════════════════════════════════════════
   AUTOCOMPLETE BOOK SEARCH
══════════════════════════════════════════════════════════ */
let acBookIdx = -1, currentBookObj = null;
let bookSearchToken = 0;

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
  return text.replace(re, '<em>$1</em>');
}

async function handleBookSearch(val) {
  const drop = document.getElementById('bookAcDrop');
  const items = document.getElementById('acDropItems');
  const lbl = document.getElementById('acDropLbl');
  acBookIdx = -1;

  const myToken = ++bookSearchToken;
  let sugs = [];
  try {
    const data = await apiFetch('/api/library/books?q=' + encodeURIComponent(val));
    sugs = data.books;
  } catch (err) {
    if (myToken !== bookSearchToken) return; // a newer keystroke already fired
    items.innerHTML = '<div class="ac-no-result">Could not reach the library service.</div>';
    drop.classList.add('show');
    return;
  }
  if (myToken !== bookSearchToken) return; // stale response, ignore

  sugs.forEach(b => window._bookIndex[b.id] = b);

  if (!sugs.length) {
    items.innerHTML = '<div class="ac-no-result">No books found for "' + val + '"</div>';
    lbl.textContent = '';
    drop.classList.add('show'); return;
  }
  lbl.textContent = val ? sugs.length + ' result' + (sugs.length > 1 ? 's' : '') : 'Top ' + sugs.length;
  let html = '';
  sugs.forEach((b, i) => {
    const copyCls = b.copies > 3 ? 'good' : 'low';
    html += `<div class="ac-row" id="acrow${i}" onmousedown="openBookModal(${b.id})">
      <div class="ac-row-num">${i + 1}</div>
      <div class="ac-row-ico">${b.icon}</div>
      <div class="ac-row-body">
        <div class="ac-row-title">${highlight(b.title, val)}</div>
        <div class="ac-row-author">✍️ ${b.author} &nbsp;·&nbsp; 📁 ${b.category}</div>
      </div>
      <div class="ac-row-copies ${copyCls}">${b.copies} left</div>
    </div>`;
  });
  items.innerHTML = html;
  drop.classList.add('show');
}
function closeBookAC() {
  document.getElementById('bookAcDrop').classList.remove('show');
  acBookIdx = -1;
}
function handleBookKey(e) {
  const rows = document.querySelectorAll('.ac-row');
  if (!rows.length) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); acBookIdx = Math.min(acBookIdx+1, rows.length-1); updateBookSel(rows); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); acBookIdx = Math.max(acBookIdx-1, 0); updateBookSel(rows); }
  else if (e.key === 'Enter' && acBookIdx >= 0) { rows[acBookIdx].dispatchEvent(new MouseEvent('mousedown')); closeBookAC(); }
  else if (e.key === 'Escape') closeBookAC();
}
function updateBookSel(rows) {
  rows.forEach((r, i) => r.classList.toggle('ac-sel', i === acBookIdx));
  if (acBookIdx >= 0) rows[acBookIdx].scrollIntoView({ block: 'nearest' });
}

/* ── BOOK MODAL ── */
async function openBookModal(id) {
  let b = window._bookIndex[id];
  if (!b) {
    try { const data = await apiFetch('/api/library/books/' + id); b = data.book; }
    catch (err) { showToast('❌ Could not load that book', 'warn'); return; }
  }
  currentBookObj = b;
  document.getElementById('bpIcon').textContent = b.icon;
  document.getElementById('bpTitle').textContent = b.title;
  document.getElementById('bpAuthor').textContent = 'by ' + b.author;
  document.getElementById('bpCopies').textContent = b.copies;
  document.getElementById('bpCopies').style.color = b.copies > 3 ? '#34d399' : '#fbbf24';
  document.getElementById('bpShelf').textContent = b.shelf;
  document.getElementById('bpCat').textContent = b.category;
  document.getElementById('bpYear').textContent = b.year;
  document.getElementById('bookModal').classList.add('show');
  closeBookAC();
}
function closeBookModal() { document.getElementById('bookModal').classList.remove('show'); }
async function doReserveBook() {
  if (!currentBookObj) return;
  if (currentBookObj.copies <= 0) { showToast('❌ No copies available for this book', 'warn'); return; }
  if (!getToken()) { showToast('⚠️ Please sign in again', 'warn'); return; }
  try {
    await apiFetch('/api/library/reservations', { method: 'POST', body: JSON.stringify({ bookId: currentBookObj.id }) });
    showToast('✅ "' + currentBookObj.title.slice(0, 32) + '…" reserved!');
    closeBookModal();
    renderLibTable();
  } catch (err) {
    showToast('❌ ' + err.message, 'warn');
  }
}
async function renderLibTable() {
  const tb = document.getElementById('libBody');
  const cnt = document.getElementById('libCnt');
  if (!tb) return;
  try {
    const { reservations } = await apiFetch('/api/library/reservations');
    window._lastLibReservations = reservations;
    if (cnt) cnt.textContent = reservations.length;
    if (!reservations.length) { tb.innerHTML = '<tr><td class="empty" colspan="5">No reservations yet.</td></tr>'; return; }
    tb.innerHTML = reservations.map(r => `<tr>
      <td>${r.title}</td><td>${r.author}</td><td style="font-family:var(--mono);color:var(--brand)">#${r.book_id}</td>
      <td><span class="chip av">${r.status}</span></td>
      <td><button class="del-btn" onclick="removeLib(${r.id})">Remove</button></td>
    </tr>`).join('');
  } catch (err) {
    tb.innerHTML = '<tr><td class="empty" colspan="5">Sign in to see your reservations.</td></tr>';
  }
}
async function removeLib(reservationId) {
  try {
    await apiFetch('/api/library/reservations/' + reservationId, { method: 'DELETE' });
    showToast('Reservation removed.');
    renderLibTable();
  } catch (err) {
    showToast('❌ ' + err.message, 'warn');
  }
}

/* ══════════════════════════════════════════════════════════
   DOCTOR SEARCH + CARDS
══════════════════════════════════════════════════════════ */
let acDocIdx = -1, currentDocObj = null;
let docFilterMode = 'all';
let docSearchToken = 0;

function docTypeParam(mode){
  if (mode === 'general' || mode === 'specialist') return mode;
  return null; // 'all' and 'available' are filtered after fetch
}

async function fetchDoctors(mode, q){
  const type = docTypeParam(mode);
  let path = '/api/hospital/doctors?';
  if (type) path += 'type=' + type + '&';
  if (q) path += 'q=' + encodeURIComponent(q);
  const { doctors } = await apiFetch(path);
  doctors.forEach(d => window._doctorIndex[d.id] = d);
  if (mode === 'available') return doctors.filter(d => d.avail === 'Available');
  return doctors;
}

async function handleDocSearch(val) {
  const drop = document.getElementById('docAcDrop');
  const items = document.getElementById('docAcItems');
  const lbl = document.getElementById('docDropLbl');
  if (!drop || !items) return;
  acDocIdx = -1;
  const myToken = ++docSearchToken;
  let sugs = [];
  try { sugs = await fetchDoctors(docFilterMode, val); }
  catch (err) {
    if (myToken !== docSearchToken) return;
    items.innerHTML = '<div class="ac-no-result">Could not reach the hospital service.</div>';
    drop.classList.add('show');
    return;
  }
  if (myToken !== docSearchToken) return;

  if (!sugs.length) {
    items.innerHTML = '<div class="ac-no-result">No doctors found for "' + val + '"</div>';
    lbl.textContent = '';
    drop.classList.add('show'); return;
  }
  lbl.textContent = val ? sugs.length + ' found' : 'All ' + sugs.length;
  let html = '';
  sugs.forEach((d, i) => {
    const avCls = d.avail === 'Available' ? 'good' : 'low';
    html += `<div class="ac-row" id="docrow${i}" onmousedown="openDocModal(${d.id})">
      <div class="ac-row-num">${i + 1}</div>
      <div class="ac-row-ico">${d.icon}</div>
      <div class="ac-row-body">
        <div class="ac-row-title">${highlight(d.name, val)}</div>
        <div class="ac-row-author">🏥 ${highlight(d.spec, val)} &nbsp;·&nbsp; 🚪 Room ${d.room}</div>
      </div>
      <div class="ac-row-copies ${avCls}">${d.avail}</div>
    </div>`;
  });
  items.innerHTML = html;
  drop.classList.add('show');
}
function closeDocAC() {
  const drop = document.getElementById('docAcDrop');
  if (drop) drop.classList.remove('show');
  acDocIdx = -1;
}
function handleDocKey(e) {
  const rows = document.querySelectorAll('#docAcItems .ac-row');
  if (!rows.length) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); acDocIdx = Math.min(acDocIdx+1, rows.length-1); rows.forEach((r,i)=>r.classList.toggle('ac-sel',i===acDocIdx)); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); acDocIdx = Math.max(acDocIdx-1, 0); rows.forEach((r,i)=>r.classList.toggle('ac-sel',i===acDocIdx)); }
  else if (e.key === 'Enter' && acDocIdx >= 0) { rows[acDocIdx].dispatchEvent(new MouseEvent('mousedown')); closeDocAC(); }
  else if (e.key === 'Escape') closeDocAC();
}

async function renderDocCards(filterMode) {
  docFilterMode = filterMode || docFilterMode;
  const grid = document.getElementById('doctorGrid');
  if (!grid) return;
  let docs = [];
  try { docs = await fetchDoctors(docFilterMode); }
  catch (err) { grid.innerHTML = '<div class="ac-no-result">Could not reach the hospital service.</div>'; return; }
  grid.innerHTML = docs.map(d => {
    const cls = d.avail === 'Available' ? 'av' : d.avail === 'Busy' ? 'busy' : 'off';
    return `<div class="doc-card ${cls}" onclick="openDocModal(${d.id})">
      <div class="dc-top">
        <div class="dc-ava">${d.icon}</div>
        <div>
          <div class="dc-name">${d.name}</div>
          <div class="dc-spec">${d.spec}</div>
        </div>
        <div class="dc-badge ${cls}">${d.avail}</div>
      </div>
      <div class="dc-meta">
        <div class="dc-tag">🚪 Room <strong>${d.room}</strong></div>
        <div class="dc-tag">🕐 <strong>${d.timing}</strong></div>
        <div class="dc-tag">⭐ <strong>${d.exp}</strong></div>
      </div>
    </div>`;
  }).join('');
}

function filterDocCards(mode, btn) {
  docFilterMode = mode;
  document.querySelectorAll('#docFilterRow .suggest-trigger').forEach(b => b.style.fontWeight = '600');
  if (btn) btn.style.fontWeight = '800';
  renderDocCards(mode);
  const inp = document.getElementById('docSearchInput');
  if (inp) handleDocSearch(inp.value);
}

/* ── DOCTOR MODAL ── */
async function openDocModal(id) {
  let d = window._doctorIndex[id];
  if (!d) {
    try { const data = await apiFetch('/api/hospital/doctors/' + id); d = data.doctor; }
    catch (err) { showToast('❌ Could not load that doctor', 'warn'); return; }
  }
  currentDocObj = d;
  document.getElementById('dmIcon').textContent = d.icon;
  document.getElementById('dmName').textContent = d.name;
  document.getElementById('dmSpec').textContent = d.spec;
  const avEl = document.getElementById('dmAvail');
  avEl.textContent = d.avail;
  avEl.style.color = d.avail === 'Available' ? '#34d399' : d.avail === 'Busy' ? '#fbbf24' : '#f87171';
  document.getElementById('dmRoom').textContent = 'Room ' + d.room;
  document.getElementById('dmTiming').textContent = d.timing;
  document.getElementById('dmExp').textContent = d.exp + ' experience';
  const btn = document.getElementById('dmBookBtn');
  if (d.avail !== 'Available') {
    btn.disabled = true; btn.style.opacity = '.5'; btn.textContent = '⚠️ Doctor ' + d.avail;
  } else {
    btn.disabled = false; btn.style.opacity = '1'; btn.textContent = '📅 Book Appointment';
  }
  document.getElementById('docModal').classList.add('show');
  closeDocAC();
}
function closeDocModal() { document.getElementById('docModal').classList.remove('show'); }
async function doBookAppt() {
  if (!currentDocObj || currentDocObj.avail !== 'Available') return;
  if (!getToken()) { showToast('⚠️ Please sign in again', 'warn'); return; }
  try {
    await apiFetch('/api/hospital/appointments', { method: 'POST', body: JSON.stringify({ doctorId: currentDocObj.id }) });
    showToast('✅ Appointment booked with ' + currentDocObj.name + '!');
    closeDocModal();
    renderApptTable();
  } catch (err) {
    showToast('❌ ' + err.message, 'warn');
  }
}
async function renderApptTable() {
  const tb = document.getElementById('apptBody');
  const cnt = document.getElementById('apptCnt');
  if (!tb) return;
  try {
    const { appointments } = await apiFetch('/api/hospital/appointments');
    window._lastAppointments = appointments;
    if (cnt) cnt.textContent = appointments.length;
    if (!appointments.length) { tb.innerHTML = '<tr><td class="empty" colspan="5">No appointments booked yet.</td></tr>'; return; }
    tb.innerHTML = appointments.map(r => `<tr>
      <td>${r.name}</td><td>${r.spec}</td><td>${new Date(r.created_at).toLocaleDateString('en-IN')}</td>
      <td><span class="chip av">${r.status}</span></td>
      <td><button class="del-btn" onclick="removeAppt(${r.id})">Cancel</button></td>
    </tr>`).join('');
  } catch (err) {
    tb.innerHTML = '<tr><td class="empty" colspan="5">Sign in to see your appointments.</td></tr>';
  }
}
async function removeAppt(id) {
  try {
    await apiFetch('/api/hospital/appointments/' + id, { method: 'DELETE' });
    showToast('Appointment cancelled.');
    renderApptTable();
  } catch (err) {
    showToast('❌ ' + err.message, 'warn');
  }
}

/* ══════════════════════════════════════════════════════════
   FOOD POPUP
══════════════════════════════════════════════════════════ */
let currentFoodTab = 0;
let currentFoodMenu = null;

async function openFoodPopup(key) {
  let menu;
  try {
    const data = await apiFetch('/api/food/menus/' + key);
    menu = data.menu;
  } catch (err) {
    showToast('❌ Could not load that menu', 'warn');
    return;
  }
  currentFoodMenu = menu;
  currentFoodTab = 0;
  document.getElementById('fmTitle').textContent = menu.name;
  document.getElementById('fmSubtitle').textContent = menu.subtitle;
  renderFoodTabs(menu);
  renderFoodItems(menu, menu.tabs[0]);
  document.getElementById('foodModal').classList.add('show');
}
function closeFoodModal() { document.getElementById('foodModal').classList.remove('show'); }

function renderFoodTabs(menu) {
  document.getElementById('foodTabs').innerHTML = menu.tabs.map((t, i) =>
    `<button class="ftab${i===0?' on':''}" onclick="switchFoodTab('${t}',this)">${t}</button>`
  ).join('');
}
function switchFoodTab(tabName, btn) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderFoodItems(currentFoodMenu, tabName);
}
function renderFoodItems(menu, tabName) {
  const items = menu.items[tabName] || [];
  document.getElementById('foodBody').innerHTML = items.map(item =>
    `<div class="food-item-row">
      <div class="fi-ico">${item.ico}</div>
      <div class="fi-info">
        <div class="fi-name">${item.name}</div>
        <div class="fi-desc">${item.desc}</div>
      </div>
      <div class="fi-tag ${item.tag}">${item.tag === 'veg' ? '🟢 Veg' : '🔴 Non-veg'}</div>
      <div class="fi-price">${item.price}</div>
    </div>`
  ).join('');
}

/* ── CATALOGUE RENDER ── */
async function renderCatalogue() {
  const g = document.getElementById('catalogGrid');
  if (!g) return;
  let books = [];
  try { const data = await apiFetch('/api/library/books/all'); books = data.books; }
  catch (err) { g.innerHTML = '<div class="ac-no-result">Could not load the catalogue.</div>'; return; }
  books.forEach(b => window._bookIndex[b.id] = b);
  g.innerHTML = books.map(b =>
    `<div class="eq-item" onclick="openBookModal(${b.id})" style="cursor:pointer">
      <span class="eq-ico">${b.icon}</span>
      <div style="min-width:0">
        <div style="font-size:12.5px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.title}</div>
        <div style="font-size:11px;color:var(--tx2)">${b.author}</div>
        <div style="font-size:10px;margin-top:3px"><span style="background:rgba(52,211,153,.1);color:#34d399;padding:2px 7px;border-radius:10px;font-weight:600">${b.copies} copies</span></div>
      </div>
    </div>`
  ).join('');
}

/* ── TOAST helper ── */
function showToast(msg, type) {
  let t = document.getElementById('cmsToastEl') || document.getElementById('cmsToast');
  if (!t) {
    t = document.createElement('div'); t.id = 'cmsToastEl';
    t.style.cssText = 'position:fixed;bottom:86px;left:50%;transform:translateX(-50%) translateY(18px);z-index:20000;background:var(--surface2);border:1px solid var(--border2);padding:12px 20px;border-radius:12px;font-size:14px;font-family:var(--font);color:var(--tx);box-shadow:0 14px 44px rgba(0,0,0,.6);opacity:0;transition:all .3s;white-space:nowrap;max-width:92vw;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.borderColor = type === 'warn' ? 'rgba(251,191,36,.4)' : 'rgba(255,107,44,.35)';
  t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(14px)'; }, 3400);
}
