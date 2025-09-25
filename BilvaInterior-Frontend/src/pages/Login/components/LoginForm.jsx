import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage';

const LoginForm = ({
    handleSubmit,
    setEmail,
    email,
    setPassword,
    password,
    isSubmitting,
    error
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (handleSubmit) {
            handleSubmit(e);
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="col-12 col-md-6">
            <div className="h-100 d-flex flex-column">
                <div className="text-center text-md-start mb-3">
                    <h3 className="fw-bold mb-1">Welcome back</h3>
                    <small className="text-muted">Sign in to manage your sites & clients</small>
                </div>

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
                                    required
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="email">Email address</label>
                                <div className="invalid-feedback">Please enter a valid email.</div>
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
                                <div className="invalid-feedback">Password must be at least 6 characters.</div>
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
                            <a href="#" className="small">Forgot password?</a>
                        </div>


                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;