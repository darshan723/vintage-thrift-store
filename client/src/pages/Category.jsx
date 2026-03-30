import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        const { data: catData } = await API.get(`/categories/${slug}`);
        setCategory(catData.category);

        const { data: prodData } = await API.get('/products', {
          params: { category: slug, sort, search }
        });
        setProducts(prodData.products);
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug, sort, search]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="empty-state fade-in">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Category Not Found</h2>
        <p>The collection you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Category Header */}
      <div className="category-page-header">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </div>

      <div className="container section" style={{ paddingTop: '0' }}>
        {/* Filters */}
        <div className="filter-bar">
          <input 
            type="text" 
            placeholder={`Search ${category.name.toLowerCase()}...`}
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>

          <span className="product-count">{products.length} Items</span>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
               <div className="slide-up" key={product._id}>
                <ProductCard product={product} />
               </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h3>No pieces found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
