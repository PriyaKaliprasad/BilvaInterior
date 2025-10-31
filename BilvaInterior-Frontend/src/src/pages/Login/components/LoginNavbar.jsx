import React from "react";
import "../login.css"; // fixed path ✅

const LoginNavbar = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center gap-2" href="#">
                    <i className="bi bi-bricks fs-3 text-primary"></i>
                    <span>
                        Bilva<span className="text-primary">Interior</span>
                    </span>
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#nav"
                    aria-controls="nav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="nav" className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => scrollToSection("features")}>
                                Features
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => scrollToSection("how")}>
                                How it works
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => scrollToSection("faq")}>
                                FAQ
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => scrollToSection("privacy")}>
                                Privacy
                            </button>
                        </li>
                        <li className="nav-item ms-lg-3">
                            <button className="btn btn-outline-primary" onClick={() => scrollToSection("login")}>
                                Sign in
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default LoginNavbar;
