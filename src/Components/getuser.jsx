import React from 'react';
import UsersTable from './Usertable';
import { TbLayoutDashboardFilled } from "react-icons/tb";

const Getuser = () => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '4rem',
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#333'
      }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <TbLayoutDashboardFilled style={{ marginLeft: '8px', verticalAlign: 'middle' }} size={78} />
      </div>
      <UsersTable />
    </div>
  );
};

export default Getuser;
