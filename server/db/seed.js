// ── Database Seed Script ──
// Run with: npm run seed
// Creates categories, sample products, and an admin user

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vintage-thrift-store';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Create Admin User ──
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@vintagethrift.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin user created (admin@vintagethrift.com / admin123)');

    // ── Create Categories ──
    const [denims, boots, jackets, shades] = await Category.insertMany([
      { name: 'Denims', slug: 'denims', description: 'Classic vintage denim pieces — jeans, jackets, and shirts with character and history.', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600' },
      { name: 'Boots', slug: 'boots', description: 'Rugged, well-worn boots that tell a story. From cowboy to combat styles.', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600' },
      { name: 'Jackets', slug: 'jackets', description: 'Timeless outerwear — leather, denim, and military jackets from decades past.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600' },
      { name: 'Shades', slug: 'shades', description: 'Retro sunglasses and eyewear that define vintage cool.', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600' },
    ]);
    console.log('📂 Categories created');

    // ── Create Products ──

    // Denims (10 items)
    const denimProducts = [
      { name: "Levi's 501 Originals", description: "Classic straight-leg 501s from the early '90s. Authentic fade, button fly, thick denim weave. These jeans have lived a life and they wear it beautifully.", price: 2249, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', category: denims._id, stock: 8, featured: true },
      { name: 'Wrangler Cowboy Cut', description: "Original rodeo-cut Wranglers with a deep indigo wash. Slim through the hip and thigh with a classic bootcut leg.", price: 1849, image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500', category: denims._id, stock: 12 },
      { name: 'Lee Rider Jacket', description: 'Boxy cropped Lee denim jacket circa 1985. Storm rider lining, brass snaps, two chest pockets. Perfectly broken in.', price: 2999, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500', category: denims._id, stock: 5, featured: true },
      { name: 'Vintage Denim Overalls', description: 'Workwear-inspired denim overalls in a medium wash. Adjustable straps, multiple pockets, relaxed straight-leg fit.', price: 2399, image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500', category: denims._id, stock: 7 },
      { name: 'Selvedge Raw Denim', description: 'Japanese-milled selvedge denim, unwashed. 14oz heavyweight with a clean dark indigo finish.', price: 3749, image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500', category: denims._id, stock: 4, featured: true },
      { name: 'Distressed Boyfriend Jeans', description: 'Relaxed-fit vintage jeans with natural distressing at the knees and thighs.', price: 1749, image: 'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=500', category: denims._id, stock: 10 },
      { name: 'Denim Western Shirt', description: 'Pearl-snap western shirt in lightweight chambray. Yoke stitching, pointed collar.', price: 1349, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', category: denims._id, stock: 15 },
      { name: 'High-Waist Mom Jeans', description: "True vintage high-rise jeans with a tapered leg. Medium stone wash from the '80s.", price: 1999, image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500', category: denims._id, stock: 9 },
      { name: 'Patchwork Denim Skirt', description: 'A-line denim skirt crafted from repurposed vintage denim panels. Each piece is unique.', price: 1599, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=500', category: denims._id, stock: 6 },
      { name: 'Canadian Tuxedo Set', description: 'Matching denim jacket and jeans in a harmonious medium wash. The ultimate vintage co-ord.', price: 3999, image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=500', category: denims._id, stock: 3, featured: true },
    ];

    // Boots (10 items)
    const bootProducts = [
      { name: 'Red Wing Iron Rangers', description: 'Heritage 8111 Iron Rangers in amber harness leather. Cap-toe design, triple-stitched welt.', price: 4999, image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500', category: boots._id, stock: 5, featured: true },
      { name: 'Frye Harness Boots', description: 'Iconic 12R harness boots in cognac leather. Pull-on style with signature metal harness ring.', price: 4499, image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500', category: boots._id, stock: 7, featured: true },
      { name: 'Justin Roper Cowboy', description: 'Classic western roper boots in tan calfskin. Low heel, round toe, pull-on tabs.', price: 3249, image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=500', category: boots._id, stock: 8 },
      { name: 'Dr. Martens 1460', description: 'Original 8-eye boots in smooth oxblood. Air-cushioned sole, yellow stitching.', price: 3749, image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500', category: boots._id, stock: 10, featured: true },
      { name: 'Military Combat Boots', description: 'Genuine surplus combat boots in black leather. Steel shank, speed hooks, Vibram sole.', price: 2749, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500', category: boots._id, stock: 12 },
      { name: 'Chelsea Suede Boots', description: 'Mod-era Chelsea boots in brown suede. Elastic side panels, slim profile.', price: 3499, image: 'https://images.unsplash.com/photo-1613987876445-fcb353cd8e27?w=500', category: boots._id, stock: 6 },
      { name: 'Wolverine 1000 Mile', description: 'Horween Chromexcel leather, Goodyear welt, stacked leather sole. Quintessential heritage boot.', price: 5499, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', category: boots._id, stock: 4, featured: true },
      { name: 'Timberland 6-Inch Classic', description: "90s-era wheat nubuck Timberlands. Padded leather collar, lug sole. A streetwear icon.", price: 3999, image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500', category: boots._id, stock: 9 },
      { name: 'Lucchese Western Boots', description: 'Hand-crafted western boots in burnished tan goat leather. Pointed toe, intricate stitch patterns.', price: 6249, image: 'https://images.unsplash.com/photo-1585043752002-08b9931fa980?w=500', category: boots._id, stock: 3 },
      { name: 'Engineer Motorcycle Boots', description: 'Steel-toe engineer boots in black oil-tanned leather. Buckle straps, heavy Vibram sole.', price: 4749, image: 'https://images.unsplash.com/photo-1602011505101-bce72f741a47?w=500', category: boots._id, stock: 5 },
    ];

    // Jackets (8 items)
    const jacketProducts = [
      { name: 'Schott Perfecto Leather', description: 'The original leather motorcycle jacket. Heavy steerhide, asymmetric zip, snap lapels.', price: 8749, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', category: jackets._id, stock: 3, featured: true },
      { name: 'M-65 Field Jacket', description: 'Military field jacket in olive drab. Four front cargo pockets, hidden hood in collar.', price: 3999, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', category: jackets._id, stock: 8, featured: true },
      { name: 'Varsity Letterman', description: 'Wool body with leather sleeves in burgundy and cream. Snap front, chenille letter patch.', price: 3249, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', category: jackets._id, stock: 6 },
      { name: 'Waxed Canvas Barn Coat', description: 'Rugged waxed cotton barn jacket in tobacco brown. Corduroy collar, plaid flannel lining.', price: 3499, image: 'https://images.unsplash.com/photo-1544923246-77307dd270cb?w=500', category: jackets._id, stock: 7 },
      { name: 'Suede Trucker Jacket', description: 'Western-cut trucker jacket in honey suede. Pointed yokes, snap buttons.', price: 4749, image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500', category: jackets._id, stock: 4, featured: true },
      { name: 'Harrington Jacket', description: 'Classic Harrington in British tan. Fraser tartan lining, stand collar. Mod culture essential.', price: 2999, image: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=500', category: jackets._id, stock: 9 },
      { name: 'Sherpa-Lined Corduroy', description: 'Wide-wale corduroy jacket with thick sherpa fleece lining in burnt sienna.', price: 2749, image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=500', category: jackets._id, stock: 10 },
      { name: 'Aviator Bomber Jacket', description: 'Shearling-collared bomber in distressed brown leather. Ribbed cuffs, interior map pocket.', price: 6999, image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500', category: jackets._id, stock: 5, featured: true },
    ];

    // Shades (8 items)
    const shadesProducts = [
      { name: 'Ray-Ban Aviators', description: 'Original gold-frame aviators with green G-15 lenses. The sunglasses that defined cool since 1937.', price: 2249, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: shades._id, stock: 15, featured: true },
      { name: 'Persol 649', description: 'Iconic Italian frames in Havana tortoiseshell. Crystal green lenses, silver arrow detail.', price: 2999, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500', category: shades._id, stock: 8, featured: true },
      { name: 'Round Lennon Glasses', description: 'Perfectly round wire-frame sunglasses in antique gold. Smoke-tinted lenses.', price: 1249, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500', category: shades._id, stock: 20 },
      { name: 'Wayfarer Classics', description: 'The frame that never goes out of style. Black acetate with green lenses.', price: 1999, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', category: shades._id, stock: 12, featured: true },
      { name: 'Cat-Eye Vintage', description: 'Dramatic upswept cat-eye frames in pearl white. Pure 1950s Hollywood glamour.', price: 1749, image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500', category: shades._id, stock: 10 },
      { name: 'Clubmaster Browline', description: 'Half-frame browline sunglasses in tortoise and gold. A scholarly look with edge.', price: 1849, image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500', category: shades._id, stock: 14 },
      { name: "Oversized Jackie O's", description: 'Dramatic oversized square frames in glossy black. First Lady chic.', price: 1499, image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500', category: shades._id, stock: 11 },
      { name: 'Steampunk Goggles', description: 'Round flip-up frames in antique bronze with side shields. For the discerning time traveler.', price: 1349, image: 'https://images.unsplash.com/photo-1504198070170-4ca53bb1c1fa?w=500', category: shades._id, stock: 18 },
    ];

    await Product.insertMany([
      ...denimProducts,
      ...bootProducts,
      ...jacketProducts,
      ...shadesProducts,
    ]);
    console.log('🛍️  36 products created');

    console.log('\n✅ Database seeded successfully!');
    console.log('   Admin login: admin@vintagethrift.com / admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
