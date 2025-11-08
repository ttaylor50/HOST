import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isExpert = location.state?.isExpert ?? false;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    location: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          expert: isExpert,
        }),
      });

      if (response.ok) {
        // Registration successful
        navigate('/login');
      } else {
        // Handle registration error
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Sign Up as {isExpert ? 'Professional' : 'User'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <button type="submit" className={`register-button ${isExpert ? 'professional' : ''}`}>
            Create Account
          </button>
        </form>
        <button 
          className="back-button"
          onClick={() => navigate('/signup')}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Register;