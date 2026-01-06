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
 * @param {string} category - Product category (name or slug)
 * @returns {Promise} Products data
 */
export const fetchProductsByCategory = async (category) => {
  try {
    // DummyJSON API uses slug format (lowercase, hyphenated)
    // Convert category name to slug format if needed
    const categorySlug = category
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters
    
    const response = await fetch(`${BASE_URL}/products/category/${categorySlug}`);
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
    // Keep original fields for API operations
    title: product.title,
    thumbnail: product.thumbnail,
  };
};

// ==================== AUTHENTICATION API ====================

/**
 * Login user
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Promise} Auth data with token
 */
export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Register user (mock - DummyJSON doesn't have real registration)
 * Note: DummyJSON's /users/add is a mock endpoint that doesn't create real accounts.
 * Users created here cannot be used to login. Use test credentials for login.
 * @param {Object} userData - User registration data
 * @returns {Promise} User data
 */
export const register = async (userData) => {
  try {
    // DummyJSON uses /users/add for adding users (mock endpoint)
    // Format the data correctly for the API
    const formattedData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      age: userData.age || 0,
    };
    
    const response = await fetch(`${BASE_URL}/users/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

/**
 * Get authenticated user data
 * @param {string} token - Auth token
 * @returns {Promise} User data
 */
export const getAuthUser = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching auth user:', error);
    throw error;
  }
};

// ==================== PRODUCT CRUD API ====================

/**
 * Add a new product
 * @param {Object} productData - Product data
 * @returns {Promise} Created product
 */
export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Failed to add product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} Updated product
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {number} id - Product ID
 * @returns {Promise} Deleted product data
 */
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ==================== CARTS API ====================

/**
 * Get all carts
 * @param {number} limit - Number of carts to fetch
 * @param {number} skip - Number of carts to skip
 * @returns {Promise} Carts data
 */
export const fetchAllCarts = async (limit = 30, skip = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/carts?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch carts');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching carts:', error);
    throw error;
  }
};

/**
 * Get a single cart by ID
 * @param {number} id - Cart ID
 * @returns {Promise} Cart data
 */
export const fetchCartById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Get carts by user ID
 * @param {number} userId - User ID
 * @returns {Promise} Carts data
 */
export const fetchCartsByUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user carts');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user carts:', error);
    throw error;
  }
};

/**
 * Add a new cart
 * @param {Object} cartData - Cart data
 * @returns {Promise} Created cart
 */
export const addCart = async (cartData) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    });
    if (!response.ok) {
      throw new Error('Failed to add cart');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding cart:', error);
    throw error;
  }
};

/**
 * Update a cart
 * @param {number} id - Cart ID
 * @param {Object} cartData - Updated cart data
 * @returns {Promise} Updated cart
 */
export const updateCart = async (id, cartData) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    });
    if (!response.ok) {
      throw new Error('Failed to update cart');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

/**
 * Delete a cart
 * @param {number} id - Cart ID
 * @returns {Promise} Deleted cart data
 */
export const deleteCart = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete cart');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting cart:', error);
    throw error;
  }
};

// ==================== USERS API ====================

/**
 * Get all users
 * @param {number} limit - Number of users to fetch
 * @param {number} skip - Number of users to skip
 * @returns {Promise} Users data
 */
export const fetchAllUsers = async (limit = 30, skip = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/users?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a single user by ID
 * @param {number} id - User ID
 * @returns {Promise} User data
 */
export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Search users
 * @param {string} query - Search query
 * @returns {Promise} Users data
 */
export const searchUsers = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search users');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

