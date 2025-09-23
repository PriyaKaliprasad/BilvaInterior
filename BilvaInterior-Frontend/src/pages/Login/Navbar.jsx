import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <i className="bi bi-bricks fs-3 text-primary"></i>
          <span>
            Bilva<span className="text-primary">Interior</span>
          </span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <a className="nav-link" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#how">How it works</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#faq">FAQ</a>
            </li>
            <li className="nav-item ms-lg-3">
              <a className="btn btn-outline-primary" href="#login">Sign in</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
