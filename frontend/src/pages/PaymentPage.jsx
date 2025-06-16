// frontend/src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyInput from '../components/MyInput';

function PaymentPage() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [error, setError] = useState('');

// ...existing code...
useEffect(() => {
  setIsOrderLoading(true);
  console.log('PaymentPage: useEffect triggered. Attempting to retrieve pendingOrder.');
  const storedOrderDataString = localStorage.getItem('pendingOrder');
  console.log('PaymentPage: Retrieved storedOrderDataString from localStorage:', storedOrderDataString);

  if (storedOrderDataString && storedOrderDataString !== 'undefined' && storedOrderDataString !== 'null') {
    try {
      const parsedData = JSON.parse(storedOrderDataString);
      console.log('PaymentPage: Successfully parsed pendingOrder:', parsedData);
      // Add a more robust check for the structure of parsedData
      if (parsedData && Array.isArray(parsedData.items) && typeof parsedData.total === 'number') {
        setOrderData(parsedData);
      } else {
        console.error('PaymentPage: Parsed order data is missing expected fields (items array, total number) or is null:', parsedData);
        setError('Retrieved order details are incomplete or invalid. Please try checking out again.');
        localStorage.removeItem('pendingOrder'); // Clean up invalid/incomplete data
      }
    } catch (e) {
      console.error("PaymentPage: Failed to parse pendingOrder from localStorage:", e, "Raw string was:", storedOrderDataString);
      setError('Error retrieving order details. Please try checking out again.');
      localStorage.removeItem('pendingOrder'); // Clean up unparseable data
    }
  } else {
    console.log('PaymentPage: No valid pendingOrder found in localStorage (it was null, undefined, or the string "undefined" or "null").');
    setError('No order information found. Please return to your cart and try checking out again.');
  }
  setIsOrderLoading(false);
}, []); // Runs once on mount
// ...existing code...


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!orderData) {
      setError('Cannot proceed with payment: order details are missing.');
      return;
    }

    // Validate required fields
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardHolder) {
      setError('Please fill in all payment fields');
      return; // No need to set isSubmitting if validation fails early
    }

    setIsSubmitting(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to complete your order');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems: orderData.items,
          shippingAddress: {
            address: paymentData.billingAddress,
            city: paymentData.city,
            postalCode: paymentData.postalCode,
            country: paymentData.country
          },
          paymentMethod: 'Credit Card',
          totalPrice: orderData.total
        })
      });

      if (response.ok) {
        // const order = await response.json(); // Not used, can be removed if not needed
        await response.json();
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('cart'); // Also clear the main cart
        alert('Payment successful! Your order has been placed.');
        navigate('/orders');
      } else {
        const errorData = await response.json();
        setError(`Failed to create order: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex justify-center items-center">
        <div className="text-xl font-semibold">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Payment</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {orderData ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 text-lg font-bold">
                    <span>Total:</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-gray-500">
                  Order details are unavailable. Please return to your cart and try checking out again.
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <MyInput
                    type="text"
                    name="cardHolder"
                    placeholder="John Doe"
                    value={paymentData.cardHolder}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <MyInput
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <MyInput
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <MyInput
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-4">Billing Address</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <MyInput
                    type="text"
                    name="billingAddress"
                    placeholder="123 Main St"
                    value={paymentData.billingAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <MyInput
                      type="text"
                      name="city"
                      placeholder="Warsaw"
                      value={paymentData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <MyInput
                      type="text"
                      name="postalCode"
                      placeholder="00-001"
                      value={paymentData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <MyInput
                    type="text"
                    name="country"
                    placeholder="Poland"
                    value={paymentData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !orderData} // Disable if submitting or no order data
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium"
                  >
                    {isSubmitting ? 'Processing...' : (orderData ? `Pay $${orderData.total.toFixed(2)}` : 'Payment Unavailable')}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;