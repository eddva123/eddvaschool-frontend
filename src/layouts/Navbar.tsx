import React, { useState, useEffect } from "react";
import { Menu, Bell, Search, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

interface NavbarProps {
  onMenuToggle: () => void;
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [storedNotifications, setStoredNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem("teacher_notifications") || "[]");
      setStoredNotifications(Array.isArray(stored) ? stored : []);
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const unreadCount = storedNotifications.filter((n: any) => !n.read).length;

  // Fallback for missing user
  const displayName = user?.name || "Teacher";
  const displayRole = user?.role ? user.role.replace('_', ' ') : "Teacher";
  const initials = displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "T";

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <h1 className="navbar__title">{title}</h1>
      </div>

      <div className="navbar__right">
        <div className="navbar__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="navbar__search-input"
          />
        </div>

        <div className="navbar__notifications">
          <Link to="/notifications">
            <button
              className="navbar__icon-btn"
              onClick={() => setShowNotifications(false)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="navbar__badge">{unreadCount}</span>
              )}
            </button>
          </Link>

          {showNotifications && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-header">
                <h3>Notifications</h3>
                <span className="navbar__dropdown-count">
                  {unreadCount} new
                </span>
              </div>

              <div className="navbar__dropdown-list">
                {storedNotifications.slice(0, 4).map((n: any) => (
                  <div
                    key={n.id}
                    className={`navbar__notification ${
                      !n.read ? "navbar__notification--unread" : ""
                    }`}
                  >
                    <div
                      className={`navbar__notification-dot navbar__notification-dot--${n.type || "info"}`}
                    />

                    <div className="navbar__notification-content">
                      <p className="navbar__notification-title">{n.title}</p>
                      <p className="navbar__notification-msg">{n.message}</p>
                      <span className="navbar__notification-time">
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
                {storedNotifications.length === 0 && (
                  <div className="navbar__notification" style={{ justifyContent: 'center' }}>
                    <p className="navbar__notification-msg">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="navbar__icon-btn">
          <Settings size={20} />
        </button>

        <Link to="/profile" className="navbar__profile">
          {user?.photo ? (
            <img src={user.photo} alt={displayName} className="navbar__avatar" style={{ padding: 0, objectFit: 'cover' }} />
          ) : (
            <div className="navbar__avatar">{initials}</div>
          )}

          <div className="navbar__profile-info">
            <p className="navbar__profile-name">{displayName}</p>
            <p className="navbar__profile-role">{displayRole}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
