import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/helpers';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await employeeAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products">
      <h1>Products</h1>
      <p className="subtitle">View all inventory products</p>

      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.supplier}</td>
                <td>{formatCurrency(product.unitPrice)}</td>
                <td className={product.lowStock ? 'text-red' : ''}>
                  {product.quantity}
                  {product.lowStock && ' ⚠️'}
                </td>
                <td>{formatCurrency(product.totalValue)}</td>
                <td>{formatDate(product.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
