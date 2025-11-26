import React, { useState, useEffect } from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import { Link } from 'react-router-dom';

const LoginForm = ({
    handleSubmit,
    setEmail,
    email,
    setPassword,
    password,
    isSubmitting,
    error,
    success
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);

    // ✅ new states to track if user has interacted
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setEmailTouched(true);     // show validation if left empty
        setPasswordTouched(true);
        if (handleSubmit) {
            handleSubmit(e);
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Check caps lock status
    const checkCapsLock = (event) => {
        const capsLock = event.getModifierState && event.getModifierState('CapsLock');
        setCapsLockOn(capsLock);
    };

    // Global caps lock detection
    useEffect(() => {
        const handleGlobalKeyEvent = (event) => {
            checkCapsLock(event);
        };

        // Add global event listeners
        document.addEventListener('keydown', handleGlobalKeyEvent);
        document.addEventListener('keyup', handleGlobalKeyEvent);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyEvent);
            document.removeEventListener('keyup', handleGlobalKeyEvent);
        };
    }, []);

    return (
        <div className="col-12 col-md-6">
            <div className="h-100 d-flex flex-column">
                <div className="text-center text-md-start mb-3">
                    <h3 className="fw-bold mb-1">Welcome back</h3>
                    <small className="text-muted">Sign in to manage your sites & clients</small>
                </div>
                {/* Success message above error */}
                <SuccessMessage message={success} />
                <ErrorMessage error={error} />
                <form className="needs-validation" onSubmit={onSubmit} noValidate>
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setEmailTouched(true)}   // ✅ only mark touched after user leaves field
                                    required
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="email">Email address</label>
                                {/* ✅ show validation only if user interacted */}
                                {emailTouched && !email.trim() && (
                                    <div className="invalid-feedback d-block">Enter Email address</div>
                                )}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    placeholder="••••••••"
                                    minLength="6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setPasswordTouched(true)}   // ✅ only mark touched after leaving
                                    required
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePassword}
                                    aria-label="Show password"
                                    disabled={isSubmitting}
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                                {/* ✅ show validation only after user touched */}
                                {passwordTouched && !password.trim() && (
                                    <div className="invalid-feedback d-block">Enter Password</div>
                                )}
                            </div>
                             {/* Caps Lock Warning - Always reserve space */}
                            <div className="mt-1 small d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                {capsLockOn && (
                                    <>
                                        <i className="bi bi-exclamation-triangle-fill me-1" style={{ color: '#ff6b35' }}></i>
                                        <span style={{ color: '#ff6b35' }}>Caps Lock is on</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-12 d-grid">
                            <button
                                className="btn btn-brand py-2"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <Link to="/forgot-password" className="small">Forgot password?</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
