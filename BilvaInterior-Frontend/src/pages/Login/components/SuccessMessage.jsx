import React from 'react';

const SuccessMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="alert alert-success d-flex align-items-center" role="alert">
      <i className="bi bi-check-circle me-2"></i>
      <span>{message}</span>
    </div>
  );
};

export default SuccessMessage;