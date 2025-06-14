import React, { useState } from 'react';
import AddProductForm from '../components/AddProductForm'; 

function AdminPage() {
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const handleProductAdded = () => {
    setShowAddProductForm(false);
  };

  const handleCancelAddProduct = () => {
    setShowAddProductForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <p className="text-lg mb-6">Manage your products and settings here.</p>
      <div className="space-y-4">
        <button
          onClick={() => setShowAddProductForm(true)} // Show form on click
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add product
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            View Reports
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Update Settings
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete Data
        </button>
      </div>

      {showAddProductForm && (
        <AddProductForm
          onProductAdded={handleProductAdded}
          onCancel={handleCancelAddProduct}
        />
      )}

      <a href="/" className="mt-8 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
        Back to main page
      </a>
    </div>
  );
}

export default AdminPage;