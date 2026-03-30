// ── Cart Context ──
// Manages shopping cart state with API persistence for logged-in users

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart from server when user logs in
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCart(data.cart);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error('Please login to add items to cart');
    const { data } = await API.post('/cart', { productId, quantity });
    setCart(data.cart);
    return data.cart;
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await API.put(`/cart/${itemId}`, { quantity });
    setCart(data.cart);
    return data.cart;
  };

  const removeItem = async (itemId) => {
    const { data } = await API.delete(`/cart/${itemId}`);
    setCart(data.cart);
    return data.cart;
  };

  const clearCart = async () => {
    const { data } = await API.delete('/cart');
    setCart(data.cart);
    return data.cart;
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart, itemCount, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
