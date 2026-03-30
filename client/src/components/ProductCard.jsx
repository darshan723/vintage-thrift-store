// ── ProductCard Component ──

import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast('Wishlist feature coming soon!');
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-image-wrapper">
        <img 
          src={product.image || '/placeholder.jpg'} 
          alt={product.name} 
          className="product-card-image"
          loading="lazy"
        />
        {product.featured && <span className="product-card-badge">Featured</span>}
        {product.stock <= 0 && <span className="product-card-badge" style={{ background: 'var(--color-danger)' }}>Sold Out</span>}
        
        <button className="product-card-wishlist" onClick={handleWishlist} title="Add to Wishlist">
          <FiHeart />
        </button>
        
        {product.stock > 0 && (
          <button className="product-card-quick-add" onClick={handleQuickAdd}>
            <FiShoppingBag style={{ marginRight: '8px' }} /> Quick Add
          </button>
        )}
      </div>
      
      <div className="product-card-info">
        <span className="product-card-category">{product.category?.name || 'Vintage'}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <span className="product-card-price">Rs. {product.price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
