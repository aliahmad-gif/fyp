import React from 'react';
import { Link } from 'react-router-dom';

const Product = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Product</h1>
      <p>Product page.</p>
      <Link to="/">Back to Login</Link>
    </div>
  );
};

export default Product;
