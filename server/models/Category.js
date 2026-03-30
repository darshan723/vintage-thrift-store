// ── Category Model ──
// Product categories: Denims, Boots, Jackets, Shades

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String },
  image: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
