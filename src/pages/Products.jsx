import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories, searchProducts, fetchProductsByCategory, transformProduct } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(100), // Fetch up to 100 products
          fetchCategories()
        ]);

        const transformedProducts = productsData.products.map(transformProduct);
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        
        // Set categories - ensure they're strings
        const categoryStrings = Array.isArray(categoriesData) 
          ? categoriesData.map(cat => typeof cat === 'string' ? cat : (cat.name || cat.slug || String(cat)))
          : [];
        const categoryList = ['All', ...categoryStrings];
        setCategories(categoryList);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle category filter (only when not searching)
  useEffect(() => {
    // Don't run if we're searching (search effect handles it)
    if (searchTerm.trim()) {
      return;
    }

    const filterProducts = async () => {
      if (!selectedCategory || selectedCategory === 'All') {
        // Show all products
        if (products.length > 0) {
          setFilteredProducts(products);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const categoryData = await fetchProductsByCategory(selectedCategory);
        
        if (categoryData && categoryData.products && categoryData.products.length > 0) {
          const transformedProducts = categoryData.products.map(transformProduct);
          setFilteredProducts(transformedProducts);
        } else {
          // If API returns empty, try filtering local products as fallback
          const normalizedCategory = selectedCategory.toLowerCase().trim();
          const localFiltered = products.filter(p => {
            if (!p.category) return false;
            const productCategory = p.category.toLowerCase().trim();
            return productCategory === normalizedCategory || 
                   productCategory.replace(/\s+/g, '-') === normalizedCategory.replace(/\s+/g, '-');
          });
          setFilteredProducts(localFiltered);
          if (localFiltered.length === 0) {
            setError(null); // Don't show error, just show empty state
          }
        }
      } catch (err) {
        console.error('Error filtering by category:', err);
        // Fallback to local filtering if API fails
        const normalizedCategory = selectedCategory.toLowerCase().trim();
        const localFiltered = products.filter(p => {
          if (!p.category) return false;
          const productCategory = p.category.toLowerCase().trim();
          return productCategory === normalizedCategory || 
                 productCategory.replace(/\s+/g, '-') === normalizedCategory.replace(/\s+/g, '-');
        });
        setFilteredProducts(localFiltered);
        // Don't set error for empty results, just show empty state
      } finally {
        setLoading(false);
      }
    };

    // Only filter if we have products loaded
    if (products.length > 0) {
      filterProducts();
    }
  }, [selectedCategory, searchTerm]);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        // If no search term, let category filter handle it
        // Reset to show all or category-filtered products
        if (!selectedCategory || selectedCategory === 'All') {
          setFilteredProducts(products);
        } else {
          // Trigger category filter by not doing anything here
          // The category effect will handle it
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchData = await searchProducts(searchTerm);
        const transformedProducts = searchData.products.map(transformProduct);
        
        // Also filter by category if one is selected
        let filtered = transformedProducts;
        if (selectedCategory && selectedCategory !== 'All') {
          const normalizedCategory = selectedCategory.toLowerCase().trim();
          filtered = transformedProducts.filter(p => 
            p.category && p.category.toLowerCase() === normalizedCategory
          );
        }
        
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products. Please try again.');
        // Fallback to local search
        const searchLower = searchTerm.toLowerCase();
        let localFiltered = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
        if (selectedCategory && selectedCategory !== 'All') {
          const normalizedCategory = selectedCategory.toLowerCase().trim();
          localFiltered = localFiltered.filter(p => 
            p.category && p.category.toLowerCase() === normalizedCategory
          );
        }
        setFilteredProducts(localFiltered);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, products]);

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4" style={{
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            Our Products
          </h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loading}
          >
            {categories.map((category) => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      {loading ? (
        <Row>
          <Col className="text-center my-5">
            <Spinner animation="border" variant="primary" style={{ 
              width: '3rem', 
              height: '3rem',
              borderWidth: '4px',
              borderColor: '#00f5ff',
              borderRightColor: 'transparent'
            }} />
            <p className="mt-3" style={{ color: '#a5b4fc' }}>Loading products...</p>
          </Col>
        </Row>
      ) : (
        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center" style={{ color: '#a5b4fc' }}>No products found.</p>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Products;

