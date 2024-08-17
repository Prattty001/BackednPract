import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConfirmPassword from "./Components/Confirmpass";
import ForgotPassword from "./Components/Forgetpass";
import Login from "./Components/Login";
import SignUp from "./Components/Signup";
import Getuser from './Components/getuser';
import PrivateRoute from './routes/Protected';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/" element={<Login />} />
        <Route path='/getuser' element ={ <PrivateRoute element={<Getuser />} />} />
      </Routes>
    </Router>
  );
}

export default App;
