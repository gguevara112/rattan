import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config.js';


function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`); // Usa la URL base
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }

  async function handleAddOrUpdateProduct(e) {
    e.preventDefault();

    if (editingProductId) {
      // Editar producto
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });

        if (response.ok) {
          setProducts(products.map(product =>
            product._id === editingProductId ? { ...product, ...newProduct } : product
          ));
          setNewProduct({ name: '', description: '', price: '' });
          setEditingProductId(null);
        } else {
          console.error("Error al actualizar producto:", await response.json());
        }
      } catch (error) {
        console.error("Error al actualizar producto:", error);
      }
    } else {
      // Agregar nuevo producto
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });
        const addedProduct = await response.json();
        setProducts([...products, addedProduct]);
        setNewProduct({ name: '', description: '', price: '' });
      } catch (error) {
        console.error("Error al agregar producto:", error);
      }
    }
  }

  async function handleDeleteProduct(id) {
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' }); // Usa la URL base
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  function handleEditProduct(product) {
    setNewProduct({ name: product.name, description: product.description, price: product.price });
    setEditingProductId(product._id);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  }

  return (
    <div>
      <h2>{editingProductId ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <form onSubmit={handleAddOrUpdateProduct}>
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editingProductId ? 'Actualizar Producto' : 'Agregar Producto'}</button>
        {editingProductId && (
          <button type="button" onClick={() => setEditingProductId(null)}>Cancelar Edición</button>
        )}
      </form>

      <h2>Lista de Productos</h2>
      <div>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <button onClick={() => handleEditProduct(product)}>Editar</button>
            <button onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
