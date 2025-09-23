import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="bi bi-exclamation-triangle me-2"></i>
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;