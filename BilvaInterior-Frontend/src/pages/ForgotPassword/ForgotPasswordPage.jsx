import React, { useState } from 'react';
import { usePost } from '../../hooks/usePost';
import { Link } from 'react-router-dom';
import '../PasswordReset/resetPassword.css';

const ForgotPasswordPage = () => {
  const { mutate: sendForgotPassword, loading, error } = usePost('/api/password/forgot-password');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    try {
      await sendForgotPassword({ email: email });
      setSuccess(true);
    } catch (err) {
      // Extract error message if available
      if (err.response?.data?.error) {
        setValidationError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setValidationError(err.response.data.message);
      } else {
        setValidationError('Failed to send reset link. Please try again.');
      }
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <span className="text-primary">Bilva</span>
            <span className="ms-1">Interior</span>
            <span className="badge badge-beta text-white small ms-2 px-2 py-1">Beta</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card login-card border-0 rounded-4 p-4 p-lg-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Forgot Password</h2>
                  <p className="text-muted mb-0">
                    Enter your email address and we'll send you a password reset link
                  </p>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>
                      <strong>Reset link sent!</strong><br />
                      If the email exists, a password reset link has been sent to your email address.
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {(validationError || error) && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{validationError || error}</div>
                  </div>
                )}

                {!success && (
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Email Field */}
                    <div className="form-floating mb-4">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        disabled={loading}
                      />
                      <label htmlFor="email">Email address</label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-brand w-100 py-3 fw-semibold"
                      disabled={loading || !email || !/^\S+@\S+\.\S+$/.test(email)}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending Reset Link...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </form>
                )}

                {/* Back to Login - Always visible */}
                <div className="text-center mt-4">
                  <Link to="/login" className="text-decoration-none">
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-muted">
                © 2024 Bilva Interiors. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-3">
                <a href="#" className="text-muted">Privacy Policy</a>
                <a href="#" className="text-muted">Terms of Service</a>
                <a href="#" className="text-muted">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
