import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FcCancel } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
import Modal from 'react-modal';
import Header from './Header';
import { CiSearch } from "react-icons/ci";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'user_id', direction: 'asc' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 5; // Updated number of users per page

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, sortConfig]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        params: {
          page: currentPage,
          limit: usersPerPage,
          search: searchTerm,
          sortBy: sortConfig.key,
          sortDirection: sortConfig.direction,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchUsers(); // Refetch users after deletion
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setModalIsOpen(true);
  };

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`http://localhost:5000/api/users/${editUser.user_id}`, {
  //       user_name: editUser.user_name,
  //       user_email: editUser.user_email,
  //       // contact_number: editUser.contact_number,
  //       user_gender: editUser.user_gender,
  //       // country: editUser.country,
  //       // state: editUser.state,
  //     });
  //     setModalIsOpen(false);
  //     fetchUsers(); // Refetch users after editing
  //   } catch (err) {
  //     console.error('Error updating user:', err.response ? err.response.data : err.message);
  //     setError('Failed to update user.');
  //   }
  // };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        // Split the contact number back into user_country_code and user_mobile_number
        const [user_country_code, user_mobile_number] = editUser.contact_number.split(' ');

        await axios.put(`http://localhost:5000/api/users/${editUser.user_id}`, {
            user_name: editUser.user_name,
            user_email: editUser.user_email,
            //Now sending them by spillting the countrycode and mobile number!..
            user_country_code, // Extracted from contact_number
            user_mobile_number, // Extracted from contact_number
            user_gender: editUser.user_gender,
            user_country_name: editUser.country, // Maps to user_country_name
            user_state_name: editUser.state // Maps to user_state_name
        });

        setModalIsOpen(false);
        fetchUsers(); // Refetch users after editing
    } catch (err) {
        console.error('Error updating user:', err.response ? err.response.data : err.message);
        setError('Failed to update user.');
    }
};




  const handleInputChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <CiSearch size={20} style={{ verticalAlign: "middle" }} />
        <input
          type="text"
          placeholder="Search by name, email, contact number, gender, country, or state..."
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
            {users.map(user => (
              <tr key={user.user_id} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.user_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', color: '#007BFF' }}>{user.user_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', color: '#007BFF' }}>{user.user_email}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.contact_number}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.user_gender}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.country}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{user.state}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{new Date(user.created_at).toLocaleDateString()}</td>
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
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages} 
            style={{ padding: '10px', margin: '0 5px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#007BFF', color: '#ffffff' }}
          >
            Next
          </button>
        </div>

        {/* Edit User Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Edit User"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              color: '#000',
              maxWidth: '500px',
              margin: 'auto',
              padding: '20px',
              borderRadius: '8px',
            },
          }}
        >
          <h2>Edit User</h2>
          <form onSubmit={handleEditSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label>Name:</label>
              <input type="text" name="user_name" value={editUser?.user_name || ''} onChange={handleInputChange} style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Email:</label>
              <input type="email" name="user_email" value={editUser?.user_email || ''} onChange={handleInputChange} style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Contact Number:</label>
              <input type="text" name="contact_number" value={editUser?.contact_number || ''} onChange={handleInputChange} style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Gender:</label>
              <input type="text" name="user_gender" value={editUser?.user_gender || ''} onChange={handleInputChange} style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Country:</label>
              <input type="text" name="country" value={editUser?.country || ''} onChange={handleInputChange} style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>State:</label>
              <input type="text" name="state" value={editUser?.state || ''} onChange={handleInputChange} style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28A745', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}>Save Changes</button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default UsersTable;
