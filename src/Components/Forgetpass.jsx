import React, { useState } from 'react';
import Header from './Header'; // Assuming you have a header component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset any previous errors

    try {
      const response = await axios.post('http://localhost:5000/api/check-email', { email });

      if (response.data.exists) {
        navigate('/confirm-password',{ state: { email } }); // Redirect to the confirm password page if email exists
      } else {
        setError('Email not found. Please enter a valid email.');
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      setError('An error occurred while verifying the email.');
    }
  };

  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:"25rem",
        height: "100vh",
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
          <h2 style={{ marginBottom: '20px' }}>Confirm Your Email</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '70%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
            <button type="submit" style={{
              width: '70%',
              padding: '10px',
              backgroundColor: '#20c997',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
