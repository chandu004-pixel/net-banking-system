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
import AdminDashboard from './pages/AdminDashboard';
import TransactionReview from './pages/TransactionReview';
import VirtualCards from './pages/VirtualCards';
import LoanOffers from './pages/LoanOffers';
import Investments from './pages/Investments';
import LinkedBanks from './pages/LinkedBanks';
import HelpSupport from './pages/HelpSupport';
import UserManagement from './pages/UserManagement';
import ProductManagement from './pages/ProductManagement';
import UserSettings from './pages/UserSettings';
import AdminSettings from './pages/AdminSettings';

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
          <Route path="/admin" element={<AdminDashboard />} />  {/* SuperAdmin Dashboard */}
          <Route path="/admin/review" element={<TransactionReview />} />  {/* Admin Review Dashboard */}
          <Route path="/admin/users" element={<UserManagement />} />      {/* Admin User Control */}
          <Route path="/admin/products" element={<ProductManagement />} />{/* Product Config */}
          <Route path="/admin/settings" element={<AdminSettings />} />    {/* Admin Settings */}
          
          <Route path="/settings" element={<UserSettings />} />           {/* User Settings */}
          <Route path="/add" element={<Addkyc />} />            {/* Add KYC */}
          <Route path="/viewkyc" element={<Viewkyc />} />          {/* View KYC */}
          <Route path="/transactions" element={<TransactionHistory />} /> {/* Transaction History */}
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/cards" element={<VirtualCards />} />
          <Route path="/loans" element={<LoanOffers />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/banks" element={<LinkedBanks />} />
          <Route path="/support" element={<HelpSupport />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
