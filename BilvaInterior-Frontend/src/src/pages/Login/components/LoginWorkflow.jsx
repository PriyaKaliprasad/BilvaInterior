import React from 'react';

const LoginWorkflow = () => {
  const scrollToLogin = () => {
    const element = document.getElementById('login');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="how" className="py-5 bg-white border-top border-bottom">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-6">
            <h3 className="fw-bold mb-3">Bilva Interior - Typical Workflow</h3>
            <ol className="text-muted fs-6">
              <li className="mb-2">
                <strong>Enquiry intake</strong> from tie‑up company (auto‑tag source + SLA).
              </li>
              <li className="mb-2">
                <strong>Quotation</strong> prepared and sent; upon <em>Accepted</em>, a project is created and employees are assigned.
              </li>
              <li className="mb-2">
                <strong>Site visit</strong> scheduled; printed signed copy handed to end customer and stored in project files.
              </li>
              <li className="mb-2">
                <strong>Photos</strong> (before/after) captured; images are compressed client‑side and uploaded to Google Drive.
              </li>
              <li className="mb-2">
                <strong>Execution</strong> tracked via boards and task checklists.
              </li>
              <li className="mb-2">
                <strong>Invoice</strong> generated (GST) and archived for audit.
              </li>
              <li className="mb-2">
                <strong>Gallery & Expenses</strong> maintained for reporting and client showcase.
              </li>
            </ol>
            {/* <button 
              onClick={scrollToLogin}
              className="btn btn-brand"
            >
              Start with an enquiry →
            </button> */}
          </div>
          <div className="col-12 col-lg-6">
            <img 
              className="img-fluid rounded shadow-sm" 
              alt="Bilva Interior workflow" 
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginWorkflow;