import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const limit = 12;

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        const categoryStrings = Array.isArray(categoriesData) 
          ? categoriesData.map(cat => typeof cat === 'string' ? cat : (cat.name || cat.slug || String(cat)))
          : [];
        const categoryList = ['All', ...categoryStrings];
        setCategories(categoryList);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, []);


  useEffect(() => {
    if (!searchTerm.trim() && (!selectedCategory || selectedCategory === 'All')) {
      loadProducts();
    }
  }, [currentPage, sortBy, sortOrder, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const skip = (currentPage - 1) * limit;
      const productsData = await fetchProducts(limit, skip);
      setTotal(productsData.total || 0);
      
      let transformedProducts = productsData.products.map(transformProduct);
      
      //  E3ml sort
      if (sortBy) {
        transformedProducts.sort((a, b) => {
          let aVal = a[sortBy] || a.name || a.title || '';
          let bVal = b[sortBy] || b.name || b.title || '';
          
          if (sortBy === 'price' || sortBy === 'rating') {
            aVal = Number(aVal) || 0;
            bVal = Number(bVal) || 0;
          } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }
      
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter 
  useEffect(() => {
    if (searchTerm.trim()) {
      return;
    }

    const filterProducts = async () => {
      if (!selectedCategory || selectedCategory === 'All') {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1); 
        const categoryData = await fetchProductsByCategory(selectedCategory);
        
        if (categoryData && categoryData.products && categoryData.products.length > 0) {
          let transformedProducts = categoryData.products.map(transformProduct);
          
          // Apply sorting if set
          if (sortBy) {
            transformedProducts.sort((a, b) => {
              let aVal = a[sortBy] || a.name || a.title || '';
              let bVal = b[sortBy] || b.name || b.title || '';
              
              if (sortBy === 'price' || sortBy === 'rating') {
                aVal = Number(aVal) || 0;
                bVal = Number(bVal) || 0;
              } else {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
              }
              
              if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
              } else {
                return aVal < bVal ? 1 : -1;
              }
            });
          }
          
          setFilteredProducts(transformedProducts);
          setTotal(transformedProducts.length);
        } else {
          setFilteredProducts([]);
          setTotal(0);
        }
      } catch (err) {
        console.error('Error filtering by category:', err);
        setFilteredProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [selectedCategory, searchTerm, sortBy, sortOrder]);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        // If no search term, reset to normal view - let other effects handle it
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1); // Reset to first page when searching
        const searchData = await searchProducts(searchTerm);
        let transformedProducts = searchData.products.map(transformProduct);
        
        // Also filter by category if one is selected
        if (selectedCategory && selectedCategory !== 'All') {
          const normalizedCategory = selectedCategory.toLowerCase().trim();
          transformedProducts = transformedProducts.filter(p => {
            if (!p.category) return false;
            const productCategory = p.category.toLowerCase().trim();
            return productCategory === normalizedCategory || 
                   productCategory.replace(/\s+/g, '-') === normalizedCategory.replace(/\s+/g, '-');
          });
        }
        
        // Apply sorting if set
        if (sortBy) {
          transformedProducts.sort((a, b) => {
            let aVal = a[sortBy] || a.name || a.title || '';
            let bVal = b[sortBy] || b.name || b.title || '';
            
            if (sortBy === 'price' || sortBy === 'rating') {
              aVal = Number(aVal) || 0;
              bVal = Number(bVal) || 0;
            } else {
              aVal = String(aVal).toLowerCase();
              bVal = String(bVal).toLowerCase();
            }
            
            if (sortOrder === 'asc') {
              return aVal > bVal ? 1 : -1;
            } else {
              return aVal < bVal ? 1 : -1;
            }
          });
        }
        
        setFilteredProducts(transformedProducts);
        setTotal(transformedProducts.length);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products. Please try again.');
        setFilteredProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

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
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            {categories.map((category) => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field || '');
              setSortOrder(order || 'asc');
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest</option>
            <option value="rating-asc">Rating: Lowest</option>
            <option value="title-asc">Name: A to Z</option>
            <option value="title-desc">Name: Z to A</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <div style={{ color: '#a5b4fc', paddingTop: '8px' }}>
            Total: {total} products
          </div>
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
      
      {/* Pagination - only show when not searching or filtering by category */}
      {!searchTerm.trim() && (!selectedCategory || selectedCategory === 'All') && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(Math.min(5, Math.ceil(total / limit)))].map((_, i) => {
                const page = currentPage - 2 + i;
                const totalPages = Math.ceil(total / limit);
                if (page < 1 || page > totalPages) return null;
                return (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(total / limit), p + 1))}
                disabled={currentPage >= Math.ceil(total / limit)}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(Math.ceil(total / limit))}
                disabled={currentPage >= Math.ceil(total / limit)}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Products;

