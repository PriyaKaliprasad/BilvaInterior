import React from 'react';
import LoginImage from './LoginImage';
import LoginForm from './LoginForm';

const LoginHero = ({ 
  handleSubmit, 
  setEmail, 
  email, 
  setPassword, 
  password, 
  isSubmitting, 
  error,
  success 
}) => {
  return (
    <section className="hero">
      <div className="container hero-split d-flex align-items-center justify-content-center">
        <div className="row g-4 align-items-center w-100">
          
          {/* Mobile/Tablet: Heading first, Desktop: Combined with content */}
          <div className="col-12 d-lg-none text-center mb-3">
            <h1 className="fw-bold lh-tight fs-3">
              Bilva Interior - <span className="text-primary">End-to-End Project Control</span>
            </h1>
          </div>

          {/* Login Card */}
          <div className="col-12 col-lg-6 order-1 order-lg-2" id="login"
           style={{
              
                margin: '0px',
                padding: '0px',
              }}>
            <div 
              className="card login-card p-4 shadow-lg border-0 mx-auto"
              style={{
                maxWidth: '480px',
                width: '95%',
                margin: '0px',
                borderRadius: '16px',
                transform: 'scale(1.05)',
              }}
            >
              <div className="row g-0">
                <LoginImage />
                <LoginForm 
                  handleSubmit={handleSubmit}
                  setEmail={setEmail}
                  email={email}
                  setPassword={setPassword}
                  password={password}
                  isSubmitting={isSubmitting}
                  error={error}
                  success={success}
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="col-12 col-lg-6 order-2 order-lg-1 mt-4 mt-lg-0">
            <div className="pe-lg-4">
              {/* Desktop heading */}
              <div className="d-none d-lg-block mb-3">
                <h1 className="display-5 fw-bold lh-tight">
                  Bilva Interior - <span className="text-primary">End-to-End Project Control</span>
                </h1>
              </div>

              {/* Features Grid */}
              <div className="row g-3 mt-2">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <i className="bi bi-kanban fs-4"></i>
                    <div>
                      <h6 className="mb-1">Boards & Timelines</h6>
                      <small className="text-muted">Track design → procurement → execution.</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <i className="bi bi-cash-coin fs-4"></i>
                    <div>
                      <h6 className="mb-1">BOQ & Budgets</h6>
                      <small className="text-muted">Estimate, split into phases, track costs.</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <i className="bi bi-images fs-4"></i>
                    <div>
                      <h6 className="mb-1">Site Photos</h6>
                      <small className="text-muted">Progress albums with approvals.</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <i className="bi bi-people fs-4"></i>
                    <div>
                      <h6 className="mb-1">Clients & Vendors</h6>
                      <small className="text-muted">Share portals, POs, and invoices.</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature badges */}
              <ul className="list-unstyled d-flex flex-wrap gap-3 mt-4 mb-0 check">
                <li><i className="bi bi-check-circle me-1"></i>Mobile-first</li>
                <li><i className="bi bi-check-circle me-1"></i>Multi-team</li>
                <li><i className="bi bi-check-circle me-1"></i>Secure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginHero;
