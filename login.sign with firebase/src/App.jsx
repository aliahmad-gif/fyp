import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AllLoginSignForget from './pages/AllLoginSignForget';
import Product from './pages/Product';
import BodyModel from './pages/BodyModel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllLoginSignForget />} />
        <Route path="/product" element={<Product />} />
        <Route path="/bodymodel" element={<BodyModel />} />
      </Routes>
    </Router>
  );
}

export default App;
