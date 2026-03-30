import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiHeart, FiShoppingBag } from 'react-icons/fi';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
        setRelated(data.related);
        setQuantity(1); // Reset quantity on new product
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      toast('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      toast.success(`${quantity} ${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    toast('Wishlist feature coming soon!');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  const inStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="fade-in">
      <div className="container product-detail">
        {/* Breadcrumb */}
        <div className="product-detail-breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronLeft style={{ transform: 'rotate(180deg)' }} />
          <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
          <FiChevronLeft style={{ transform: 'rotate(180deg)' }} />
          <span>{product.name}</span>
        </div>

        {/* Main Details */}
        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-image-wrapper slide-up">
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.name} 
              className="product-detail-image"
            />
            {product.featured && <span className="product-card-badge" style={{ left: 'var(--space-xl)', top: 'var(--space-xl)' }}>Featured</span>}
          </div>

          {/* Info */}
          <div className="product-detail-info fade-in" style={{ animationDelay: '150ms' }}>
            <span className="product-detail-category">{product.category.name}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="product-detail-price">Rs. {product.price.toFixed(2)}</div>
            
            <p className="product-detail-description">{product.description}</p>
            
            <div className={`product-detail-stock ${!inStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
              {!inStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left in stock!` : 'In Stock'}
            </div>

            {inStock && (
              <div className="quantity-selector">
                <label>Quantity</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >-</button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >+</button>
                </div>
              </div>
            )}

            <div className="product-detail-actions">
              <button 
                className="btn btn-primary btn-lg" 
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
              >
                {addingToCart ? 'Adding...' : inStock ? `Add to Cart — Rs. ${(product.price * quantity).toFixed(2)}` : 'Sold Out'}
              </button>
              
              <button 
                className="btn btn-outline btn-lg" 
                title="Add to Wishlist"
                onClick={handleWishlist}
                style={{ padding: '0 24px' }}
              >
                <FiHeart />
              </button>
            </div>

            <div style={{ marginTop: 'var(--space-2xl)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                ✓ Authentic Vintage Guaranteed
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                ✓ Standard Shipping Included
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✓ 30-Day Returns Accepted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section featured-section fade-in" style={{ marginTop: 'var(--space-3xl)' }}>
          <div className="container">
            <div className="section-header">
              <h2>You Might Also Like</h2>
              <div className="section-divider"></div>
            </div>

            <div className="products-grid">
              {related.map(item => (
                <div className="slide-up" key={item._id}>
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
