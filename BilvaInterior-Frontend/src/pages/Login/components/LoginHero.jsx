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
          <div className="col-12 d-lg-none">
            <div className="text-center">
              <h1 className="display-5 fw-bold lh-tight mb-3">
                Bilva Interior Pvt Ltd — <span className="text-primary">End‑to‑end project control</span>
              </h1>
            </div>
          </div>

          {/* Login Card - Second on mobile/tablet, right on desktop */}
          <div className="col-12 col-lg-6 order-1 order-lg-2" id="login">
            <div className="card login-card p-3 p-md-4">
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

          {/* Content - Third on mobile/tablet, left on desktop with heading */}
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <div className="pe-lg-4">
              {/* Desktop: Heading and description together */}
              <div className="d-none d-lg-block">
                <h1 className="display-5 fw-bold lh-tight mb-3">
                  Bilva Interior Pvt Ltd — <span className="text-primary">End‑to‑end project control</span>
                </h1>
              </div>

              {/* Mobile/Tablet: Description after login form */}
              
              <div className="row g-3 mt-3">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fi"><i className="bi bi-kanban fs-4"></i></div>
                    <div>
                      <h6 className="mb-1">Boards & Timelines</h6>
                      <small className="text-muted">Track design → procurement → execution.</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fi"><i className="bi bi-cash-coin fs-4"></i></div>
                    <div>
                      <h6 className="mb-1">BOQ & Budgets</h6>
                      <small className="text-muted">Estimate, split into phases, track costs.</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fi"><i className="bi bi-images fs-4"></i></div>
                    <div>
                      <h6 className="mb-1">Site Photos</h6>
                      <small className="text-muted">Progress albums with approvals.</small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fi"><i className="bi bi-people fs-4"></i></div>
                    <div>
                      <h6 className="mb-1">Clients & Vendors</h6>
                      <small className="text-muted">Share portals, POs, and invoices.</small>
                    </div>
                  </div>
                </div>
              </div>

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