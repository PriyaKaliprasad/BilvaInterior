import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePost } from '../../hooks/usePost';
import ResetPasswordUI from './ResetPasswordUI';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const { mutate: resetPassword, loading, error } = usePost('/api/password/reset-password');
  const [backendError, setBackendError] = useState('');

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Get email and token from URL params
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  // Check for missing required params
  const [invalidLink, setInvalidLink] = useState(false);
  
  useEffect(() => {
    if (!email || !token) {
      setInvalidLink(true);
    }
  }, [email, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setBackendError('');

    // Don't submit if link is invalid
    if (invalidLink) {
      setValidationError('Cannot reset password with invalid link');
      return;
    }

    // Client-side validation
    if (newPassword.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      const resetData = {
        Email: email,
        Token: token,
        NewPassword: newPassword
      };

      await resetPassword(resetData);
      setSuccess(true);

    } catch (err) {
      console.error('Reset password error:', err);
      
      // Extract specific error message from backend response
      if (err.response?.data?.error) {
        setBackendError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setBackendError(err.response.data.message);
      } else {
        // Fallback to generic error if no specific message
        setBackendError('Failed to reset password. Please try again.');
      }
    }
  };

  // Handle input changes
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setValidationError('');
    setBackendError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setValidationError('');
    setBackendError('');
  };

  return (
    <ResetPasswordUI
      email={email || 'Unknown'}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={backendError || validationError}
      success={success}
      invalidLink={invalidLink}
    />
  );
};

export default ResetPasswordPage;