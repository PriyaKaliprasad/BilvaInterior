import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "@progress/kendo-react-layout";
import "./ProfileDropdown.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// user object will be set from AuthContext

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Build local user object from authUser
    const user = {
        name: authUser ? `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() : '',
        avatar: null,
        role: authUser?.role?.name || ''
    };

    const handleAccountSettings = () => {
        setOpen(false);
        navigate("/my-account");
    };

    const handleSignOut = async () => {
        setOpen(false);
        await logout();
        // No need to navigate - PrivateRoute will handle redirect to login
    };

// Close dropdown on outside click
useEffect(() => {
    const handleClick = (e) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target) &&
            !buttonRef.current.contains(e.target)
        ) {
            setOpen(false);
        }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
}, [open]);

// Helper function to get initials from user name
const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1) {
        const single = parts[0];
        if (single.length >= 2) {
            return (single[0] + single[single.length - 1]).toUpperCase();
        }
        return single[0].toUpperCase();
    }
    return "";
};

return (
    <div className="profile-dropdown-container">
        <button
            className="profile-btn"
            ref={buttonRef}
            aria-label="Profile"
            onClick={() => setOpen((v) => !v)}
        >
            <Avatar size="medium" type={user.avatar ? "image" : "text"}>
                {user.avatar ? <img src={user.avatar} alt="avatar" /> : getInitials(user.name)}
            </Avatar>
        </button>
        {open && (
            <div
                className="profile-dropdown-menu"
                ref={dropdownRef}
                style={{ zIndex: 1100 }}
            >
                <div className="profile-dropdown-header">
                    <Avatar size="large" type={user.avatar ? "image" : "text"}>
                        {user.avatar ? <img src={user.avatar} alt="avatar" /> : getInitials(user.name)}
                    </Avatar>
                    <div className="profile-dropdown-name">{user.name}</div>
                    <div style={{ color: '#888', fontSize: '0.95rem', marginTop: 2 }}>{user.role}</div>
                </div>
                <div className="profile-dropdown-list">
                    <button onClick={handleAccountSettings} className="profile-dropdown-item">Account Settings</button>
                </div>
                <div className="profile-dropdown-footer">
                    <button onClick={handleSignOut} className="profile-dropdown-item">Sign Out</button>
                </div>
            </div>
        )}
    </div>
);
};

export default ProfileDropdown;
