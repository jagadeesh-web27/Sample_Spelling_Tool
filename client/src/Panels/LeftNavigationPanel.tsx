import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import './LeftNavigationPanel.css'; // Ensure this is imported

const LeftNavigationPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomeActive = location.pathname === "/" || location.pathname.startsWith("/words") || location.pathname.startsWith("/sentences") || location.pathname.startsWith("/articles") || location.pathname.startsWith("/tenses");
  
  const handleLogout = () => {
    // Clear authentication status
    localStorage.removeItem("auth");

    // Redirect to login page
    navigate("/login");
    window.location.reload(); // Ensure the app reloads to reflect the logged-out state
  };

  return (
    <nav className="left-navigation-panel" aria-label="Left Navigation Panel">
      <section aria-labelledby="First heading controls">
        <h1 id="controls-heading">Controls</h1>
        <ul>
          <li>
          <NavLink
  to="/" 
  className={isHomeActive ? "active" : ""}
>
  Home
</NavLink>

          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label="Settings"
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "nav-button active" : "nav-button")}
              aria-label="Log out"
              onClick={() => {
                // Clear authentication status
                localStorage.removeItem("auth");

                // Reload to reflect the logged-out state
                window.location.reload();
              }}
            >
              Logout
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/recommended"
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label="Recommended Courses"
            >
              Recommended
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/manage-accounts"
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label="Manage your Accounts"
            >
              Manage Accounts
            </NavLink>
          </li>
        </ul>
      </section>

      <section aria-labelledby="Second heading followups">
        <h1 id="followups-heading">Followups</h1>
        <ul>
          <li>
            <NavLink
              to="/readnews"
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label="Read News"
            >
              Read News
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/badges"
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label="Badges for your test"
            >
              Badges
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/TodoList"
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label="Todo List"
            >
              Todo List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/totalScore"
              className={({ isActive }) => (isActive ? "active" : "")}
              aria-label="Total Score"
            >
              Total Score
            </NavLink>
          </li>
        </ul>
      </section>
    </nav>
  );
};

export default LeftNavigationPanel;