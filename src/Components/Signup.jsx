import React, { useState } from 'react';
import Header from './Header'; // Assuming you have a header component
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "",
    mobileNumber: "",
    gender: "",
    password: "",
    confirmPassword: "",
    countryName: "",
    stateName: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setFormData({ ...formData, countryName: country });

    switch (country) {
      case 'United States':
        setStates(["California", "Texas", "New York"]);
        break;
      case 'India':
        setStates(["Maharashtra", "Delhi", "Karnataka"]);
        break;
      case 'Canada':
        setStates(["Ontario", "Quebec", "British Columbia"]);
        break;
      default:
        setStates([]);
        break;
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {


      const response = await axios.post('http://localhost:5000/api/signup', {
        name: formData.name,
        email: formData.email,
        countryCode : formData.countryCode,
        mobileNumber:formData.mobileNumber,
        gender: formData.gender,
        password: formData.password,
        countryName: formData.countryName,
        stateName: formData.stateName
      });

      setSuccess("User registered successfully.");
      // Navigate to the login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 1000); // Optional delay for the success message
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
        marginTop: "6rem",
        paddingBottom: "2rem",
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
          <h2 style={{ marginBottom: '20px' }}>Sign Up</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
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
            <div style={{ display: 'flex', marginBottom: '20px' }}>
            <select
  name="countryCode"
  required
  value={formData.countryCode}
  onChange={handleChange}
  style={{
    width: '68%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '0 4px 4px 0',
    border: '1px solid #ccc',
  }}
>
  <option value="" disabled>Select country code</option>
  <option value="+1">+1 (United States)</option>
  <option value="+91">+91 (India)</option>
  <option value="+1">+1 (Canada)</option>
</select>

              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                style={{
                  width: '70%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '0 4px 4px 0',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <select
                name="countryName"
                required
                onChange={handleCountryChange}
                value={formData.countryName}
                style={{
                  width: '48%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="" disabled>Select a country</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="Canada">Canada</option>
              </select>
              <select
                name="stateName"
                required
                value={formData.stateName}
                onChange={handleChange}
                style={{
                  width: '48%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="" disabled>Select a state</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
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
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" required style={{ marginRight: '5px' }} />
                I agree to the terms and conditions
              </label>
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
              Sign Up
            </button>
          </form>
          <div style={{ marginTop: '20px' }}>
            <span>Already have an account?</span>
            <Link to="/login" style={{ textDecoration: 'none', color: '#007bff', marginLeft: '5px' }}>Log in</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
