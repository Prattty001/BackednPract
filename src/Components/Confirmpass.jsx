import React, { useState } from 'react';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ConfirmPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Accessing the passed email

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/update-password', {
                password: newPassword,
                email, // Passing the email along with the new password
            });

            if (response.data.success) {
                navigate('/login');
            } else {
                setError('Failed to update the password. Please try again.');
            }
        } catch (err) {
            console.error('Error updating password:', err);
            setError('An error occurred while updating the password.');
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
                    <h2 style={{ marginBottom: '20px' }}>Create New Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ConfirmPassword;
