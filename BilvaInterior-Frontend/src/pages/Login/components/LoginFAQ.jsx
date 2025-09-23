import React, { useEffect } from 'react';

const LoginFAQ = () => {
  useEffect(() => {
    // Initialize Bootstrap accordion if needed
    const accordionItems = document.querySelectorAll('[data-bs-toggle="collapse"]');
    if (accordionItems.length > 0 && window.bootstrap) {
      // Bootstrap accordion works automatically with data attributes
    }
  }, []);

  return (
    <section id="faq" className="py-5">
      <div className="container">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Frequently asked</h3>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="accordion" id="faqAcc">
              <div className="accordion-item">
                <h2 className="accordion-header" id="q1">
                  <button 
                    className="accordion-button" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#a1"
                    aria-expanded="true"
                    aria-controls="a1"
                  >
                    Is there a mobile app?
                  </button>
                </h2>
                <div 
                  id="a1" 
                  className="accordion-collapse collapse show" 
                  aria-labelledby="q1"
                  data-bs-parent="#faqAcc"
                >
                  <div className="accordion-body">
                    The UI is mobile-first and works in any modern browser. Native apps are coming soon.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="q2">
                  <button 
                    className="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#a2"
                    aria-expanded="false"
                    aria-controls="a2"
                  >
                    Can I invite clients?
                  </button>
                </h2>
                <div 
                  id="a2" 
                  className="accordion-collapse collapse" 
                  aria-labelledby="q2"
                  data-bs-parent="#faqAcc"
                >
                  <div className="accordion-body">
                    Yes, invite clients with view/approve-only access to budgets, drawings, and timelines.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="q3">
                  <button 
                    className="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#a3"
                    aria-expanded="false"
                    aria-controls="a3"
                  >
                    Do you support GST invoices?
                  </button>
                </h2>
                <div 
                  id="a3" 
                  className="accordion-collapse collapse" 
                  aria-labelledby="q3"
                  data-bs-parent="#faqAcc"
                >
                  <div className="accordion-body">
                    Yes, you can generate GST-compliant estimates and invoices with your logo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginFAQ;