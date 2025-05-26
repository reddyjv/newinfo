import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './styles.css';
import { useNavigate } from 'react-router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchBy, setSearchBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // This effect will run whenever searchInput or searchBy changes
    handleSearch();
  }, [searchInput, searchBy, products]); // Added products to dependencies to re-filter when products change

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => console.error(err));
  };

  const handleModalSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/products/${currentProduct.productId}`, currentProduct);
      setShowModal(false);
      fetchProducts();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleSearch = () => {
    const query = searchInput.toLowerCase().trim();
    
    if (!query) {
      // If search input is empty, show all products
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(prod => {
      if (searchBy === 'name') {
        return prod.pname.toLowerCase().includes(query);
      } else if (searchBy === 'id') {
        return prod.productId.toLowerCase().includes(query);
      }
      return false;
    });
    setFilteredProducts(filtered);
  };

  // Rest of your code remains the same...
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleUpdate = (productId) => {
    const selected = products.find(prod => prod.productId === productId);
    setCurrentProduct({ ...selected });
    setShowModal(true);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'products.xlsx');
  };

  return (
    <>
      {currentProduct && (
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form className="container">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Product ID</label>
                      <input type="text" className="form-control form-control-sm" value={currentProduct.productId} disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Product Name</label>
                      <input type="text" className="form-control form-control-sm"
                        value={currentProduct.pname}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, pname: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Sale Price</label>
                      <input type="number" className="form-control form-control-sm"
                        value={currentProduct.saleprice}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, saleprice: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">MRP</label>
                      <input type="number" className="form-control form-control-sm"
                        value={currentProduct.MRP}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, MRP: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Stock</label>
                      <input type="number" className="form-control form-control-sm"
                        value={currentProduct.stock}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">GST (%)</label>
                      <input type="number" className="form-control form-control-sm"
                        value={currentProduct.GST}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, GST: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Batch No</label>
                      <input type="text" className="form-control form-control-sm"
                        value={currentProduct.batchNo}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, batchNo: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select form-select-sm"
                        value={currentProduct.category}
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, category: e.target.value })
                        }
                      >
                        <option value="">Select a category</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Beauty Products">Beauty Products</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                      </select>
                    </div>

                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleModalSubmit}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="product-table-wrapper container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded mb-4 px-4">
          <span className="navbar-brand"><i className="bi bi-box-seam-fill"></i> Product Manager</span>
        </nav>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <div className="d-flex gap-2 flex-grow-1 align-items-center">
            {/* Toggle Buttons */}
            <div className="btn-group me-2" role="group" aria-label="Search By">
              <button
                className={`btn ${searchBy === 'name' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSearchBy('name')}
              >
                <i className="bi bi-type"></i> Name
              </button>
              <button
                className={`btn ${searchBy === 'id' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSearchBy('id')}
              >
                <i className="bi bi-hash"></i> Product ID
              </button>
            </div>

            <input
              type="text"
              className="form-control search-input"
              placeholder={searchBy === 'name' ? '🔍 Enter product name...' : '🔍 Enter product ID...'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={handleSearch}>
              <i className="bi bi-search"></i> Search
            </button>
          </div>
          <button className="btn btn-success" onClick={handleDownload}>
            <i className="bi bi-download"></i> Download Excel
          </button>
        </div>

        <div className="table-responsive rounded shadow-sm">
          <table className="table table-bordered table-hover table-light text-center">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Sale Price</th>
                <th>MRP</th>
                <th>Stock</th>
                <th>GST</th>
                <th>Batch No</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(prod => (
                  <tr key={prod.productId}>
                    <td>{prod.productId}</td>
                    <td>{prod.pname}</td>
                    <td>₹{prod.saleprice}</td>
                    <td>₹{prod.MRP}</td>
                    <td>{prod.stock}</td>
                    <td>{prod.GST}%</td>
                    <td>{prod.batchNo}</td>
                    <td>{prod.category}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => handleUpdate(prod.productId)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod.productId)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <span style={{ color: "blue" }}><strong>Total Products:</strong> {filteredProducts.length}</span>
          <span style={{ color: "blue" }}><strong>All Products:</strong> {products.length}</span>
        </div>
      </div>
      {showSuccess && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-2 rounded shadow"
          style={{
            backgroundColor: '#00e600',
            color: '#ffffff',
            zIndex: 1050,
            transition: 'transform 0.5s ease-out',
            animation: 'slideDown 0.5s ease forwards'
          }}
        >
          Product Id updated Successfully!
        </div>
      )}
    </>

  );
};

export default ProductList;
