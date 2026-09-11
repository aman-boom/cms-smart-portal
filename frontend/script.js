

/* ══════════════════════════════════════════════════════════
   BOOK INVENTORY DATA
══════════════════════════════════════════════════════════ */
const BOOKS = [
  {id:1, title:"Data Structures & Algorithms", author:"Thomas H. Cormen", copies:4, shelf:"A-12", category:"Computer Science", year:"2022", icon:"📗"},
  {id:2, title:"Database Systems", author:"Abraham Silberschatz", copies:3, shelf:"B-07", category:"Database", year:"2021", icon:"📘"},
  {id:3, title:"Operating System Concepts", author:"Abraham Galvin", copies:6, shelf:"A-05", category:"Operating Systems", year:"2020", icon:"📙"},
  {id:4, title:"Computer Networks", author:"James F. Kurose", copies:2, shelf:"C-14", category:"Networking", year:"2021", icon:"📕"},
  {id:5, title:"Introduction to Machine Learning", author:"Ethem Alpaydin", copies:5, shelf:"D-03", category:"AI & ML", year:"2022", icon:"📗"},
  {id:6, title:"Artificial Intelligence: A Modern Approach", author:"Stuart Russell", copies:3, shelf:"D-01", category:"AI & ML", year:"2020", icon:"📘"},
  {id:7, title:"Design Patterns", author:"Gang of Four (GoF)", copies:4, shelf:"B-11", category:"Software Engg.", year:"2019", icon:"📙"},
  {id:8, title:"Clean Code", author:"Robert C. Martin", copies:7, shelf:"B-14", category:"Programming", year:"2008", icon:"📕"},
  {id:9, title:"Computer Organization & Architecture", author:"William Stallings", copies:3, shelf:"A-08", category:"Architecture", year:"2019", icon:"📗"},
  {id:10, title:"Discrete Mathematics", author:"Kenneth H. Rosen", copies:5, shelf:"E-02", category:"Mathematics", year:"2018", icon:"📘"},
  {id:11, title:"Python Crash Course", author:"Eric Matthes", copies:6, shelf:"A-02", category:"Programming", year:"2019", icon:"📙"},
  {id:12, title:"Introduction to Algorithms", author:"CLRS", copies:3, shelf:"A-13", category:"Algorithms", year:"2022", icon:"📗"},
];

/* ══════════════════════════════════════════════════════════
   DOCTOR DATA
══════════════════════════════════════════════════════════ */
const DOCTORS = [
  {id:1, name:"Dr. Anil Kumar", spec:"General Medicine", avail:"Available", room:"101", type:"general", icon:"🩺", timing:"9:00 AM – 1:00 PM", exp:"15 yrs"},
  {id:2, name:"Dr. Priya Mehta", spec:"Cardiology", avail:"Available", room:"205", type:"specialist", icon:"❤️", timing:"10:00 AM – 2:00 PM", exp:"12 yrs"},
  {id:3, name:"Dr. Rajesh Singh", spec:"Dentistry", avail:"Busy", room:"108", type:"general", icon:"🦷", timing:"9:00 AM – 12:00 PM", exp:"10 yrs"},
  {id:4, name:"Dr. Sunita Sharma", spec:"Orthopedics", avail:"Available", room:"302", type:"specialist", icon:"🦴", timing:"2:00 PM – 6:00 PM", exp:"18 yrs"},
  {id:5, name:"Dr. Vikram Rao", spec:"Psychiatry", avail:"Off Duty", room:"410", type:"specialist", icon:"🧠", timing:"11:00 AM – 3:00 PM", exp:"8 yrs"},
  {id:6, name:"Dr. Neha Gupta", spec:"Dermatology", avail:"Available", room:"206", type:"specialist", icon:"🔬", timing:"10:00 AM – 1:00 PM", exp:"9 yrs"},
  {id:7, name:"Dr. Amit Patel", spec:"General Medicine", avail:"Available", room:"102", type:"general", icon:"🩺", timing:"2:00 PM – 7:00 PM", exp:"7 yrs"},
  {id:8, name:"Dr. Kavya Nair", spec:"Ophthalmology", avail:"Busy", room:"307", type:"specialist", icon:"👁️", timing:"9:00 AM – 1:00 PM", exp:"11 yrs"},
];

/* ══════════════════════════════════════════════════════════
   FOOD MENU DATA
══════════════════════════════════════════════════════════ */
const FOOD_MENUS = {
  cafeteria:{
    name:"☕ Main Cafeteria", subtitle:"Block A Ground Floor · 7am–9pm",
    tabs:["Breakfast","Lunch","Dinner","Snacks"],
    items:{
      Breakfast:[
        {ico:"🥐",name:"Poha Plate",desc:"Flattened rice with spices & lemon",price:"₹30",tag:"veg"},
        {ico:"🫓",name:"Bread Omelette",desc:"2-egg omelette with toast & butter",price:"₹40",tag:"non"},
        {ico:"🍵",name:"Masala Tea",desc:"Ginger cardamom chai",price:"₹10",tag:"veg"},
        {ico:"🥣",name:"Idli Sambar",desc:"3 idlis with coconut chutney",price:"₹35",tag:"veg"},
      ],
      Lunch:[
        {ico:"🍛",name:"Dal Rice Thali",desc:"Dal, rice, sabzi, roti, salad",price:"₹70",tag:"veg"},
        {ico:"🍗",name:"Chicken Curry Rice",desc:"Spicy chicken curry with basmati rice",price:"₹90",tag:"non"},
        {ico:"🫓",name:"Paneer Butter Masala",desc:"Cottage cheese in tomato gravy",price:"₹80",tag:"veg"},
        {ico:"🥗",name:"Mix Veg Thali",desc:"Seasonal veg, roti, dal, rice",price:"₹65",tag:"veg"},
      ],
      Dinner:[
        {ico:"🍲",name:"Rajma Chawal",desc:"Kidney beans curry with rice",price:"₹65",tag:"veg"},
        {ico:"🫔",name:"Chapati Sabzi",desc:"4 rotis with seasonal vegetable",price:"₹50",tag:"veg"},
        {ico:"🍗",name:"Egg Curry Thali",desc:"2-egg curry, rice & roti",price:"₹75",tag:"non"},
        {ico:"🍮",name:"Kheer",desc:"Rice pudding dessert",price:"₹25",tag:"veg"},
      ],
      Snacks:[
        {ico:"🥪",name:"Veg Sandwich",desc:"Grilled vegetable sandwich",price:"₹35",tag:"veg"},
        {ico:"🍕",name:"Maggi Noodles",desc:"Classic masala noodles",price:"₹30",tag:"veg"},
        {ico:"☕",name:"Coffee / Tea",desc:"Hot beverage",price:"₹15",tag:"veg"},
        {ico:"🍟",name:"French Fries",desc:"Crispy with ketchup",price:"₹40",tag:"veg"},
      ]
    }
  },
  canteen:{
    name:"🍕 Block B Canteen", subtitle:"Near Lab Block · 9am–6pm",
    tabs:["Quick Bites","Drinks"],
    items:{
      "Quick Bites":[
        {ico:"🌯",name:"Veg Roll",desc:"Spiced vegetables in paratha wrap",price:"₹45",tag:"veg"},
        {ico:"🍔",name:"Aloo Tikki Burger",desc:"Crispy potato patty burger",price:"₹50",tag:"veg"},
        {ico:"🥙",name:"Chicken Tikka Roll",desc:"Grilled chicken in wrap",price:"₹70",tag:"non"},
        {ico:"🍜",name:"Veg Noodles",desc:"Stir fried noodles with veggies",price:"₹50",tag:"veg"},
      ],
      Drinks:[
        {ico:"🥤",name:"Cold Coffee",desc:"Iced blended coffee",price:"₹50",tag:"veg"},
        {ico:"🧃",name:"Fresh Lime Soda",desc:"Lime, soda, mint",price:"₹30",tag:"veg"},
        {ico:"🧊",name:"Iced Tea",desc:"Chilled tea with lemon",price:"₹35",tag:"veg"},
      ]
    }
  },
  mess:{
    name:"🥗 Hostel Mess", subtitle:"North Campus · Students Only",
    tabs:["Weekly Menu"],
    items:{
      "Weekly Menu":[
        {ico:"📅",name:"Monday",desc:"Dal Makhani · Jeera Rice · Salad",price:"Included",tag:"veg"},
        {ico:"📅",name:"Tuesday",desc:"Egg Curry · Rice · Chapati",price:"Included",tag:"non"},
        {ico:"📅",name:"Wednesday",desc:"Chole Bhature · Pickle",price:"Included",tag:"veg"},
        {ico:"📅",name:"Thursday",desc:"Palak Paneer · Roti · Rice",price:"Included",tag:"veg"},
        {ico:"📅",name:"Friday",desc:"Fish Curry · Rice (Non-veg option)",price:"Included",tag:"non"},
        {ico:"📅",name:"Saturday",desc:"Pav Bhaji · Dessert",price:"Included",tag:"veg"},
      ]
    }
  },
  juice:{
    name:"🧃 Juice & Snack Bar", subtitle:"Sports Complex Entry · 8am–8pm",
    tabs:["Juices","Healthy Snacks"],
    items:{
      Juices:[
        {ico:"🍊",name:"Orange Juice",desc:"Fresh squeezed 300ml",price:"₹40",tag:"veg"},
        {ico:"🍹",name:"Mango Lassi",desc:"Thick mango yogurt drink",price:"₹45",tag:"veg"},
        {ico:"🥤",name:"Watermelon Juice",desc:"Fresh seasonal fruit",price:"₹35",tag:"veg"},
        {ico:"🥬",name:"Green Detox",desc:"Spinach, cucumber, ginger",price:"₹55",tag:"veg"},
      ],
      "Healthy Snacks":[
        {ico:"🥜",name:"Mixed Nuts",desc:"Almonds, cashews, raisins",price:"₹60",tag:"veg"},
        {ico:"🍌",name:"Fruit Salad",desc:"Seasonal fresh fruits",price:"₹45",tag:"veg"},
        {ico:"🥙",name:"Sprout Chaat",desc:"Mixed sprouts, tangy masala",price:"₹40",tag:"veg"},
      ]
    }
  }
};

/* ══════════════════════════════════════════════════════════
   AUTOCOMPLETE BOOK SEARCH
══════════════════════════════════════════════════════════ */
let acBookIdx = -1, currentBookObj = null;

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
  return text.replace(re, '<em>$1</em>');
}

function getBookSuggestions(q) {
  if (!q || !q.trim()) return BOOKS.slice(0, 10);
  const ql = q.toLowerCase();
  return BOOKS.filter(b =>
    b.title.toLowerCase().includes(ql) ||
    b.author.toLowerCase().includes(ql) ||
    b.category.toLowerCase().includes(ql)
  ).slice(0, 10);
}

function handleBookSearch(val) {
  const drop = document.getElementById('bookAcDrop');
  const items = document.getElementById('acDropItems');
  const lbl = document.getElementById('acDropLbl');
  const sugs = getBookSuggestions(val);
  acBookIdx = -1;
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
function openBookModal(id) {
  const b = BOOKS.find(x => x.id === id);
  if (!b) return;
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
function doReserveBook() {
  if (!currentBookObj) return;
  if (currentBookObj.copies <= 0) { showToast('❌ No copies available for this book', 'warn'); return; }
  const db_lib = window._libDB || (window._libDB = []);
  db_lib.push([currentBookObj.title, currentBookObj.author, currentBookObj.shelf]);
  renderLibTable();
  showToast('✅ "' + currentBookObj.title.slice(0, 32) + '…" reserved!');
  closeBookModal();
}
function renderLibTable() {
  const arr = window._libDB || [];
  const tb = document.getElementById('libBody');
  const cnt = document.getElementById('libCnt');
  if (cnt) cnt.textContent = arr.length;
  if (!arr.length) { tb.innerHTML = '<tr><td class="empty" colspan="5">No reservations yet.</td></tr>'; return; }
  tb.innerHTML = arr.map((r,i) => `<tr>
    <td>${r[0]}</td><td>${r[1]}</td><td style="font-family:var(--mono);color:var(--brand)">${r[2]}</td>
    <td><span class="chip av">Reserved</span></td>
    <td><button class="del-btn" onclick="removeLib(${i})">Remove</button></td>
  </tr>`).join('');
}
function removeLib(i) {
  window._libDB.splice(i, 1); renderLibTable(); showToast('Reservation removed.');
}

/* ══════════════════════════════════════════════════════════
   DOCTOR SEARCH + CARDS
══════════════════════════════════════════════════════════ */
let acDocIdx = -1, currentDocObj = null;
let docFilterMode = 'all';

function getDocSuggestions(q) {
  let docs = DOCTORS;
  if (docFilterMode === 'available') docs = docs.filter(d => d.avail === 'Available');
  else if (docFilterMode === 'general') docs = docs.filter(d => d.type === 'general');
  else if (docFilterMode === 'specialist') docs = docs.filter(d => d.type === 'specialist');
  if (!q || !q.trim()) return docs;
  const ql = q.toLowerCase();
  return docs.filter(d =>
    d.name.toLowerCase().includes(ql) ||
    d.spec.toLowerCase().includes(ql)
  );
}

function handleDocSearch(val) {
  const drop = document.getElementById('docAcDrop');
  const items = document.getElementById('docAcItems');
  const lbl = document.getElementById('docDropLbl');
  if (!drop || !items) return;
  const sugs = getDocSuggestions(val);
  acDocIdx = -1;
  if (!sugs.length) {
    items.innerHTML = '<div class="ac-no-result">No doctors found for "' + val + '"</div>';
    lbl.textContent = '';
    drop.classList.add('show'); return;
  }
  lbl.textContent = val ? sugs.length + ' found' : 'All ' + sugs.length;
  let html = '';
  sugs.forEach((d, i) => {
    const avCls = d.avail === 'Available' ? 'good' : d.avail === 'Busy' ? 'low' : 'low';
    const avLabel = d.avail;
    html += `<div class="ac-row" id="docrow${i}" onmousedown="openDocModal(${d.id})">
      <div class="ac-row-num">${i + 1}</div>
      <div class="ac-row-ico">${d.icon}</div>
      <div class="ac-row-body">
        <div class="ac-row-title">${highlight(d.name, val)}</div>
        <div class="ac-row-author">🏥 ${highlight(d.spec, val)} &nbsp;·&nbsp; 🚪 Room ${d.room}</div>
      </div>
      <div class="ac-row-copies ${avCls}">${avLabel}</div>
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

function renderDocCards(filterMode) {
  docFilterMode = filterMode || docFilterMode;
  const grid = document.getElementById('doctorGrid');
  if (!grid) return;
  let docs = DOCTORS;
  if (docFilterMode === 'available') docs = docs.filter(d => d.avail === 'Available');
  else if (docFilterMode === 'general') docs = docs.filter(d => d.type === 'general');
  else if (docFilterMode === 'specialist') docs = docs.filter(d => d.type === 'specialist');
  grid.innerHTML = docs.map(d => {
    const cls = d.avail === 'Available' ? 'av' : d.avail === 'Busy' ? 'busy' : 'off';
    const bdgCls = d.avail === 'Available' ? 'av' : d.avail === 'Busy' ? 'busy' : 'off';
    return `<div class="doc-card ${cls}" onclick="openDocModal(${d.id})">
      <div class="dc-top">
        <div class="dc-ava">${d.icon}</div>
        <div>
          <div class="dc-name">${d.name}</div>
          <div class="dc-spec">${d.spec}</div>
        </div>
        <div class="dc-badge ${bdgCls}">${d.avail}</div>
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
function openDocModal(id) {
  const d = DOCTORS.find(x => x.id === id);
  if (!d) return;
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
function doBookAppt() {
  if (!currentDocObj || currentDocObj.avail !== 'Available') return;
  const arr = window._apptDB || (window._apptDB = []);
  const today = new Date().toLocaleDateString('en-IN');
  arr.push([currentDocObj.name, currentDocObj.spec, today]);
  renderApptTable();
  showToast('✅ Appointment booked with ' + currentDocObj.name + '!');
  closeDocModal();
}
function renderApptTable() {
  const arr = window._apptDB || [];
  const tb = document.getElementById('apptBody');
  const cnt = document.getElementById('apptCnt');
  if (cnt) cnt.textContent = arr.length;
  if (!tb) return;
  if (!arr.length) { tb.innerHTML = '<tr><td class="empty" colspan="5">No appointments booked yet.</td></tr>'; return; }
  tb.innerHTML = arr.map((r,i) => `<tr>
    <td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td>
    <td><span class="chip av">Confirmed</span></td>
    <td><button class="del-btn" onclick="removeAppt(${i})">Cancel</button></td>
  </tr>`).join('');
}
function removeAppt(i) {
  window._apptDB.splice(i, 1); renderApptTable(); showToast('Appointment cancelled.');
}

/* ══════════════════════════════════════════════════════════
   FOOD POPUP
══════════════════════════════════════════════════════════ */
let currentFoodTab = 0;
let currentFoodKey = null;

function openFoodPopup(key) {
  const menu = FOOD_MENUS[key];
  if (!menu) return;
  currentFoodKey = key;
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
  renderFoodItems(FOOD_MENUS[currentFoodKey], tabName);
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
function renderCatalogue() {
  const g = document.getElementById('catalogGrid');
  if (!g) return;
  g.innerHTML = BOOKS.map(b =>
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

/* ── OVERRIDE loadStatics to also render doc cards ── */
const _origLoadStatics = typeof loadStatics !== 'undefined' ? loadStatics : null;
function loadStatics() {
  if (_origLoadStatics) _origLoadStatics();
  else renderCatalogue();
  renderDocCards('all');
  renderLibTable();
  renderApptTable();
}

/* ── TOAST helper (works with existing showToast or adds one) ── */
function showToast(msg, type) {
  let t = document.getElementById('cmsToastEl');
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

/* ── Override existing toast function if present ── */
if (typeof toast === 'function') {
  const _origToast = toast;
  window.toast = function(msg, type) { showToast(msg, type === 'warn' ? 'warn' : 'i'); };
}