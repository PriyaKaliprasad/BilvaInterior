import React from 'react';
import ProfileDropdown from './ProfileDropdown';

const MainNavbar = ({ onSidebarOpen }) => {
    return (
        <div className="main-navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                    className="sidebar-toggle"
                    onClick={() => onSidebarOpen(true)}
                    aria-label="Open sidebar"
                    style={{ fontSize: "20px" }}
                >
                    <span>&#9776;</span> {/* Hamburger icon */}
                </button>
                <span className="navbar-title">{/* navbar title (if required) */}</span>
            </div>
            <ProfileDropdown />
        </div>
    );
};

export default MainNavbar;