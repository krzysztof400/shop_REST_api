// frontend/src/pages/ProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';

function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('ProductsPage useEffect triggered by location change:', location.pathname); // <<< ADD THIS LOG
    fetchProducts();
    loadCartFromStorage();
    checkUserStatus();
  }, [location]);

  const checkUserStatus = () => {
    console.log('checkUserStatus called'); // <<< ADD THIS LOG
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('user');
    console.log('Token from localStorage in checkUserStatus:', token); // <<< ADD THIS LOG
    console.log('User data string from localStorage in checkUserStatus:', userDataString); // <<< ADD THIS LOG

    if (token && userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        console.log('Parsed user data in checkUserStatus:', parsedUser); // <<< ADD THIS LOG
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); 
        localStorage.removeItem('token'); 
        setUser(null); 
      }
    } else {
      console.log('Token or userDataString missing in checkUserStatus. Setting user to null.'); // <<< ADD THIS LOG
      setUser(null);
      if (!token) {
        localStorage.removeItem('user'); 
      }
    }
  };
  const fetchProducts = async () => {
    setLoading(true); // Set loading to true at the start
    setError(''); // Clear previous errors
    try {
      const response = await fetch('/api/products', {
        headers: {
          'Cache-Control': 'no-cache', // Add Cache-Control header
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Assuming your API returns products in a 'data' property
        // or directly as an array if 'data' is not present.
        setProducts(data.data || data); 
      } else {
        const errorData = await response.json().catch(() => ({ message: response.statusText })); // Handle non-JSON error responses
        setError(`Failed to fetch products: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item._id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    console.log('handleCheckout called. Current cart:', cart);
    console.log('handleCheckout: Is user logged in?', user);

    if (cart.length === 0) {
      alert('Your cart is empty');
      console.log('handleCheckout: Cart is empty. Aborting.');
      return;
    }
    
    if (!user) {
      alert('Please login to checkout');
      console.log('handleCheckout: User not logged in. Aborting and navigating to login.');
      navigate('/login');
      return;
    }

    const currentTotal = getTotalPrice();
    console.log('handleCheckout: Calculated total price:', currentTotal);

    const orderData = {
      items: cart,
      total: currentTotal
    };
    console.log('ProductsPage: Preparing to set pendingOrder with data:', orderData);
    
    // Validate orderData before attempting to store it
    if (!orderData.items || orderData.items.length === 0 || typeof orderData.total !== 'number' || isNaN(orderData.total)) {
      console.error('ProductsPage: Invalid orderData before setting to localStorage. Aborting checkout.', orderData);
      alert('There was an issue preparing your order. Please try again.');
      return;
    }

    try {
      const stringifiedOrderData = JSON.stringify(orderData);
      console.log('ProductsPage: Stringified orderData:', stringifiedOrderData);
      localStorage.setItem('pendingOrder', stringifiedOrderData);
      
      // Verify it was set by reading it back immediately
      const verifyStoredData = localStorage.getItem('pendingOrder');
      console.log('ProductsPage: Verified pendingOrder from localStorage immediately after set:', verifyStoredData);
      
      if (verifyStoredData === stringifiedOrderData) {
        console.log('ProductsPage: Successfully set and verified pendingOrder. Navigating to /payment.');
        navigate('/payment');
      } else {
        console.error('ProductsPage: Discrepancy found after setting pendingOrder. Expected:', stringifiedOrderData, 'Got:', verifyStoredData);
        alert('Failed to save order details for payment. Please try again.');
      }
    } catch (e) {
      console.error('ProductsPage: Error stringifying or setting pendingOrder to localStorage:', e);
      alert('An error occurred while preparing your order for payment. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    localStorage.removeItem('cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Good World Assosiation Store</h1>
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H2m5 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-12 4h.01M17 21h.01" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Logged in as: {user.name || 'User'}</span>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/orders')}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Not logged in</span>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {products.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(products) && products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          totalPrice={getTotalPrice()}
        />
      )}
    </div>
  );
}

export default ProductsPage;