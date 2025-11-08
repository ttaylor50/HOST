import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = (isExpert) => {
    navigate('/register', { state: { isExpert } });
  };

  return (
    <div className="signup-container">
      <div className="signup-half user-half" onClick={() => handleUserTypeSelection(false)}>
        <div className="content">
          <h2>Regular User</h2>
          <p>Sign up as a regular user to access our services</p>
          <button className="signup-btn user-btn">Sign Up as User</button>
        </div>
      </div>
      <div className="signup-half professional-half" onClick={() => handleUserTypeSelection(true)}>
        <div className="content">
          <h2>Professional</h2>
          <p>Sign up as a healthcare professional</p>
          <button className="signup-btn professional-btn">Sign Up as Professional</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;