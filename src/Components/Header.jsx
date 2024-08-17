import React from 'react';

const Header = () => {
  return (
    <div style={{
      backgroundColor: "#03d3fc", 
      display: 'flex', 
      justifyContent: 'start', 
      alignItems: 'center', 
      width: '100vw', 
      height: '60px',
      padding: '0', 
      margin: '0',
      position: 'absolute', // Positioned at the top
      top: '0',
      left: '0',
    }}>
      <div style={{ marginLeft: '10px' }}>
        <img src="logo.svg" alt="Logo" style={{ height: '50px', width: 'auto' }} />
      </div>
    </div>
  );
}

export default Header;
