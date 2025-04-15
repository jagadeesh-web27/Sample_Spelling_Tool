import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/register.css";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const navigate = useNavigate(); // Ensure navigate is correctly imported and used

  const handleRegister = () => {
    if (password === confirmPassword) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({ username, email, password });
      localStorage.setItem("users", JSON.stringify(users));
  
      alert("Registration successful!");
      navigate("/login"); // Correctly use navigate function
    } else {
      setConfirmPasswordError(true);
      alert("Passwords do not match.");
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

    if (email === "") {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (password === "") {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (confirmPassword === "") {
      setConfirmPasswordError(true);
      valid = false;
    } else {
      setConfirmPasswordError(false);
    }

    if (valid) {
      handleRegister();
    }
  };

  const handleClearAll = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsernameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
  };

  return (
    <div className="register-container">
      <h1>New Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">
            Username <span className="required-icon">*</span>
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={usernameError ? "input-error" : ""}
            aria-invalid={usernameError}
            aria-describedby={usernameError ? "username-error" : undefined}
          />
          {usernameError && <span id="username-error" className="error-icon" role="alert">This field is mandatory</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required-icon">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={emailError ? "input-error" : ""}
            aria-invalid={emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && <span id="email-error" className="error-icon" role="alert">This field is mandatory</span>}
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
              required
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

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm Password <span className="required-icon">*</span>
          </label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={confirmPasswordError ? "input-error" : ""}
              aria-invalid={confirmPasswordError}
              aria-describedby={confirmPasswordError ? "confirmPassword-error" : undefined}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {confirmPasswordError && <span id="confirmPassword-error" className="error-icon" role="alert">This field is mandatory</span>}
        </div>

        <button type="submit" className="register-button">
          Register
        </button>
        <button type="button" className="clear-button" onClick={handleClearAll}>
          Clear All
        </button>
      </form>
    </div>
  );
};

export default Register;
