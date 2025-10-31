// ✅ src/pages/Login/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    LoginNavbar,
    LoginHero,
    LoginFeatures,
    LoginWorkflow,
    LoginFAQ,
    LoginFooter,
} from "./components";
import "./login.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldError, setFieldError] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, signOutMessage, setSignOutMessage } = useAuth();

    // ✅ Clear sign-out message after 5s
    useEffect(() => {
        if (signOutMessage) {
            setTimeout(() => setSignOutMessage(""), 5000);
        }
    }, [signOutMessage, setSignOutMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldError({ email: "", password: "" });

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        let localErrors = {};
        if (!trimmedEmail) localErrors.email = "Enter Email address";
        if (!trimmedPassword) localErrors.password = "Enter Password";

        if (Object.keys(localErrors).length > 0) {
            setFieldError(localErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await login({
                email: trimmedEmail,
                password: trimmedPassword,
            });

            if (!result?.success) {
                setError(result?.error || "Login failed. Please check credentials.");
            }
        } catch (err) {
            if (err.response?.data?.message)
                setError(err.response.data.message);
            else setError("Request failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            {/* ✅ Navbar with scroll buttons */}
            <LoginNavbar />

            {/* ✅ Login Form section */}
            <section id="login">
                <LoginHero
                    handleSubmit={handleSubmit}
                    setEmail={setEmail}
                    email={email}
                    setPassword={setPassword}
                    password={password}
                    isSubmitting={isSubmitting}
                    error={error}
                    fieldError={fieldError}
                    success={signOutMessage}
                />
            </section>

            {/* ✅ Features section */}
            <section id="features">
                <LoginFeatures />
            </section>

            {/* ✅ How it works section */}
            <section id="how">
                <LoginWorkflow />
            </section>

            {/* ✅ FAQ section */}
            <section id="faq">
                <LoginFAQ />
            </section>

            {/* ✅ Privacy section */}
            <section id="privacy">
                <LoginFooter />
            </section>
        </div>
    );
};

export default LoginPage;
