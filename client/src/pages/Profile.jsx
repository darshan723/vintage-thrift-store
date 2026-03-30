import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function Profile() {
  const { user, updateProfile, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }

    if (user) {
      setName(user.name);
      setEmail(user.email);
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Could not load order history');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const updates = { name, email };
      if (password) updates.password = password;
      
      await updateProfile(updates);
      setPassword(''); // Clear password field after update
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (authLoading || loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page fade-in">
      <h1>My Account</h1>

      <div className="profile-card slide-up">
        <h2>Profile Details</h2>
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={updating}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Update Profile'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={handleLogout}
              style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
            >
              Logout
            </button>
          </div>
        </form>
      </div>

      <div className="profile-card slide-up" style={{ animationDelay: '100ms' }}>
        <h2>Order History</h2>
        
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
            <p style={{ marginBottom: 'var(--space-md)' }}>You haven't placed any orders yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
          </div>
        ) : (
          <div className="order-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>Order #{order._id.substring(order._id.length - 8).toUpperCase()}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`order-status ${order.status}`}>{order.status}</div>
                    <div style={{ fontWeight: 'bold', marginTop: '4px' }}>Rs. {order.total.toFixed(2)}</div>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    <strong>Items:</strong> {order.items.length} 
                  </p>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} title={`${item.quantity}x ${item.name}`} style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', background: 'var(--color-bg-alt)' }}>
                         {item.image ? (
                           <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         ) : (
                           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>Pic</div>
                         )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
