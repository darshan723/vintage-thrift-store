// ── Order Routes ──
// POST /api/orders       — Create order from cart
// GET  /api/orders       — Get user's order history
// GET  /api/orders/:id   — Get single order details

import { Router } from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

// POST /api/orders — Create order from cart
router.post('/', async (req, res) => {
  try {
    const { shipping } = req.body;

    if (!shipping || !shipping.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.phone) {
      return res.status(400).json({ message: 'Please provide complete shipping details' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) continue;

      // Check stock
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`,
        });
      }

      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      });

      total += item.product.price * item.quantity;

      // Decrement stock
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      shipping,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure user owns this order (or is admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
