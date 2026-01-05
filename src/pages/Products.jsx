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
    const filterProducts = async () => {
      // If searching, don't filter by category here (handled in search effect)
      if (searchTerm.trim()) {
        return;
      }

      if (!selectedCategory || selectedCategory === 'All') {
        setFilteredProducts(products);
        return;
      }

      try {
        setLoading(true);
        const categoryData = await fetchProductsByCategory(selectedCategory);
        const transformedProducts = categoryData.products.map(transformProduct);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        console.error('Error filtering by category:', err);
        setError('Failed to filter products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (products.length > 0) {
      filterProducts();
    }
  }, [selectedCategory, products, searchTerm]);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        // If no search term, show all products or filtered by category
        if (!selectedCategory || selectedCategory === 'All') {
          setFilteredProducts(products);
        }
        return;
      }

      try {
        setLoading(true);
        const searchData = await searchProducts(searchTerm);
        const transformedProducts = searchData.products.map(transformProduct);
        
        // Also filter by category if one is selected
        let filtered = transformedProducts;
        if (selectedCategory && selectedCategory !== 'All') {
          filtered = transformedProducts.filter(p => p.category === selectedCategory);
        }
        
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

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

