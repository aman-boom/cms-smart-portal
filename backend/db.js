const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data', 'cms.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/* ══════════════════════════════════════════════════════════
   SCHEMA
══════════════════════════════════════════════════════════ */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id TEXT UNIQUE NOT NULL,      -- Student ID / Teacher ID
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student','teacher')),
  department TEXT,
  designation TEXT,                    -- teachers only
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS otp_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  copies INTEGER NOT NULL,
  shelf TEXT,
  category TEXT,
  year TEXT,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS library_reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id INTEGER NOT NULL REFERENCES books(id),
  status TEXT DEFAULT 'Reserved',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  spec TEXT,
  avail TEXT,             -- Available / Busy / Off Duty
  room TEXT,
  type TEXT,              -- general / specialist
  icon TEXT,
  timing TEXT,
  exp TEXT
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id),
  status TEXT DEFAULT 'Confirmed',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS classrooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_no TEXT NOT NULL,
  location TEXT,
  capacity TEXT,
  added_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faculty_directory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT,
  slot TEXT,
  added_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lab_equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT
);

CREATE TABLE IF NOT EXISTS lab_reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equipment TEXT NOT NULL,
  slot TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS food_menus (
  key TEXT PRIMARY KEY,
  name TEXT,
  subtitle TEXT,
  tabs TEXT,     -- JSON array
  items TEXT     -- JSON object
);
`);

/* ══════════════════════════════════════════════════════════
   SEED DATA (mirrors the arrays that used to live in script.js)
══════════════════════════════════════════════════════════ */
function seedIfEmpty(table, rows, insertFn) {
  const count = db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c;
  if (count === 0) {
    const insertMany = db.transaction((items) => items.forEach(insertFn));
    insertMany(rows);
  }
}

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

const FOOD_MENUS = {
  cafeteria:{ name:"☕ Main Cafeteria", subtitle:"Block A Ground Floor · 7am–9pm",
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
  canteen:{ name:"🍕 Block B Canteen", subtitle:"Near Lab Block · 9am–6pm",
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
  mess:{ name:"🥗 Hostel Mess", subtitle:"North Campus · Students Only",
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
  juice:{ name:"🧃 Juice & Snack Bar", subtitle:"Sports Complex Entry · 8am–8pm",
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

seedIfEmpty('books', BOOKS, (b) => {
  db.prepare(`INSERT INTO books (id,title,author,copies,shelf,category,year,icon) VALUES (@id,@title,@author,@copies,@shelf,@category,@year,@icon)`).run(b);
});

seedIfEmpty('doctors', DOCTORS, (d) => {
  db.prepare(`INSERT INTO doctors (id,name,spec,avail,room,type,icon,timing,exp) VALUES (@id,@name,@spec,@avail,@room,@type,@icon,@timing,@exp)`).run(d);
});

seedIfEmpty('food_menus', Object.entries(FOOD_MENUS).map(([key, m]) => ({key, ...m})), (m) => {
  db.prepare(`INSERT INTO food_menus (key,name,subtitle,tabs,items) VALUES (@key,@name,@subtitle,@tabs,@items)`)
    .run({ key: m.key, name: m.name, subtitle: m.subtitle, tabs: JSON.stringify(m.tabs), items: JSON.stringify(m.items) });
});

seedIfEmpty('lab_equipment', [
  {name:"Oscilloscope", department:"Electronics"},
  {name:"3D Printer", department:"Mechanical"},
  {name:"Spectrometer", department:"Chemistry"},
  {name:"VR Headset Rig", department:"Computer Science"},
  {name:"CNC Machine", department:"Mechanical"},
], (e) => {
  db.prepare(`INSERT INTO lab_equipment (name,department) VALUES (@name,@department)`).run(e);
});

module.exports = db;
