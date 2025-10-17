import React, { useEffect } from 'react';

const LoginFooter = () => {
  useEffect(() => {
    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-4 bg-white">
      <div className="container">
        <div className="row align-items-center g-3">
          <div className="col-md-6 text-center text-md-start">
            <small>© <span id="year"></span> Bilva Interior. All rights reserved.</small>
          </div>
          <div className="col-md-6">
            <ul className="nav justify-content-center justify-content-md-end gap-3">
              <li className="nav-item">
                <button 
                  className="nav-link px-0 btn btn-link"
                  onClick={() => scrollToSection('features')}
                >
                  Features
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link px-0 btn btn-link"
                  onClick={() => scrollToSection('faq')}
                >
                  FAQ
                </button>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link px-0">Privacy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;