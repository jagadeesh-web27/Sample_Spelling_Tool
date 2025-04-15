import React from 'react';
import '../Styles/NewUserRegistrationPage.css'; // Ensure this is imported

const NewUserRegistrationPage: React.FC = () => {
  return (
    <div className="registration-container">
      <h2>New User Registration</h2>
      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Register</button>
    </div>
  );
};

export default NewUserRegistrationPage;