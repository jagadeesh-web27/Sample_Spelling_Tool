import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Interface for user objects
interface User {
  username: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]"); // Retrieve stored users
    const userExists = users.some(
      (user: User) => user.username === username && user.password === password // Explicitly typed
    );

    if (userExists) {
      localStorage.setItem("auth", "true"); // Mock authentication
      navigate("/"); // Redirect to home
      window.location.reload();
    } else {
      setError("Invalid username or password");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (username === "") {
      setUsernameError(true);
      valid = false;
    } else {
      setUsernameError(false);
    }

    if (password === "") {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (valid) {
      handleLogin();
    }
  };

  return (
    <div className="login-container" role="main" aria-labelledby="login-heading">
      <h1 id="login-heading">Login</h1>
      {error && <p className="error-message" role="alert">{error}</p>}

      <form onSubmit={handleSubmit} aria-describedby="login-instructions">
        <p id="login-instructions" className="login-instructions">
          Please enter your username and password to log in. Use the "New Registration" link if you are a new user.
        </p>

        <div className="form-group">
          <label htmlFor="username">
            Username <span className="required-icon">*</span>
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            aria-required="true"
            className={usernameError ? "input-error" : ""}
            aria-invalid={usernameError}
            aria-describedby={usernameError ? "username-error" : undefined}
          />
          {usernameError && <span id="username-error" className="error-icon" role="alert">This field is mandatory</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required-icon">*</span>
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              aria-required="true"
              className={passwordError ? "input-error" : ""}
              aria-invalid={passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {passwordError && <span id="password-error" className="error-icon" role="alert">This field is mandatory</span>}
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <div className="links-container">
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="link"
          aria-label="Register as a new user"
        >
          New Registration
        </button>
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="link"
          aria-label="Reset your password"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;
