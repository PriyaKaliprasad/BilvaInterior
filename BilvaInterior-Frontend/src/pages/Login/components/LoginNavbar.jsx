import React from 'react';

const LoginNavbar = () => {
  const scrollToSection = (sectionId) => {
    const byId = document.getElementById(sectionId);
    if (byId) {
      byId.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const byQuery = document.querySelector(`#${sectionId}, [data-section="${sectionId}"], a[href="#${sectionId}"]`);
    if (byQuery) {
      byQuery.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <i className="bi bi-bricks fs-3 text-primary"></i>
          <span>Bilva<span className="text-primary">Interior</span></span>
          {/* <span className="badge badge-beta ms-2">Beta</span> */}
        </a>
        <button 
          className="navbar-toggler d-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
     >
    <span className="navbar-toggler-icon"></span>
      </button>

        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link" 
                onClick={() => scrollToSection('features')}
              >
                Features
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link" 
                onClick={() => scrollToSection('how')}
              >
                How it works
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link" 
                onClick={() => scrollToSection('faq')}
              >
                FAQ
              </button>
            </li>
            <li className="nav-item ms-lg-3">
              <button 
                className="btn btn-outline-primary" 
                onClick={() => scrollToSection('login')}
              >
                Sign in
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LoginNavbar;
