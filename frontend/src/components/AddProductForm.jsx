import React, { useState } from 'react';
import MyInput from './MyInput'; 

function AddProductForm({ onProductAdded, onCancel }) {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.stock) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`, // Add authorization if needed
        },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        alert('Product added successfully!');
        setProductData({ name: '', description: '', price: '', category: '', stock: '' });
        if (onProductAdded) {
          onProductAdded();
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to add product: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    }
  };

  return (
    <div className="mt-8 p-6 w-full max-w-md bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Product</h2>
      <form onSubmit={handleSubmitProduct} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <MyInput
            type="text"
            name="name"
            id="name"
            placeholder="Enter product name"
            value={productData.name}
            onChange={handleInputChange}
            // required // MyInput doesn't currently support 'required', add if needed
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={productData.description}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Enter product description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <MyInput
            type="number"
            name="price"
            id="price"
            placeholder="Enter price (e.g., 19.99)"
            value={productData.price}
            onChange={handleInputChange}
            // min="0" // MyInput doesn't currently support 'min' or 'step'
            // step="0.01"
            // required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <MyInput
            type="text"
            name="category"
            id="category"
            placeholder="Enter product category"
            value={productData.category}
            onChange={handleInputChange}
            // required
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <MyInput
            type="number"
            name="stock"
            id="stock"
            placeholder="Enter stock quantity"
            value={productData.stock}
            onChange={handleInputChange}
            // min="0"
            // required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;