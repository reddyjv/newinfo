import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css'; // Scoped CSS
import homeimage from '../assets/Home image.png'
import { useNavigate } from 'react-router';

const HomePage = () => {
    const navigate=useNavigate()
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold fs-4">AutoInvoicePro</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="ms-auto d-flex gap-2">
              <button onClick={()=>navigate('/login')} className="btn btn-outline-light fw-medium">Login</button>
              <button onClick={()=>navigate('/register')}className="btn btn-light text-primary fw-medium">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section (Image Left + Content Right) */}
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src={homeimage} 
                alt="Invoice Automation" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold mb-3">Automate Your Invoicing</h1>
              <p className="lead text-muted mb-4">
                Save time and reduce errors with our AI-powered invoice billing system. 
                Generate, track, and send invoices seamlessly.
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-primary px-4 py-2 fw-medium">Get Started</button>
                <button className="btn btn-outline-primary px-4 py-2 fw-medium">Demo</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 text-primary">Why Choose Us?</h2>
          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-effect">
                <div className="card-body p-4 text-center">
                  <div className="icon-wrapper bg-primary-light mb-3">
                    <i className="bi bi-lightning-fill text-primary fs-3"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Instant Invoicing</h5>
                  <p className="text-muted">
                    Generate invoices in seconds with automated templates.
                  </p>
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-effect">
                <div className="card-body p-4 text-center">
                  <div className="icon-wrapper bg-primary-light mb-3">
                    <i className="bi bi-bar-chart-fill text-primary fs-3"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Real-Time Analytics</h5>
                  <p className="text-muted">
                    Track payments and revenue with live dashboards.
                  </p>
                </div>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-effect">
                <div className="card-body p-4 text-center">
                  <div className="icon-wrapper bg-primary-light mb-3">
                    <i className="bi bi-shield-lock-fill text-primary fs-3"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Bank-Grade Security</h5>
                  <p className="text-muted">
                    Your data is encrypted and secure at all times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-3">Ready to Transform Your Billing?</h2>
          <p className="mb-4 opacity-75">Join 10,000+ businesses automating their invoices.</p>
          <button className="btn btn-light text-primary px-4 py-2 fw-medium">Start Free Trial</button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h2 className="text-center fw-bold mb-4">Contact Us</h2>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input type="text" className="form-control py-2" placeholder="Your Name" />
                      </div>
                      <div className="col-md-6">
                        <input type="email" className="form-control py-2" placeholder="Your Email" />
                      </div>
                      <div className="col-12">
                        <textarea className="form-control py-2" rows="4" placeholder="Your Message"></textarea>
                      </div>
                      <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary px-4 py-2 fw-medium">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} AutoInvoicePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
