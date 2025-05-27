import React, { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerimage from '../assets/register.png'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        role: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [formValid, setFormValid] = useState({
        name: false,
        email: false,
        dob: false,
        role: false,
        password: false
    });

    const [isButtonActive, setIsButtonActive] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        validateForm(name, value);
    };

    const validateForm = (name, value) => {
        const newErrors = { ...errors };
        const newFormValid = { ...formValid };

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    newErrors.name = 'Name is required';
                    newFormValid.name = false;
                } else {
                    delete newErrors.name;
                    newFormValid.name = true;
                }
                break;
            case 'email':
                if (!value.match(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/)) {
                    newErrors.email = 'Enter a valid email';
                    newFormValid.email = false;
                } else {
                    delete newErrors.email;
                    newFormValid.email = true;
                }
                break;
            case 'dob':
                if (!value) {
                    newErrors.dob = 'Date of birth is required';
                    newFormValid.dob = false;
                } else {
                    delete newErrors.dob;
                    newFormValid.dob = true;
                }
                break;
            case 'role':
                if (!value) {
                    newErrors.role = 'Please select a role';
                    newFormValid.role = false;
                } else {
                    delete newErrors.role;
                    newFormValid.role = true;
                }
                break;
            case 'password':
                if (!value || value.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                    newFormValid.password = false;
                } else {
                    delete newErrors.password;
                    newFormValid.password = true;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        setFormValid(newFormValid);
        setIsButtonActive(Object.values(newFormValid).every(Boolean));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            const dataToSend = { ...formData, password: hashedPassword };

            await axios.post('http://localhost:5000/api/users/register', dataToSend);
            setSuccessMessage("User registered Successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

            // Reset form
            const resetForm = {
                name: '',
                email: '',
                dob: '',
                role: '',
                password: ''
            };
            setFormData(resetForm);
            setErrors({});
            setFormValid({
                name: false,
                email: false,
                dob: false,
                role: false,
                password: false
            });
            setIsButtonActive(false);
        } catch (error) {
            setErrorMessage("User Registration Failed!!");
            setTimeout(() => setErrorMessage(""), 3000);
            console.error(error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right,rgb(21, 2, 67),rgb(80, 99, 157))',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            {successMessage && (
                <div className="alert alert-success position-absolute top-0 mt-3">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="alert alert-danger position-absolute top-0 mt-3">{errorMessage}</div>
            )}

            <div className="row shadow-lg rounded-4 overflow-hidden" style={{
                width: '90%',
                maxWidth: '900px',
                backdropFilter: 'blur(15px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }}>
                {/* Side Image */}
                <div className="col-md-6 d-none d-md-block p-0">
                    <img
                        src={registerimage}
                        alt="side visual"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Form Section */}
                <div className="col-md-6 p-4" style={{ color: 'white' }}>
                    <h3 className="text-center mb-4">Register</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Name</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>

                        <div className="mb-3">
                            <label>Email ID</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>

                        <div className="mb-3">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} />
                            {errors.dob && <small className="text-danger">{errors.dob}</small>}
                        </div>

                        <div className="mb-3">
                            <label>Role</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="role" value="vendor" checked={formData.role === 'vendor'} onChange={handleChange} />
                                    <label className="form-check-label">Vendor</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="role" value="manager" checked={formData.role === 'manager'} onChange={handleChange} />
                                    <label className="form-check-label">Manager</label>
                                </div>
                            </div>
                            {errors.role && <small className="text-danger">{errors.role}</small>}
                        </div>

                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                            {errors.password && <small className="text-danger">{errors.password}</small>}
                        </div>

                        <button type="submit" className="btn btn-light w-100" disabled={!isButtonActive}>
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
