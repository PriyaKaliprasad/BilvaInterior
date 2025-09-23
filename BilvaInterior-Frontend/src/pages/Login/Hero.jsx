import React from "react";
import LoginForm from "./LoginForm";

function Hero() {
  return (
    <section className="hero py-5">
      <div className="container hero-split">
        <div className="row g-4 align-items-center">
          {/* Left copy */}
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <h1 className="display-5 fw-bold lh-tight mb-3">
              Bilva Interior Pvt Ltd —{" "}
              <span className="text-primary">End-to-end project control</span>
            </h1>
            <p className="lead text-secondary">
              From enquiry to handover: capture tie-up leads, send quotations,
              assign employees after acceptance, conduct site visits with printed
              signatures, upload before/after photos to Google Drive (compressed),
              generate invoices, and track expenses through execution.
            </p>
          </div>

          {/* Right: Login + Image */}
          <div className="col-12 col-lg-6 order-1 order-lg-2" id="login">
            <div className="card login-card p-3 p-md-4">
              <div className="row g-0">
                {/* Image column (always visible now) */}
                <div className="col-md-6 pe-md-3 d-none d-md-block">
                  <div
                    id="heroCarousel"
                    className="carousel slide rounded overflow-hidden h-100"
                  >
                    <div className="carousel-inner h-100">
                      <div className="carousel-item active h-100">
                        <img
                          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
                          className="d-block w-100 h-100 object-fit-cover"
                          alt="Modern living room"
                        />
                      </div>
                      <div className="carousel-item h-100">
                        <img
                          src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop"
                          className="d-block w-100 h-100 object-fit-cover"
                          alt="Interior moodboard"
                        />
                      </div>
                      <div className="carousel-item h-100">
                        <img
                          src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop"
                          className="d-block w-100 h-100 object-fit-cover"
                          alt="Workspace"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form column */}
                <div className="col-12 col-md-6">
                  <div className="h-100 d-flex flex-column">
                    <div className="text-center text-md-start mb-3">
                      <h3 className="fw-bold mb-1">Welcome back</h3>
                      <small className="text-muted">
                        Sign in to manage your sites & clients
                      </small>
                    </div>
                    <LoginForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
