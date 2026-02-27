import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Addkyc from './pages/Addkyc';
import Viewkyc from './pages/Viewkyc';
import Navbardata from './components/Navbardata';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './pages/TransactionHistory';
import Transfer from './pages/Transfer';
import Logout from './pages/Logout';
import Withdraw from './pages/Withdraw';
import Home from './pages/Home';
import Footer from './components/Footer';


import { ThemeProvider } from './context/ThemeContext';


const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Navbardata />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />           {/* Login */}
          <Route path="/register" element={<Register />} />     {/* Register */}
          <Route path="/dashboard" element={<Dashboard />} />   {/* User Dashboard */}
          <Route path="/add" element={<Addkyc />} />            {/* Add KYC */}
          <Route path="/view" element={<Viewkyc />} />          {/* View KYC */}
          <Route path="/transactions" element={<TransactionHistory />} /> {/* Transaction History */}
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
