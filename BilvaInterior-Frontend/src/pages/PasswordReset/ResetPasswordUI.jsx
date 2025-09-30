import React, { useState } from 'react';
import './resetPassword.css';

const ResetPasswordUI = ({
  email,
  newPassword,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  loading,
  error,
  success,
  invalidLink
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="login-page-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <span className="text-primary">Bilva</span>
            <span className="ms-1">Interiors</span>
            <span className="badge badge-beta text-white small ms-2 px-2 py-1">Reset</span>
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
                  <h2 className="fw-bold text-primary mb-2">Reset Password</h2>
                  {!invalidLink ? (
                    <p className="text-muted mb-0">
                      Enter your new password for <strong>{email}</strong>
                    </p>
                  ) : (
                    <p className="text-muted mb-0">
                      Invalid reset password link
                    </p>
                  )}
                </div>

                {/* Success Message */}
                {success && (
                  <div className="text-center">
                    <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <div>
                        <strong>Password Reset Successful!</strong><br />
                        Your password has been reset successfully. You can now log in with your new password.
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && !invalidLink && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                {!success && !invalidLink && (
                  <form onSubmit={onSubmit} noValidate>
                    {/* New Password Field */}
                    <div className="form-floating mb-3 position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control pe-5"
                        id="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={onPasswordChange}
                        required
                        minLength="6"
                        disabled={loading}
                      />
                      <label htmlFor="newPassword">New Password</label>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-floating mb-4 position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control pe-5"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={onConfirmPasswordChange}
                        required
                        minLength="6"
                        disabled={loading}
                      />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={toggleConfirmPasswordVisibility}
                        disabled={loading}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="small text-muted mb-4">
                      <p className="mb-2">Password requirements:</p>
                      <ul className="ps-3 mb-0">
                        <li className={newPassword.length >= 6 ? 'text-success' : ''}>
                          At least 6 characters
                        </li>
                        <li className={newPassword === confirmPassword && newPassword ? 'text-success' : ''}>
                          Passwords must match
                        </li>
                      </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-brand w-100 py-3 fw-semibold"
                      disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || invalidLink}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Resetting Password...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </form>
                )}

                {/* Invalid Link Message */}
                {invalidLink && (
                  <div className="text-center">
                    <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>
                        <strong>Invalid Reset Link</strong><br />
                        This password reset link is invalid or has expired. Please request a new password reset from the login page.
                      </div>
                    </div>
                  </div>
                )}

                {/* Back to Login */}
                <div className="text-center mt-4">
                  <a href="/login" className="text-decoration-none">
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Login
                  </a>
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

export default ResetPasswordUI;