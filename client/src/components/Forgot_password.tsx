import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/forgot.css"

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const sendOtp = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]"); // Retrieve stored users
    const userExists = users.some((user: { email: string }) => user.email === email);

    if (userExists) {
      localStorage.setItem("otp", "123456"); // Mock OTP
      alert("OTP sent to your email.");
      setIsOtpSent(true);
    } else {
      alert("Email not registered.");
    }
  };

  const verifyOtp = () => {
    const storedOtp = localStorage.getItem("otp");
    if (otp === storedOtp) {
      alert("OTP verified.");
      setIsOtpVerified(true);
    } else {
      alert("Invalid OTP.");
    }
  };

  const changePassword = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]"); // Retrieve stored users
    const updatedUsers = users.map((user: { email: string; password: string }) => {
      if (user.email === email) {
        // Update the password for the matching email
        return { ...user, password: newPassword };
      }
      return user; // Return user without changes if the email does not match
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save updated users
    alert("Password changed successfully.");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      {!isOtpSent && (
        <>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        </>
      )}
      {isOtpSent && !isOtpVerified && (
        <>
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="button" onClick={verifyOtp}>
            Verify OTP
          </button>
        </>
      )}
      {isOtpVerified && (
        <>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="button" onClick={changePassword}>
            Change Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;