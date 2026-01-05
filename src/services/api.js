// DummyJSON API Service
const BASE_URL = 'https://dummyjson.com';

/**
 * Fetch all products from DummyJSON API
 * @param {number} limit - Number of products to fetch (default: 30)
 * @param {number} skip - Number of products to skip (for pagination)
 * @returns {Promise} Products data
 */
export const fetchProducts = async (limit = 30, skip = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 * @param {number|string} id - Product ID
 * @returns {Promise} Product data
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Fetch products by category
 * @param {string} category - Product category
 * @returns {Promise} Products data
 */
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

/**
 * Search products
 * @param {string} query - Search query
 * @returns {Promise} Products data
 */
export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get all available categories
 * @returns {Promise} Array of category strings
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    // DummyJSON returns an array of category objects with {slug, name, url}
    // Extract just the category names (or slugs) as strings
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      // If it's an array of objects, extract the 'name' or 'slug' property
      return data.map(cat => cat.name || cat.slug || cat);
    }
    // If it's already an array of strings, return as is
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Transform DummyJSON product to our app format
 * @param {Object} product - Product from DummyJSON API
 * @returns {Object} Transformed product
 */
export const transformProduct = (product) => {
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    price: product.price,
    originalPrice: product.price * 1.2, // Add 20% as original price for discount display
    image: product.images && product.images.length > 0 ? product.images[0] : product.thumbnail,
    category: product.category,
    rating: product.rating || 0,
    inStock: product.stock > 0,
    stock: product.stock,
    brand: product.brand,
    discountPercentage: product.discountPercentage,
    images: product.images || [],
  };
};

