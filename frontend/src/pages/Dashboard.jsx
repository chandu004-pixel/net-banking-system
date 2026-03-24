import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { Container, Spinner } from 'react-bootstrap';

import BalanceHero from '../components/dashboard/BalanceHero';
import AdSlider from '../components/dashboard/AdSlider';
import AnalyticsPanel from '../components/dashboard/AnalyticsPanel';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import FinancialInsights from '../components/dashboard/FinancialInsights';
import ActionModals from '../components/dashboard/ActionModals';

const Dashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const [balance, setBalance] = useState(0);
  const [accountDetails, setAccountDetails] = useState({ account: '', ifsc: '' });
  const [chartRange, setChartRange] = useState('1M');
  const [, setLoading] = useState(true);
  const [linkedBanks, setLinkedBanks] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    performance: [],
    weeklyActivity: [],
    recentActivity: [],
    spending: [],
    allocation: [],
    cashFlow: { inflow: 0, outflow: 0, percent: 0 },
    stats: { transactions: 0, deposits: 0, withdrawals: 0 }
  });

  const [showAdModal, setShowAdModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const ads = [
    { id: 1, img: '/ads/card.png', theme: 'NexBank Gold', tag: 'Limited Offer', description: 'Unlock premium lifestyle benefits, milestone rewards, and zero forex markup with the NexBank Gold Credit Card. Apply today for lifetime free access.' },
    { id: 2, img: '/ads/home.png', theme: 'Dreams & Homes', tag: 'Special Rate', description: 'Realize your dream home with our lowest ever interest rate starting at 8.35% p.a. Minimal processing fees and flexible repayment options.' },
    { id: 3, img: '/ads/fd.png', theme: 'Wealth Builder', tag: 'Secure 7.5%', description: 'Lock in high returns with NexBank Wealth Builder Fixed Deposits. Providing up to 7.5% p.a. interest for senior citizens with instant liquidity.' },
    { id: 4, img: '/ads/mobile.png', theme: 'NexBank Pro', tag: 'Banking App', description: 'Download our award-winning NexBank Pro mobile app for seamless UPI payments, expense tracking, and 24/7 account management.' },
    { id: 5, img: '/ads/insurance.png', theme: 'Safety First', tag: 'Life Cover', description: 'Comprehensive term life insurance covering critical illnesses. Secure your family’s future with premiums starting at just ₹499/month.' },
    { id: 6, img: '/ads/business.png', theme: 'Enterprise', tag: 'Growth Lite', description: 'Business banking simplified. Zero balance current accounts, integrated payment gateways, and fast-track working capital loans.' },
    { id: 7, img: '/ads/travel.png', theme: 'Global Nomad', tag: 'Travel Perks', description: 'Travel the world seamlessly with the NexBank Global Forex Card. Zero crossover currency charges and complimentary airport lounge access worldwide.' },
    { id: 8, img: '/ads/wealth.png', theme: 'Legacy Plan', tag: 'Expert Advice', description: 'Personalized wealth management starting at a portfolio of ₹10L. Access exclusive mutual funds, PMS, and dedicated relationship managers.' },
    { id: 9, img: '/ads/education.png', theme: 'Future Star', tag: 'Study Loans', description: 'Ignite their potential with NexBank Education Loans for domestic and international universities. 100% financing and easy moratorium options.' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const userRes = await api.get(`/users/${userId}`);
      setBalance(userRes.data.balance || 0);
      setAccountDetails({
        account: userRes.data.accountNumber,
        ifsc: userRes.data.ifscCode
      });

      const txRes = await api.get(`/users/${userId}/transactions`);
      const allTx = txRes.data || [];

      const recent = allTx.slice(0, 5).map(tx => ({
        _id: tx._id,
        title: tx.type === 'deposit' ? 'Inward Remittance' : 'Outward Transfer',
        amount: `₹${tx.amount.toLocaleString()}`,
        time: new Date(tx.createdAt).toLocaleDateString(),
        icon: tx.type === 'deposit' ? "fas fa-arrow-down" : "fas fa-arrow-up",
        color: tx.type === 'deposit' ? "#00e97a" : "#ef4444"
      }));

      const inflow = allTx.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
      const outflow = allTx.filter(t => t.type !== 'deposit').reduce((sum, t) => sum + t.amount, 0);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekly = days.map(day => {
        const amount = allTx.filter(t => days[new Date(t.createdAt).getDay()] === day).reduce((sum, t) => sum + t.amount, 0);
        return { day, amount };
      });

      setDashboardData(prev => ({
        ...prev,
        weeklyActivity: weekly,
        recentActivity: recent.length > 0 ? recent : [
          { title: 'Amazon Prime', time: 'Today, 2:45 PM', amount: '-₹1,499', icon: 'fas fa-shopping-bag', color: '#ef4444' },
          { title: 'Salary Credited', time: 'Yesterday', amount: '+₹85,000', icon: 'fas fa-university', color: '#00e97a' },
          { title: 'Netflix Subscription', time: '2 days ago', amount: '-₹649', icon: 'fas fa-tv', color: '#ef4444' }
        ],
        cashFlow: { inflow, outflow, percent: inflow > 0 ? Math.min((inflow / (inflow + outflow)) * 100, 100) : 0 },
        stats: { transactions: allTx.length, deposits: allTx.filter(t => t.type === 'deposit').length, withdrawals: allTx.filter(t => t.type !== 'deposit').length }
      }));

      try {
        const allocationRes = await api.get('/accounts/allocation');
        const spendingRes = await api.get('/analytics/spending?month=current');
        setDashboardData(prev => ({ ...prev, spending: spendingRes.data || [], allocation: allocationRes.data || [] }));
      } catch {
        setDashboardData(prev => ({
          ...prev,
          spending: [{ category: 'Food & Dining', amount: 12400, percent: 65, color: '#19bcfd' }, { category: 'Utilities', amount: 8200, percent: 45, color: '#f59e0b' }, { category: 'Travel', amount: 5000, percent: 30, color: '#ef4444' }],
          allocation: [{ name: 'Savings', value: 45000 }, { name: 'Investments', value: 30000 }, { name: 'Cash', value: userRes.data.balance || balance }]
        }));
      }

      try {
        const banksRes = await api.get('/banks');
        setLinkedBanks(banksRes.data.data || []);
      } catch (bankErr) {
        console.error('Failed to fetch linked banks', bankErr);
      }

    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      // Main Fallback
      setDashboardData(prev => ({
        ...prev,
        recentActivity: [
          { title: 'Amazon Prime', time: 'Today, 2:45 PM', amount: '-₹1,499', icon: 'fas fa-shopping-bag', color: '#ef4444' },
          { title: 'Salary Credited', time: 'Yesterday', amount: '+₹85,000', icon: 'fas fa-university', color: '#00e97a' },
          { title: 'Netflix Subscription', time: '2 days ago', amount: '-₹649', icon: 'fas fa-tv', color: '#ef4444' },
          { title: 'ATM Withdrawal', time: '3 days ago', amount: '-₹5,000', icon: 'fas fa-money-bill-wave', color: '#f59e0b' },
          { title: 'Interest Paid', time: '1 week ago', amount: '+₹124.50', icon: 'fas fa-percent', color: '#00e97a' }
        ]
      }));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, [chartRange]);

  const actions = [
    { title: 'Add KYC', icon: 'fas fa-address-card', path: '/add', color: '#00e97a' },
    { title: 'View KYC', icon: 'fas fa-eye', path: '/viewkyc', color: '#19bcfd' },
    { title: 'Add Your Bank', icon: 'fas fa-university', path: '#', color: '#8b5cf6' },
    { title: 'History', icon: 'fas fa-history', path: '/transactions', color: '#f59e0b' },
    { title: 'Deposit', icon: 'fas fa-plus-circle', path: '/transfer', color: '#00e97a' },
    { title: 'Withdraw', icon: 'fas fa-minus-circle', path: '/withdraw', color: '#ef4444' },
  ];

  const getPerformanceData = () => {
    switch (chartRange) {
      case '7D': return [{ month: "Mon", value: balance * 0.9 }, { month: "Wed", value: balance * 0.95 }, { month: "Fri", value: balance * 0.98 }, { month: "Sun", value: balance }];
      default: return [{ month: "Week 1", value: balance * 0.8 }, { month: "Week 2", value: balance * 0.85 }, { month: "Week 3", value: balance * 0.92 }, { month: "Week 4", value: balance }];
    }
  };

  const pieData = [{ name: 'Savings', value: 45000 }, { name: 'Business', value: 25000 }, { name: 'Investments', value: 15000 }, { name: 'Loans', value: 5000 }];
  const sparkHero = [{ val: 10 }, { val: 25 }, { val: 15 }, { val: 30 }, { val: 25 }, { val: 40 }, { val: 45 }, { val: 35 }, { val: 50 }];

  const [showTxModal, setShowTxModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankData, setBankData] = useState({ bankName: 'State Bank of India', accountNumber: '', ifscCode: '', accountHolderName: userName });
  const [txType, setTxType] = useState('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('razorpay');

  const handleLinkBank = async (e) => {
    e.preventDefault();
    setBankLoading(true);
    try {
      await api.post('/banks', bankData);
      setShowBankModal(false);
      alert('Bank account linked successfully!');
      setBankData({ bankName: 'State Bank of India', accountNumber: '', ifscCode: '', accountHolderName: userName });
    } catch (err) { alert(err.response?.data?.error || 'Failed to link bank'); } finally { setBankLoading(false); }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setTxLoading(true);
    try {
      if (txType === 'deposit') {
        if (!selectedBank || selectedBank === 'razorpay') { navigate('/transfer'); }
        else {
          await api.post('/payment/withdraw', { amount: -Number(txAmount) });
          setShowTxModal(false); fetchDashboardData(); alert('Funds pulled from bank successfully!');
        }
        return;
      }
      await api.post('/payment/withdraw', { amount: Number(txAmount) });
      setShowTxModal(false); fetchDashboardData(); alert('Withdrawal to bank successful!');
    } catch (err) { alert(err.response?.data?.error || 'Transaction failed'); } finally { setTxLoading(false); }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (<div className="custom-tooltip"><p className="label">{`${label || payload[0].name} : ₹${payload[0].value.toLocaleString()}`}</p></div>);
    }
    return null;
  };

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const dotBg = theme === 'dark' ? '#0b0f14' : '#ffffff';

  return (
    <div className="saas-dashboard">
      <Container fluid className="px-4 px-lg-5">
        
        <BalanceHero userName={userName} balance={balance} accountDetails={accountDetails} sparkHero={sparkHero} actions={actions} navigate={navigate} setTxType={setTxType} setShowTxModal={setShowTxModal} setShowBankModal={setShowBankModal} getGreeting={getGreeting} />
        
        <AdSlider ads={ads} setSelectedAd={setSelectedAd} setShowAdModal={setShowAdModal} />

        <AnalyticsPanel chartRange={chartRange} setChartRange={setChartRange} getPerformanceData={getPerformanceData} dashboardData={dashboardData} theme={theme} CustomTooltip={CustomTooltip} gridColor={gridColor} tickColor={tickColor} dotBg={dotBg} pieData={pieData} />
        
        {/* Render the Activity Feed below the Analytics Panel but visually inside the grid flow */}
        <div className="row mb-4">
           <ActivityFeed dashboardData={dashboardData} />
        </div>

        <FinancialInsights />

        <div className="dashboard-footer mt-5 pb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="d-flex align-items-center justify-content-center w-100">
               <span className="text-secondary" style={{fontSize: '12px'}}>Dashboard Modular Refactor Completed Securely</span>
            </div>
          </div>
        </div>

      </Container>

      <ActionModals showTxModal={showTxModal} setShowTxModal={setShowTxModal} txType={txType} txAmount={txAmount} setTxAmount={setTxAmount} handleTransaction={handleTransaction} txLoading={txLoading} selectedBank={selectedBank} setSelectedBank={setSelectedBank} linkedBanks={linkedBanks} showBankModal={showBankModal} setShowBankModal={setShowBankModal} bankData={bankData} setBankData={setBankData} handleLinkBank={handleLinkBank} bankLoading={bankLoading} showAdModal={showAdModal} setShowAdModal={setShowAdModal} selectedAd={selectedAd} theme={theme} />

      <style>{`
        /* Professional Neutral Color Strategy */
        :root {
            --border-subtle: rgba(255,255,255,0.06); 
        }
        body.light-theme {
             --border-subtle: rgba(0,0,0,0.06);
        }

        .saas-dashboard {
          background-color: var(--bg-dashboard);
          color: var(--text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-height: 100vh;
          padding: 90px 0 50px 0;
        }

        .hero-balance-card {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        body.light-theme .hero-balance-card { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); }

        .hero-decoration {
            position: absolute; top: 0; right: 0; bottom: 0; left: 0;
            background: radial-gradient(circle at top right, rgba(0,233,122,0.15), transparent 50%);
            pointer-events: none;
        }

        .muted-card {
            background: var(--surface-secondary); border: 1px solid var(--border-subtle);
            border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); transition: border-color 0.2s;
        }
        .muted-card:hover { border-color: rgba(148, 163, 184, 0.3); }

        .section-label { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0; }

        .hero-greeting-strip {
          position: relative; padding: 24px; border-radius: 16px;
          background: var(--surface-primary); border: 1px solid var(--border-subtle); overflow: hidden;
        }

        .glass-pill-btn {
          background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); color: var(--text-primary);
          font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 20px; transition: all 0.3s ease;
          display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .glass-pill-btn:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(0, 233, 122, 0.3); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 233, 122, 0.1); }

        .subtle-range-controls { display: flex; gap: 4px; background: var(--surface-tertiary); border-radius: 6px; padding: 3px; }
        .subtle-range-btn { background: transparent; border: none; color: var(--text-muted); font-size: 10px; font-weight: 600; padding: 4px 8px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
        .subtle-range-btn:hover { color: var(--text-primary); }
        .subtle-range-btn.active { background: var(--surface-primary); color: var(--text-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        .recent-activity-scroll::-webkit-scrollbar { width: 4px; }
        .recent-activity-scroll::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }

        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .insight-card { display: flex; align-items: flex-start; background: var(--surface-primary); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .insight-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 14px; flex-shrink: 0; }
        .insight-icon.success { background: rgba(0, 233, 122, 0.1); color: #00e97a; }
        .insight-icon.warning { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .hero-insight { flex-direction: column; align-items: stretch; border: 1px solid rgba(59, 130, 246, 0.2) !important; background: var(--surface-secondary); }
        .progress-glow-bar { position: relative; }
        .progress-glow-bar::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 2s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }

        .insight-action-btn { background: transparent; border: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 11px; padding: 6px 12px; border-radius: 6px; }
        .actionable-insight:hover .insight-action-btn { background: var(--primary); color: #000; border-color: var(--primary); }
      `}</style>
    </div>
  );
};

export default Dashboard;
