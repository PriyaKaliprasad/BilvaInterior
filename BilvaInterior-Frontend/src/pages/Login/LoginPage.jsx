import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import { 
  LoginNavbar, 
  LoginHero, 
  LoginFeatures, 
  LoginWorkflow, 
  LoginFAQ, 
  LoginFooter 
} from './components';
import SuccessMessage from './components/SuccessMessage';
import './login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signOutMessage, setSignOutMessage } = useAuth();
  // Show message and clear it after first render
  useEffect(() => {
    if (signOutMessage) {
      setTimeout(() => {
        setSignOutMessage('');
      }, 5000); // auto-clear after 5s
    }
  }, [signOutMessage, setSignOutMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let ip = '';
    let iana = '';
    try {
      // Get public IP
      const ipRes = await fetch('https://api.ipify.org?format=json');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        ip = ipData.ip;
      }
    } catch (err) {
      // ignore IP fetch error
    }
    try {
      iana = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (err) {
      iana = '';
    }

    const result = await login({ email, password, ip, iana });

    if (!result.success) {
      setError(result.error);
    }
    // No manual navigation needed - PublicRoute will handle redirect automatically

    setIsSubmitting(false);
  };

  return (
    <div className="login-page-wrapper">
      <LoginNavbar />
      <LoginHero 
        handleSubmit={handleSubmit}
        setEmail={setEmail}
        email={email}
        setPassword={setPassword}
        password={password}
        isSubmitting={isSubmitting}
        error={error}
        success={signOutMessage}
      />
      <LoginFeatures />
      <LoginWorkflow />
      {/* <LoginFAQ /> */}
      <LoginFooter />
    </div>
  )
}

export default LoginPage