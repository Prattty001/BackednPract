import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FcCancel } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
import Modal from 'react-modal';
import Header from './Header';
import { CiSearch } from "react-icons/ci";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredUsers(sorted);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user.user_id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user.user_id !== userId));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setModalIsOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${editUser.user_id}`, {
        user_name: editUser.user_name,
        user_email: editUser.user_email,
        user_mobile_number: editUser.contact_number,  // Correct field name
        user_gender: editUser.user_gender,
        user_country_name: editUser.country,
        user_state_name: editUser.state,
      });
      const updatedUsers = users.map(user => 
        user.user_id === editUser.user_id ? editUser : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setModalIsOpen(false);
    } catch (err) {
      console.error('Error updating user:', err.response ? err.response.data : err.message);
      setError('Failed to update user.');
    }
  };

  const handleInputChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <CiSearch size={20} style={{ verticalAlign: "middle" }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px', padding: '10px', width: '100%', maxWidth: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#007BFF', color: '#ffffff', cursor: 'pointer' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('user_id')}>User ID</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('user_name')}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('user_email')}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('contact_number')}>Contact Number</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('user_gender')}>Gender</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('country')}>Country</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('state')}>State</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }} onClick={() => sortData('created_at')}>Created At</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.user_id} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.user_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', color: '#007BFF' }}>{user.user_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', color: '#007BFF' }}>{user.user_email}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.contact_number}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.user_gender}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.country}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.state}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{new Date(user.created_at).toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button onClick={() => deleteUser(user.user_id)} style={{ background: '#FFC107', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '4px', color: '#ffffff', marginBottom: '8px' }}>
                    <FcCancel size={24} />
                  </button>
                  <button onClick={() => openEditModal(user)} style={{ background: '#28A745', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '4px', color: '#ffffff' }}>
                    <FaEdit size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1} 
            style={{ padding: '10px', margin: '0 5px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#007BFF', color: '#ffffff' }}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={indexOfLastUser >= filteredUsers.length} 
            style={{ padding: '10px', margin: '0 5px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#007BFF', color: '#ffffff' }}
          >
            Next
          </button>
        </div>

        {/* Edit User Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '8px'
            },
          }}
        >
          <h2 style={{ color: '#007BFF' }}>Edit User</h2>
          {editUser && (
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Name</label>
                <input
                  type="text"
                  name="user_name"
                  value={editUser.user_name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Email</label>
                <input
                  type="email"
                  name="user_email"
                  value={editUser.user_email}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contact_number"
                  value={editUser.contact_number}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Gender</label>
                <select
                  name="user_gender"
                  value={editUser.user_gender}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={editUser.country}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={editUser.state}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <button type="submit" style={{ background: '#28A745', color: 'white', padding: '10px', width: '100%', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Changes</button>
            </form>
          )}
        </Modal>
      </div>
    </>
  );
};

export default UsersTable;
