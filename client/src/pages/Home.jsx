import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products/featured')
        ]);
        setCategories(catRes.data.categories);
        setFeatured(featRes.data.products);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero fade-in">
        <div className="hero-content">
          <span className="hero-badge">Est. 1987</span>
          <h1>Timeless treasures</h1>
          <div className="hero-author">BY DARSHAN</div>
          <p>
            Step into an era of unmatched craftsmanship. From authentic '90s selvedge denim to gracefully aged leather boots, every curated piece in our collection carries a soul, a history, and a timeless aesthetic waiting to be reborn.
          </p>
          <div className="hero-buttons">
            <a href="#categories" className="btn btn-primary btn-lg">Shop Now</a>
            <Link to="/category/denims" className="btn btn-outline btn-lg">Explore Denims</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="section fade-in">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Our curated collection of vintage staples</p>
            <div className="section-divider"></div>
          </div>

          <div className="categories-grid">
            {categories.map(category => (
              <Link to={`/category/${category.slug}`} key={category._id} className="category-card slide-up">
                <img src={category.image} alt={category.name} className="category-card-img" loading="lazy" />
                <div className="category-card-overlay">
                  <h3 className="category-card-name">{category.name}</h3>
                  <span className="category-card-count">Explore Collection →</span>
                </div>
                <div className="category-card-arrow">↗</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="section featured-section fade-in">
        <div className="container">
          <div className="section-header">
            <h2>Featured Finds</h2>
            <p>Rare and highly sought-after vintage pieces</p>
            <div className="section-divider"></div>
          </div>

          <div className="products-grid">
            {featured.map(product => (
              <div className="slide-up" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
