import React from 'react';
import '../Styles/ForgotPasswordPage.css'; // Ensure this is imported

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <input type="email" placeholder="Enter your email" />
      <button>Submit</button>
    </div>
  );
};

export default ForgotPasswordPage;