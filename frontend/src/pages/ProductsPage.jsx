import React, { useEffect } from 'react';

function ProductsPage() {
    useEffect(() => {
        fetch('/api/products')
            .then((response) => response.json())
            .then((data) => {
                console.log('Products data:', data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }
    , []);

  return (
    <div>
        <div className="flex justify-end p-4">
            <a href="/admin" className="btn ml-2">Admin</a>
            <a href="/register" className="btn ml-2">Register</a>
            <a href="/login" className="btn ml-2">Login</a>
        </div>
        <h1>Products Page</h1>
        <p>This is the products page.</p>
    </div>
  );
}
export default ProductsPage;