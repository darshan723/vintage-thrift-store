import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cart, subtotal, itemCount, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (cart.items.length === 0 && !success) {
      navigate('/cart');
    }
  }, [user, cart.items.length, success, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShipping(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.phone) {
      toast.error('Please fill in all shipping details');
      return;
    }

    try {
      setLoading(true);
      await API.post('/orders', { shipping });
      await fetchCart(); // Refresh cart to empty state
      setSuccess(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-page fade-in" style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
        <FiCheckCircle style={{ fontSize: '4rem', color: 'var(--color-success)', marginBottom: 'var(--space-lg)' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)', fontSize: '1.1rem' }}>
          Thank you for shopping with Vintage House Store. Your curated pieces are being prepared for shipping.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/profile')}>
          View Order Status
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page fade-in">
      <h1>Secure Checkout</h1>

      <div className="checkout-grid">
        <div className="checkout-form slide-up">
          <h2>Shipping Information</h2>
          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={shipping.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input 
                type="text" 
                id="address" 
                value={shipping.address}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  value={shipping.city}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP / Postal Code</label>
                <input 
                  type="text" 
                  id="zip" 
                  value={shipping.zip}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                value={shipping.phone}
                onChange={handleInputChange}
                required 
              />
            </div>

            <h2 style={{ marginTop: 'var(--space-2xl)', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-lg)' }}>Payment Method</h2>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-xl)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                <span role="img" aria-label="lock">🔒</span> Payment processing is simulated for this demo.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order — Rs. ${subtotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="cart-summary slide-up" style={{ animationDelay: '100ms' }}>
          <h3>Order Summary</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>{itemCount} items</p>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 'var(--space-lg)', paddingRight: '10px' }}>
            {cart.items.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '0.9rem', alignItems: 'center' }}>
                 <img src={item.product.image || '/placeholder.jpg'} alt={item.product.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                 <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: '600' }}>{item.product.name}</div>
                   <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Qty: {item.quantity}</div>
                 </div>
                 <div style={{ fontWeight: 'bold' }}>Rs. {(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Free Standard</span>
          </div>
          
          <div className="cart-summary-row total">
            <span>Total to Pay</span>
            <span style={{ color: 'var(--color-primary)' }}>Rs. {subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
