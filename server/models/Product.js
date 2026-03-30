// ── Product Model ──
// Vintage clothing items with category reference, pricing, and stock

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 10, min: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

// Index for search
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
