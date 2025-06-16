// frontend/src/components/EditProductForm.jsx
import React, { useState, useEffect } from 'react';
import MyInput from './MyInput';

function EditProductForm({ product, onProductUpdated, onCancel }) {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!productData.name || !productData.price || !productData.stock) {
      alert('Please fill in at least Name, Price, and Stock.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        if (onProductUpdated) {
          onProductUpdated();
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to update product: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Product</h2>
      <form onSubmit={handleSubmitProduct} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <MyInput type="text" name="name" value={productData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <MyInput type="number" name="price" value={productData.price} onChange={handleInputChange} required min="0" step="0.01" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <MyInput type="text" name="category" value={productData.category} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <MyInput type="number" name="stock" value={productData.stock} onChange={handleInputChange} required min="0" />
        </div>
        <div className="flex space-x-4 pt-2">
          <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Save Changes
          </button>
          <button type="button" onClick={onCancel} className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductForm;