// ✅ src/pages/Login/components/LoginForm.jsx
import React, { useState, useEffect } from "react";
import SuccessMessage from "./SuccessMessage";
import { Link } from "react-router-dom";

const LoginForm = ({
    handleSubmit,
    setEmail,
    email,
    setPassword,
    password,
    isSubmitting,
    error,
    fieldError,
    success,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    // Caps Lock detection
    useEffect(() => {
        const handleGlobalKeyEvent = (e) => {
            setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"));
        };
        document.addEventListener("keydown", handleGlobalKeyEvent);
        document.addEventListener("keyup", handleGlobalKeyEvent);
        return () => {
            document.removeEventListener("keydown", handleGlobalKeyEvent);
            document.removeEventListener("keyup", handleGlobalKeyEvent);
        };
    }, []);

    return (
        <div className="col-12 col-md-6">
            <div className="h-100 d-flex flex-column">
                <div className="text-center text-md-start mb-3">
                    <h3 className="fw-bold mb-1">Welcome back</h3>
                    <small className="text-muted">
                        Sign in to manage your sites & clients
                    </small>
                </div>

                <SuccessMessage message={success} />

                {/* ✅ Global error */}
                {error && (
                    <div className="alert alert-danger py-2 small text-center">
                        {error}
                    </div>
                )}

                <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">
                        {/* ✅ Email */}
                        <div className="col-12">
                            <div className="form-floating">
                                <input
                                    type="email"
                                    className={`form-control ${fieldError?.email ? "is-invalid" : ""
                                        }`}
                                    id="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="email">Email address</label>
                                {fieldError?.email && (
                                    <div className="invalid-feedback">{fieldError.email}</div>
                                )}
                            </div>
                        </div>

                        {/* ✅ Password */}
                        <div className="col-12">
                            <div className="form-floating position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${fieldError?.password ? "is-invalid" : ""
                                        }`}
                                    id="password"
                                    placeholder="••••••••"
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
                                    <i
                                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                                            }`}
                                    ></i>
                                </button>
                                {fieldError?.password && (
                                    <div className="invalid-feedback">{fieldError.password}</div>
                                )}
                            </div>

                            {/* Caps Lock indicator */}
                            <div
                                className="mt-1 small d-flex align-items-center"
                                style={{ minHeight: "1.25rem" }}
                            >
                                {capsLockOn && (
                                    <>
                                        <i
                                            className="bi bi-exclamation-triangle-fill me-1"
                                            style={{ color: "#ff6b35" }}
                                        ></i>
                                        <span style={{ color: "#ff6b35" }}>Caps Lock is on</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
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
                                    "Sign in"
                                )}
                            </button>
                        </div>

                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <Link to="/forgot-password" className="small">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
