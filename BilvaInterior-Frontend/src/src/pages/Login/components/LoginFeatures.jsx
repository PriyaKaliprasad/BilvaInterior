import React from 'react';

const LoginFeatures = () => {
  const features = [
    {
      icon: 'bi-person-lines-fill',
      title: 'Tie‑up Enquiries',
      description: 'Capture & qualify enquiries from partner companies with SLA and source tracking.'
    },
    {
      icon: 'bi-file-earmark-text',
      title: 'Quotations',
      description: 'Create/send quotes; when accepted, auto‑convert to project and assign employees.'
    },
    {
      icon: 'bi-people',
      title: 'Team Assignment',
      description: 'Add designers/site engineers post‑acceptance with roles & permissions.'
    },
    {
      icon: 'bi-geo-alt',
      title: 'Site Visits & Sign‑off',
      description: 'Schedule visits; capture printed signed copies for end customers.'
    },
    {
      icon: 'bi-camera',
      title: 'Before/After Photos',
      description: 'Upload to Google Drive with on‑the‑fly compression to save space & bandwidth.'
    },
    {
      icon: 'bi-receipt',
      title: 'Invoices Archive',
      description: 'Generate GST invoices and store for future reference with search & filters.'
    },
    {
      icon: 'bi-images',
      title: 'Gallery',
      description: 'Curate project galleries for internal review and client sharing.'
    },
    {
      icon: 'bi-wallet2',
      title: 'Expense Tracking',
      description: 'Capture material/labour expenses, attach bills, and reconcile with BOQ.'
    },
    {
      icon: 'bi-kanban',
      title: 'Execution Boards',
      description: 'Kanban & timelines for procurement and on‑site progress.'
    }
  ];

  return (
    <section id="features" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Bilva Interior - Modules at a glance</h2>
          <p className="text-muted">Everything needed for enquiries → quotation → execution → archive.</p>
        </div>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="fi"><i className={`bi ${feature.icon}`}></i></div>
                    <h5 className="mb-0">{feature.title}</h5>
                  </div>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoginFeatures;