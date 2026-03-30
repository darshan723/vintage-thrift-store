import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states for creating/editing products
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: 10,
    featured: false
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    if (isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, ordRes, catRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/products?limit=100'),
        API.get('/admin/orders'),
        API.get('/categories')
      ]);

      setStats(statsRes.data);
      setProducts(prodRes.data.products);
      setOrders(ordRes.data.orders);
      setCategories(catRes.data.categories);
      
      // Select first category by default for new products
      if (catRes.data.categories.length > 0) {
        setFormData(prev => ({ ...prev, category: catRes.data.categories[0]._id }));
      }
    } catch (error) {
      console.error('Admin fetch error:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // --- Product Handlers ---

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category._id,
        stock: product.stock,
        featured: product.featured
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: categories.length > 0 ? categories[0]._id : '',
        stock: 10,
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct._id}`, formData);
        toast.success('Product updated');
      } else {
        await API.post('/admin/products', formData);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchData(); // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      setProducts(products.filter(p => p._id !== id));
      setStats(s => ({ ...s, totalProducts: s.totalProducts - 1 }));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // --- Order Handlers ---

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}`, { status });
      toast.success(`Order marked as ${status}`);
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (authLoading || loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-page fade-in">
      <h1>Admin Dashboard</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >Overview</button>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >Products</button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >Orders</button>
      </div>

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && stats && (
        <div className="slide-up">
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-value">Rs. {stats.totalRevenue?.toFixed(0) || 0}</div>
              <div className="admin-stat-label">Total Revenue</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.totalOrders || 0}</div>
              <div className="admin-stat-label">Total Orders</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.pendingOrders || 0}</div>
              <div className="admin-stat-label">Pending Orders</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.totalProducts || 0}</div>
              <div className="admin-stat-label">Total Products</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{stats.totalUsers || 0}</div>
              <div className="admin-stat-label">Registered Users</div>
            </div>
          </div>
          
          <div style={{ marginTop: 'var(--space-2xl)' }}>
            <h3>Recent Actions</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
              Navigate to Products or Orders tabs to manage store inventory and customer orders.
            </p>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div className="slide-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2>Manage Inventory</h2>
            <button className="btn btn-primary" onClick={() => handleOpenProductModal()}>
              + Add New Product
            </button>
          </div>

          <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image || '/placeholder.jpg'} alt={product.name} className="admin-table-img" />
                    </td>
                    <td style={{ fontWeight: '500' }}>{product.name}</td>
                    <td>{product.category?.name || 'N/A'}</td>
                    <td>Rs. {product.price.toFixed(2)}</td>
                    <td style={{ color: product.stock <= 3 ? 'var(--color-danger)' : 'inherit' }}>
                      {product.stock}
                    </td>
                    <td>{product.featured ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenProductModal(product)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div className="slide-up">
          <h2 style={{ marginBottom: 'var(--space-lg)' }}>Manage Orders</h2>

          <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace' }}>...{order._id.slice(-6)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.shipping?.name || 'Unknown'}</td>
                    <td>Rs. {order.total.toFixed(2)}</td>
                    <td>
                      <span className={`order-status ${order.status}`}>{order.status}</span>
                    </td>
                    <td>
                      <select 
                        className="form-group select" 
                        style={{ padding: '6px 10px', width: 'auto', marginBottom: 0 }}
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRODUCT MODAL ── */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '25px', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={formData.featured} 
                    onChange={e => setFormData({...formData, featured: e.target.checked})} 
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="featured" style={{ marginBottom: 0 }}>Featured Product</label>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL (from Unsplash or existing images)</label>
                <input 
                  type="url" 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
