import React from 'react';
import { Link } from 'react-router-dom';

const BodyModel = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Body Model</h1>
      <p>Body model page.</p>
      <Link to="/">Back to Login</Link>
    </div>
  );
};

export default BodyModel;
