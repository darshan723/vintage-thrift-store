// ── Database setup with SQLite ──
// Creates tables for users, products, categories, cart_items, and orders.
// Seeds initial data including categories and sample products.

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'store.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Create Tables ──
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category_id INTEGER NOT NULL,
    stock INTEGER DEFAULT 10,
    featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_name TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_zip TEXT,
    shipping_phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS recently_viewed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
  );
`);

// ── Seed function ──
export function seedDatabase() {
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (categoryCount.count > 0) return; // Already seeded

  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`)
    .run('Admin', 'admin@vintagethrift.com', hashedPassword, 'admin');

  // Create categories
  const insertCategory = db.prepare(`INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)`);
  const categories = [
    ['Denims', 'denims', 'Classic vintage denim pieces — jeans, jackets, and shirts with character and history.', '/images/categories/denims.jpg'],
    ['Boots', 'boots', 'Rugged, well-worn boots that tell a story. From cowboy to combat styles.', '/images/categories/boots.jpg'],
    ['Jackets', 'jackets', 'Timeless outerwear — leather, denim, and military jackets from decades past.', '/images/categories/jackets.jpg'],
    ['Shades', 'shades', 'Retro sunglasses and eyewear that define vintage cool.', '/images/categories/shades.jpg'],
  ];
  for (const cat of categories) insertCategory.run(...cat);

  // Create products
  const insertProduct = db.prepare(`INSERT INTO products (name, description, price, image_url, category_id, stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  // ── Denims (10 items, category_id=1) ──
  const denims = [
    ['Levi\'s 501 Originals', 'Classic straight-leg 501s from the early \'90s. Authentic fade, button fly, thick denim weave. These jeans have lived a life and they wear it beautifully.', 89.99, '/images/products/denim-1.jpg', 1, 8, 1],
    ['Wrangler Cowboy Cut', 'Original rodeo-cut Wranglers with a deep indigo wash. Slim through the hip and thigh with a classic bootcut leg. A piece of Americana.', 74.99, '/images/products/denim-2.jpg', 1, 12, 0],
    ['Lee Rider Jacket', 'Boxy cropped Lee denim jacket circa 1985. Storm rider lining, brass snaps, two chest pockets. Perfectly broken in.', 119.99, '/images/products/denim-3.jpg', 1, 5, 1],
    ['Vintage Denim Overalls', 'Workwear-inspired denim overalls in a medium wash. Adjustable straps, multiple pockets, relaxed straight-leg fit. Built for the long haul.', 95.00, '/images/products/denim-4.jpg', 1, 7, 0],
    ['Selvedge Raw Denim', 'Japanese-milled selvedge denim, unwashed. 14oz heavyweight with a clean dark indigo finish. These will fade uniquely to your body over time.', 149.99, '/images/products/denim-5.jpg', 1, 4, 1],
    ['Distressed Boyfriend Jeans', 'Relaxed-fit vintage jeans with natural distressing at the knees and thighs. Sun-bleached whiskering gives them effortless character.', 69.99, '/images/products/denim-6.jpg', 1, 10, 0],
    ['Denim Western Shirt', 'Pearl-snap western shirt in lightweight chambray. Yoke stitching, pointed collar, and a perfectly soft hand feel from years of washing.', 54.99, '/images/products/denim-7.jpg', 1, 15, 0],
    ['High-Waist Mom Jeans', 'True vintage high-rise jeans with a tapered leg. Medium stone wash with no stretch — the real deal from the \'80s.', 79.99, '/images/products/denim-8.jpg', 1, 9, 0],
    ['Patchwork Denim Skirt', 'A-line denim skirt crafted from repurposed vintage denim panels. Each piece is unique with its own patina and texture.', 64.99, '/images/products/denim-9.jpg', 1, 6, 0],
    ['Canadian Tuxedo Set', 'Matching denim jacket and jeans in a harmonious medium wash. The ultimate vintage co-ord for the denim devotee.', 159.99, '/images/products/denim-10.jpg', 1, 3, 1],
  ];
  for (const p of denims) insertProduct.run(...p);

  // ── Boots (10 items, category_id=2) ──
  const boots = [
    ['Red Wing Iron Rangers', 'Heritage 8111 Iron Rangers in amber harness leather. Cap-toe design, triple-stitched welt, Vibram mini-lug outsole. Beautifully patinated.', 199.99, '/images/products/boots-1.jpg', 2, 5, 1],
    ['Frye Harness Boots', 'Iconic 12R harness boots in cognac leather. Pull-on style with signature metal harness ring. Goodyear welt construction.', 179.99, '/images/products/boots-2.jpg', 2, 7, 1],
    ['Justin Roper Cowboy', 'Classic western roper boots in tan calfskin. Low heel, round toe, pull-on tabs. Comfortable enough for all-day ranch work or city streets.', 129.99, '/images/products/boots-3.jpg', 2, 8, 0],
    ['Dr. Martens 1460', 'Original 8-eye boots in smooth oxblood. Air-cushioned sole, yellow stitching, grooved sides. A punk-era time capsule.', 149.99, '/images/products/boots-4.jpg', 2, 10, 1],
    ['Military Combat Boots', 'Genuine surplus combat boots in black leather. Steel shank, speed hooks, Vibram commando sole. Built to survive anything.', 109.99, '/images/products/boots-5.jpg', 2, 12, 0],
    ['Chelsea Suede Boots', 'Mod-era Chelsea boots in brown suede. Elastic side panels, slim profile, stacked leather heel. Effortlessly stylish.', 139.99, '/images/products/boots-6.jpg', 2, 6, 0],
    ['Wolverine 1000 Mile', 'Horween Chromexcel leather, Goodyear welt, stacked leather sole. The quintessential American heritage boot, aged perfectly.', 219.99, '/images/products/boots-7.jpg', 2, 4, 1],
    ['Timberland 6-Inch Classic', '90s-era wheat nubuck Timberlands. Padded leather collar, lug sole, waterproof construction. A streetwear icon.', 159.99, '/images/products/boots-8.jpg', 2, 9, 0],
    ['Lucchese Western Boots', 'Hand-crafted western boots in burnished tan goat leather. Pointed toe, slanted heel, intricate stitch patterns.', 249.99, '/images/products/boots-9.jpg', 2, 3, 0],
    ['Engineer Motorcycle Boots', 'Steel-toe engineer boots in black oil-tanned leather. Buckle straps, heavy Vibram sole. Ready for the open road.', 189.99, '/images/products/boots-10.jpg', 2, 5, 0],
  ];
  for (const p of boots) insertProduct.run(...p);

  // ── Jackets (8 items, category_id=3) ──
  const jackets = [
    ['Schott Perfecto Leather', 'The original leather motorcycle jacket. Heavy steerhide, asymmetric zip, snap lapels, star-studded epaulets. Pure rebellion.', 349.99, '/images/products/jacket-1.jpg', 3, 3, 1],
    ['M-65 Field Jacket', 'Military field jacket in olive drab. Four front cargo pockets, brass zipper with snap storm flap, hidden hood in collar.', 159.99, '/images/products/jacket-2.jpg', 3, 8, 1],
    ['Varsity Letterman', 'Wool body with leather sleeves in burgundy and cream. Snap front, ribbed cuffs, chenille letter patch. Friday-night-lights energy.', 129.99, '/images/products/jacket-3.jpg', 3, 6, 0],
    ['Waxed Canvas Barn Coat', 'Rugged waxed cotton barn jacket in tobacco brown. Corduroy collar, plaid flannel lining, deep hand-warmer pockets.', 139.99, '/images/products/jacket-4.jpg', 3, 7, 0],
    ['Suede Trucker Jacket', 'Western-cut trucker jacket in honey suede. Pointed yokes, snap buttons, adjustable waist tabs. Laurel Canyon vibes.', 189.99, '/images/products/jacket-5.jpg', 3, 4, 1],
    ['Harrington Jacket', 'Classic Harrington in British tan. Fraser tartan lining, stand collar, elasticated cuffs and hem. Mod culture essential.', 119.99, '/images/products/jacket-6.jpg', 3, 9, 0],
    ['Sherpa-Lined Corduroy', 'Wide-wale corduroy jacket with thick sherpa fleece lining. Warm, cozy, and endlessly stylish in burnt sienna.', 109.99, '/images/products/jacket-7.jpg', 3, 10, 0],
    ['Aviator Bomber Jacket', 'Shearling-collared bomber in distressed brown leather. Ribbed cuffs and hem, front zip, interior map pocket. Sky-high style.', 279.99, '/images/products/jacket-8.jpg', 3, 5, 1],
  ];
  for (const p of jackets) insertProduct.run(...p);

  // ── Shades (8 items, category_id=4) ──
  const shades = [
    ['Ray-Ban Aviators', 'Original gold-frame aviators with green G-15 lenses. The sunglasses that defined cool since 1937. Timeless.', 89.99, '/images/products/shades-1.jpg', 4, 15, 1],
    ['Persol 649', 'Iconic Italian frames in Havana tortoiseshell. Crystal green lenses, signature silver arrow temple detail. La Dolce Vita style.', 119.99, '/images/products/shades-2.jpg', 4, 8, 1],
    ['Round Lennon Glasses', 'Perfectly round wire-frame sunglasses in antique gold. Smoke-tinted lenses. Channel your inner rock legend.', 49.99, '/images/products/shades-3.jpg', 4, 20, 0],
    ['Wayfarer Classics', 'The frame that never goes out of style. Black acetate with green lenses. From Audrey Hepburn to the Ramones.', 79.99, '/images/products/shades-4.jpg', 4, 12, 1],
    ['Cat-Eye Vintage', 'Dramatic upswept cat-eye frames in pearl white. Gradient brown lenses. Pure 1950s Hollywood glamour.', 69.99, '/images/products/shades-5.jpg', 4, 10, 0],
    ['Clubmaster Browline', 'Half-frame browline sunglasses in tortoise and gold. A scholarly look with undeniable edge. Green crystal lenses.', 74.99, '/images/products/shades-6.jpg', 4, 14, 0],
    ['Oversized Jackie O\'s', 'Dramatic oversized square frames in glossy black. Gradient smoke lenses. First Lady chic for the modern age.', 59.99, '/images/products/shades-7.jpg', 4, 11, 0],
    ['Steampunk Goggles', 'Round flip-up frames in antique bronze with side shields. Dark amber lenses. For the discerning time traveler.', 54.99, '/images/products/shades-8.jpg', 4, 18, 0],
  ];
  for (const p of shades) insertProduct.run(...p);

  console.log('✅ Database seeded successfully');
}

export default db;
