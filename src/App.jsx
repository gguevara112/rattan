import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Router>
      <div>
        <h1>Mi Tienda de Productos</h1>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
