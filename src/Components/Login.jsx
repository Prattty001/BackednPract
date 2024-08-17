import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        password: formData.password
      });
  
      const { token, userId, userName } = response.data;
  
      // Save token and user details in session storage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('userName', userName);
  
      setSuccess("Login successful!");
      // Optionally, redirect to the dashboard or home page
      window.location.href = '/getuser'; // Adjust the path as needed
  
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  

  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: "25rem",
        height: "15rem",
        backgroundColor: '#ffffff',
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '400px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" style={{ marginRight: '5px' }} /> Remember me
              </label>
              <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#007bff' }}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#20c997',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </form>
          <div style={{ marginTop: '20px' }}>
            <span>Don't have an account?</span>
            <Link to="/signup" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '5px' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
