import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="cart-page fade-in">
        <div className="cart-empty slide-up">
          <FiShoppingBag className="cart-empty-icon" />
          <h2>Your Collection awaits</h2>
          <p>Please log in to view and add items to your cart.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page fade-in">
        <div className="cart-empty slide-up">
          <FiShoppingBag className="cart-empty-icon" />
          <h2>Your Collection is empty</h2>
          <p>You have no vintage pieces in your cart.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Start Thrifting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page fade-in">
      <h1>Your Collection ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item._id} className="cart-item slide-up">
              <Link to={`/product/${item.product._id}`}>
                 <img src={item.product.image || '/placeholder.jpg'} alt={item.product.name} className="cart-item-image" />
              </Link>
              <div className="cart-item-info">
                <Link to={`/product/${item.product._id}`}>
                   <h3 className="cart-item-name">{item.product.name}</h3>
                </Link>
                <div className="cart-item-price">Rs. {item.product.price.toFixed(2)}</div>
                
                <div className="cart-item-actions">
                  <div className="quantity-controls" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, Math.min(item.product.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.product.stock}
                    >+</button>
                  </div>
                  
                  <button className="cart-item-remove" onClick={() => removeItem(item._id)} title="Remove item">
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div style={{ marginTop: 'var(--space-md)' }}>
            <button className="btn btn-outline btn-sm" onClick={clearCart}>
               Clear Entire Cart
            </button>
          </div>
        </div>

        <div className="cart-summary slide-up" style={{ animationDelay: '100ms' }}>
          <h3>Order Summary</h3>
          
          <div className="cart-summary-row">
            <span>Subtotal ({itemCount} items)</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className="cart-summary-row total">
            <span>Estimated Total</span>
            <span style={{ color: 'var(--color-primary)' }}>Rs. {subtotal.toFixed(2)}</span>
          </div>
          
          <button className="btn btn-primary btn-lg" onClick={handleCheckout}>
            Proceed to Checkout <FiArrowRight style={{ marginLeft: '8px' }} />
          </button>
          
          <p style={{ marginTop: 'var(--space-lg)', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Authentic Vintage Guarantee. Prices are inclusive of all taxes.
          </p>
        </div>
      </div>
    </div>
  );
}
