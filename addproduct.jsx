import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';
import ManNavbar from './ManNavbar';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    pname: '',
    saleprice: '',
    MRP: '',
    GST: '',
    batchNo: '',
    category: '',
  });

  const [formErrors, setFormErrors] = useState({
    pname: '',
    saleprice: '',
    MRP: '',
    GST: '',
    batchNo: '',
    category: '',
  });

  const [formValid, setFormValid] = useState({
    pname: false,
    saleprice: false,
    MRP: false,
    GST: false,
    batchNo: false,
    category: false,
  });

  const navigate = useNavigate();
  const categories = ['Groceries', 'Fashion', 'Beauty Products', 'Electronics', 'Pharmacy'];
  const gstRates = [5, 12, 18, 28];

  const validateField = (fieldName, value) => {
    let error = '';
    let isValid = false;

    switch (fieldName) {
      case 'pname':
        isValid = /^[A-Za-z0-9\s]{2,50}$/.test(value);
        error = isValid ? '' : 'Product name should be 2-50 characters.';
        break;
      case 'saleprice':
        isValid = /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) >= 0;
        error = isValid ? '' : 'Enter a valid non-negative number.';
        break;
      case 'MRP':
        isValid = /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) >= 0;
        error = isValid ? '' : 'Enter a valid non-negative number.';
        break;
      case 'GST':
        isValid = value !== '';
        error = isValid ? '' : 'Please select GST rate.';
        break;
      case 'batchNo':
        isValid = /^[A-Za-z0-9]{3,20}$/.test(value);
        error = isValid ? '' : 'Batch number must be alphanumeric (3-20 chars).';
        break;
      case 'category':
        isValid = value !== '';
        error = isValid ? '' : 'Category is required.';
        break;
      default:
        break;
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    setFormValid(prev => ({ ...prev, [fieldName]: isValid }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isButtonActive = Object.values(formValid).every(valid => valid);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isButtonActive) return;

    try {
      const response = await axios.post('http://localhost:5000/api/products/add', formData);
      alert('✅ Product added with ID: ' + response.data.product.productId);
      navigate('/managerHome');
    } catch (error) {
      alert('❌ Error adding product');
      console.error(error);
    }
  };

  return (
    <>
      <ManNavbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white py-3">
                <h3 className="mb-0 text-center">
                  <i className="bi bi-box-seam me-2"></i>Add New Product
                </h3>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${formErrors.pname ? 'is-invalid' : ''}`}
                          id="pname"
                          name="pname"
                          value={formData.pname}
                          onChange={handleChange}
                          placeholder="Product Name"
                        />
                        <label htmlFor="pname">
                          <i className="bi bi-tag me-2"></i>Product Name
                        </label>
                        {formErrors.pname && <div className="invalid-feedback">{formErrors.pname}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="number"
                          className={`form-control ${formErrors.saleprice ? 'is-invalid' : ''}`}
                          id="saleprice"
                          name="saleprice"
                          value={formData.saleprice}
                          onChange={handleChange}
                          placeholder="Sale Price"
                          min="0"
                          step="0.01"
                        />
                        <label htmlFor="saleprice">
                          <i className="bi bi-currency-rupee me-2"></i>Sale Price
                        </label>
                        {formErrors.saleprice && <div className="invalid-feedback">{formErrors.saleprice}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="number"
                          className={`form-control ${formErrors.MRP ? 'is-invalid' : ''}`}
                          id="MRP"
                          name="MRP"
                          value={formData.MRP}
                          onChange={handleChange}
                          placeholder="MRP"
                          min="0"
                          step="0.01"
                        />
                        <label htmlFor="MRP">
                          <i className="bi bi-currency-rupee me-2"></i>MRP
                        </label>
                        {formErrors.MRP && <div className="invalid-feedback">{formErrors.MRP}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className={`form-select ${formErrors.GST ? 'is-invalid' : ''}`}
                          id="GST"
                          name="GST"
                          value={formData.GST}
                          onChange={handleChange}
                        >
                          <option value="">Select GST Rate</option>
                          {gstRates.map(rate => (
                            <option key={rate} value={rate}>{rate}%</option>
                          ))}
                        </select>
                        <label htmlFor="GST">
                          <i className="bi bi-percent me-2"></i>GST Rate
                        </label>
                        {formErrors.GST && <div className="invalid-feedback">{formErrors.GST}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${formErrors.batchNo ? 'is-invalid' : ''}`}
                          id="batchNo"
                          name="batchNo"
                          value={formData.batchNo}
                          onChange={handleChange}
                          placeholder="Batch Number"
                        />
                        <label htmlFor="batchNo">
                          <i className="bi bi-upc-scan me-2"></i>Batch Number
                        </label>
                        {formErrors.batchNo && <div className="invalid-feedback">{formErrors.batchNo}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className={`form-select ${formErrors.category ? 'is-invalid' : ''}`}
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <label htmlFor="category">
                          <i className="bi bi-grid me-2"></i>Category
                        </label>
                        {formErrors.category && <div className="invalid-feedback">{formErrors.category}</div>}
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <button 
                        type="submit" 
                        className={`btn btn-primary w-100 py-3 fw-bold ${!isButtonActive ? 'disabled opacity-75' : ''}`}
                        disabled={!isButtonActive}
                      >
                        {isButtonActive ? (
                          <><i className="bi bi-check-circle me-2"></i>Add Product</>
                        ) : (
                          <><i className="bi bi-exclamation-circle me-2"></i>Complete all fields</>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductForm;
