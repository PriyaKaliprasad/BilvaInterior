import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { 
  LoginNavbar, 
  LoginHero, 
  LoginFeatures, 
  LoginWorkflow, 
  LoginFAQ, 
  LoginFooter 
} from './components';
import './login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const result = await login({ email, password });
    
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
      />
      
      <LoginFeatures />
      
      <LoginWorkflow />
      
      <LoginFAQ />
      
      <LoginFooter />
    </div>
  )
}

export default LoginPage