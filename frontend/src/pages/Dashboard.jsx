import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { Container, Row, Col, Modal, Button, Spinner } from 'react-bootstrap';
import CountUp from 'react-countup';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Dashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const [balance, setBalance] = useState(0);
  const [chartRange, setChartRange] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    performance: [],
    weeklyActivity: [],
    recentActivity: [],
    spending: [],
    allocation: [],
    cashFlow: { inflow: 0, outflow: 0, percent: 0 },
    stats: { transactions: 0, deposits: 0, withdrawals: 0 }
  });

  // Advertisement State
  const [activeAdGroup, setActiveAdGroup] = useState(0);
  const ads = [
    { id: 1, img: '/ads/card.png', theme: 'NexBank Gold', tag: 'Limited Offer' },
    { id: 2, img: '/ads/home.png', theme: 'Dreams & Homes', tag: 'Special Rate' },
    { id: 3, img: '/ads/fd.png', theme: 'Wealth Builder', tag: 'Secure 7.5%' },
    { id: 4, img: '/ads/mobile.png', theme: 'NexBank Pro', tag: 'Banking App' },
    { id: 5, img: '/ads/insurance.png', theme: 'Safety First', tag: 'Life Cover' },
    { id: 6, img: '/ads/business.png', theme: 'Enterprise', tag: 'Growth Lite' },
    { id: 7, img: '/ads/travel.png', theme: 'Global Nomad', tag: 'Travel Perks' },
    { id: 8, img: '/ads/wealth.png', theme: 'Legacy Plan', tag: 'Expert Advice' },
    { id: 9, img: '/ads/education.png', theme: 'Future Star', tag: 'Study Loans' }
  ];

  // Group ads into chunks of 3
  const adGroups = [];
  for (let i = 0; i < ads.length; i += 3) {
    adGroups.push(ads.slice(i, i + 3));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAdGroup((prev) => (prev + 1) % adGroups.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [adGroups.length]);

  // Phase 5: Smart Greeting
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

      // Real API calls (mapping most to existing transaction history for now to calculate stats)
      const userRes = await api.get(`/users/${userId}`);
      setBalance(userRes.data.balance || 0);

      const txRes = await api.get(`/users/${userId}/transactions`);
      const allTx = txRes.data || [];

      // Calculate Data Dynamically
      const recent = allTx.slice(0, 5).map(tx => ({
        _id: tx._id,
        title: tx.type === 'deposit' ? 'Inward Remittance' : 'Outward Transfer',
        amount: `₹${tx.amount.toLocaleString()}`,
        time: new Date(tx.createdAt).toLocaleDateString(),
        icon: tx.type === 'deposit' ? "fas fa-arrow-down" : "fas fa-arrow-up",
        color: tx.type === 'deposit' ? "#00e97a" : "#ef4444"
      }));

      // Inflow/Outflow calculation
      const inflow = allTx.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
      const outflow = allTx.filter(t => t.type !== 'deposit').reduce((sum, t) => sum + t.amount, 0);

      // Weekly Activity Calculation (Last 7 Days)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekly = days.map(day => {
        const amount = allTx
          .filter(t => days[new Date(t.createdAt).getDay()] === day)
          .reduce((sum, t) => sum + t.amount, 0);
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
        cashFlow: {
          inflow,
          outflow,
          percent: inflow > 0 ? Math.min((inflow / (inflow + outflow)) * 100, 100) : 0
        },
        stats: {
          transactions: allTx.length,
          deposits: allTx.filter(t => t.type === 'deposit').length,
          withdrawals: allTx.filter(t => t.type !== 'deposit').length
        }
      }));

      // Try fetching more details
      try {
        const allocationRes = await api.get('/accounts/allocation');
        const spendingRes = await api.get('/analytics/spending?month=current');
        setDashboardData(prev => ({
          ...prev,
          spending: spendingRes.data || [],
          allocation: allocationRes.data || []
        }));
      } catch {
        // Mock fallback for advanced analytics
        setDashboardData(prev => ({
          ...prev,
          spending: [
            { category: 'Food & Dining', amount: 12400, percent: 65, color: '#19bcfd' },
            { category: 'Utilities', amount: 8200, percent: 45, color: '#f59e0b' },
            { category: 'Travel', amount: 5000, percent: 30, color: '#ef4444' }
          ],
          allocation: [
            { name: 'Savings', value: 45000 },
            { name: 'Investments', value: 30000 },
            { name: 'Cash', value: balance }
          ]
        }));
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [chartRange]);

  const actions = [
    { title: 'Add KYC', icon: 'fas fa-address-card', path: '/add', color: '#00e97a' },
    { title: 'View KYC', icon: 'fas fa-eye', path: '/view', color: '#19bcfd' },
    { title: 'History', icon: 'fas fa-history', path: '/transactions', color: '#f59e0b' },
    { title: 'Deposit', icon: 'fas fa-plus-circle', path: '/transfer', color: '#00e97a' },
    { title: 'Withdraw', icon: 'fas fa-minus-circle', path: '/withdraw', color: '#ef4444' },
  ];

  const performanceData = [
    { month: "Jan", value: 20000 },
    { month: "Feb", value: 35000 },
    { month: "Mar", value: 42000 },
    { month: "Apr", value: 38000 },
    { month: "May", value: 50000 },
    { month: "Jun", value: 62000 },
  ];

  const getPerformanceData = () => {
    // Return mock data for now, but in a production app this would filter dashboardData.history
    switch (chartRange) {
      case '7D':
        return [
          { month: "Mon", value: balance * 0.9 },
          { month: "Wed", value: balance * 0.95 },
          { month: "Fri", value: balance * 0.98 },
          { month: "Sun", value: balance },
        ];
      default:
        return [
          { month: "Week 1", value: balance * 0.8 },
          { month: "Week 2", value: balance * 0.85 },
          { month: "Week 3", value: balance * 0.92 },
          { month: "Week 4", value: balance },
        ];
    }
  };

  const transactionData = [
    { day: "Mon", amount: 4000 },
    { day: "Tue", amount: 3000 },
    { day: "Wed", amount: 5000 },
    { day: "Thu", amount: 2000 },
    { day: "Fri", amount: 6000 },
  ];

  const pieData = [
    { name: 'Savings', value: 45000 },
    { name: 'Business', value: 25000 },
    { name: 'Investments', value: 15000 },
    { name: 'Loans', value: 5000 },
  ];
  const COLORS = ['#00e97a', '#19bcfd', '#f59e0b', '#ef4444'];

  const recentActivity = [
    { title: "Deposit", amount: "₹5,000", time: "2 hours ago", icon: "fas fa-arrow-down", color: "#00e97a" },
    { title: "Transfer", amount: "₹1,200", time: "Yesterday", icon: "fas fa-arrow-up", color: "#ef4444" },
    { title: "KYC Approved", amount: "", time: "3 days ago", icon: "fas fa-check", color: "#19bcfd" }
  ];

  const spark1 = [{ val: 10 }, { val: 25 }, { val: 15 }, { val: 30 }, { val: 25 }, { val: 40 }];
  const spark2 = [{ val: 50 }, { val: 60 }, { val: 65 }, { val: 70 }, { val: 85 }, { val: 100 }];
  const spark3 = [{ val: 100 }, { val: 95 }, { val: 80 }, { val: 90 }, { val: 70 }, { val: 60 }];

  const spendingCategories = [
    { category: 'Food & Dining', amount: 12400, percent: 65, color: '#19bcfd' },
    { category: 'Utilities', amount: 8200, percent: 45, color: '#f59e0b' },
    { category: 'Travel', amount: 5000, percent: 30, color: '#ef4444' },
    { category: 'Subscriptions', amount: 3500, percent: 20, color: '#00e97a' },
  ];

  const managementActions = [
    { title: 'Credit Card', icon: 'fas fa-credit-card', color: '#19bcfd', path: '/cards' },
    { title: 'Add Bank', icon: 'fas fa-university', color: '#00e97a', path: '/add-bank' },
    { title: 'Add ATM Card', icon: 'fas fa-id-card', color: '#f59e0b', path: '/add-atm' },
    { title: 'Check Balance', icon: 'fas fa-search-dollar', color: '#ef4444', path: '/balance' },
  ];

  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txLoading, setTxLoading] = useState(false);

  const handleTransaction = async (e) => {
    e.preventDefault();
    setTxLoading(true);
    try {
      if (txType === 'deposit') {
        // Redirection to transfer page is better for deposits due to payment gateway
        navigate('/transfer');
        return;
      }

      await api.post('/payment/withdraw', { amount: Number(txAmount) });
      setShowTxModal(false);
      fetchDashboardData();
      alert('Withdrawal successful');
    } catch (err) {
      alert(err.response?.data?.error || 'Transaction failed');
    } finally {
      setTxLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label || payload[0].name} : ₹${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const dotBg = theme === 'dark' ? '#0b0f14' : '#ffffff';

  return (
    <div className="saas-dashboard">
      <Container fluid className="px-4 px-lg-5">

        {/* Header Section */}
        <div className="dashboard-header animate-fade-in">
          <div className="header-left">
            <h1>{getGreeting()}, <span style={{ background: 'linear-gradient(135deg, #00e97a, #19bcfd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', fontWeight: 700 }}>{userName}</span></h1>
            <p>Here’s a snapshot of your financial activity</p>
          </div>
          <div className="header-right">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">System Normal</span>
            </div>
          </div>
        </div>

        {/* Top Metric Row */}
        <Row className="mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Col lg={4} md={12} className="mb-3 mb-lg-0">
            <div className="saas-card primary-surface h-100 balance-card d-flex flex-column justify-content-between">
              <div>
                <h6 className="card-label">TOTAL BALANCE</h6>
                <div className="d-flex align-items-center mt-2">
                  <h2 className="balance-value mb-0 positive-glow">
                    ₹<CountUp end={balance} duration={1.5} separator="," />
                  </h2>
                </div>
              </div>
              <div className="balance-meta mt-4">
                <i className="fas fa-check-circle me-2 text-primary-accent"></i>
                <span>Savings Account • Active</span>
              </div>
            </div>
          </Col>
          <Col lg={8} md={12}>
            <div className="saas-card secondary-surface h-100 p-[20px]">
              <h6 className="card-label mb-3">QUICK ACTIONS</h6>
              <Row className="g-2 h-100 align-items-center">
                {actions.map((action, idx) => (
                  <Col key={idx} xs={4} md={2} className="flex-fill d-flex">
                    <div
                      className="quick-action-btn flex-fill tertiary-surface py-3"
                      onClick={() => {
                        if (action.title === 'Deposit') {
                          setTxType('deposit');
                          setShowTxModal(true);
                        } else if (action.title === 'Withdraw') {
                          setTxType('withdraw');
                          setShowTxModal(true);
                        } else {
                          navigate(action.path);
                        }
                      }}
                    >
                      <i className={`${action.icon}`} style={{ color: action.color }}></i>
                      <span>{action.title}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>

        {/* Phase 1: Insight Strip */}
        <div className="insight-banner mb-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <i className="fas fa-chart-line" style={{ color: '#00e97a', marginRight: '10px' }}></i>
          <span><strong>Portfolio Insight:</strong> Deposits increased 18% compared to last month.</span>
        </div>

        {/* Charts Row - 6 | 3 | 3 Column Split */}
        <Row className="mb-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Col lg={6} md={12} className="mb-3 mb-lg-0">
            <div className="saas-card secondary-surface h-100 p-[20px]">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <h6 className="card-label mb-0 me-4">ACCOUNT PERFORMANCE</h6>
                  <div className="chart-legend d-none d-md-flex">
                    <span className="legend-dot" style={{ background: '#00e97a' }}></span> Balance Flow
                  </div>
                </div>
                {/* Date Range Control */}
                <div className="range-controls">
                  {['7D', '1M', '3M', '1Y'].map(range => (
                    <button
                      key={range}
                      className={`range-btn ${chartRange === range ? 'active' : ''}`}
                      onClick={() => setChartRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-container chart-entrance pt-2" style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getPerformanceData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="neonGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e97a" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#00e97a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#00e97a"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#neonGlow)"
                      activeDot={{ r: 6, fill: dotBg, stroke: '#00e97a', strokeWidth: 2 }}
                      style={{ filter: "drop-shadow(0px 4px 12px rgba(0,233,122,0.3))" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={3} md={12}>
            <div className="saas-card secondary-surface h-100 p-[20px]">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="card-label mb-0">WEEKLY ACTIVITY</h6>
              </div>
              <div className="chart-container chart-entrance" style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.weeklyActivity.length > 0 ? dashboardData.weeklyActivity : transactionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#19bcfd"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: dotBg, stroke: '#19bcfd', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={3} md={12} className="mt-3 mt-lg-0">
            <div className="saas-card secondary-surface h-100 p-[20px] d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="card-label mb-0">UPCOMING BILLS</h6>
              </div>
              <div className="bills-list pb-2 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div style={{ backgroundColor: '#19bcfd15', color: '#19bcfd', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                      <i className="fas fa-wifi"></i>
                    </div>
                    <div>
                      <span className="d-block" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Internet Bill</span>
                      <span className="d-block" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due in 3 days</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>₹1,200</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div style={{ backgroundColor: '#f59e0b15', color: '#f59e0b', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div>
                      <span className="d-block" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Electricity</span>
                      <span className="d-block" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due in 5 days</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>₹2,450</span>
                </div>
              </div>
              <button className="w-100 py-2 mt-auto text-center primary-surface" style={{ border: '1px solid var(--card-border)', color: 'var(--text-secondary)', borderRadius: '8px', fontSize: '12px', transition: 'all 0.2s', cursor: 'pointer', fontWeight: 600 }}>
                View All Bills
              </button>
            </div>
          </Col>
        </Row>

        {/* Last Updated */}
        <div className="text-end mb-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Last updated: Just now</span>
        </div>

        {/* Dynamic Advertisement Slider (Dimensionized 3-Column) */}
        <div className="ad-slider-container mb-4 overflow-hidden position-relative" style={{ background: 'transparent', height: '260px' }}>
          <div className="ad-slides-wrapper" style={{
            display: 'flex',
            transition: 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)',
            transform: `translateX(-${activeAdGroup * 100}%)`,
            width: `${adGroups.length * 100}%`,
            height: '100%'
          }}>
            {adGroups.map((group, groupIdx) => (
              <div key={groupIdx} style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                flexShrink: 0
              }}>
                {group.map((ad) => (
                  <div key={ad.id} style={{
                    height: '100%',
                    position: 'relative',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)', zIndex: 1 }}></div>
                    <img src={ad.img} alt={ad.theme} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '20px', left: '15px', right: '15px', zIndex: 2 }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: '#00e97a', fontWeight: 800, display: 'block', marginBottom: '4px' }}>{ad.tag}</span>
                      <h5 style={{ margin: '0 0 10px 0', fontWeight: 700, fontSize: '16px', color: '#fff' }}>{ad.theme}</h5>
                      <button style={{
                        padding: '5px 12px',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>Discover <i className="fas fa-arrow-right ms-1" style={{ fontSize: '8px' }}></i></button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Navigation Controls (Top Right) */}
          <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 3, display: 'flex', gap: '8px' }}>
            {adGroups.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveAdGroup(idx)}
                style={{
                  width: activeAdGroup === idx ? '30px' : '10px',
                  height: '5px',
                  background: activeAdGroup === idx ? '#00e97a' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Mini Stats with Sparklines & Cash Flow */}
        <Row className="mb-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>

          <Col lg={4} className="mb-3 mb-lg-0">
            <div className="saas-card secondary-surface h-100 p-[20px] d-flex flex-column justify-content-between">
              <h6 className="card-label mb-3">CASH FLOW OVERVIEW</h6>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Inflow</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>₹84,000 <span className="text-positive ms-2" style={{ fontSize: '11px' }}>▲12%</span></span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Outflow</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>₹32,000 <span className="text-negative ms-2" style={{ fontSize: '11px' }}>▼4%</span></span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 pt-3" style={{ borderTop: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Net Flow</span>
                <span className="text-positive" style={{ fontSize: '16px', fontWeight: 700 }}>+₹52,000</span>
              </div>

              {/* Stacked bar visualization */}
              <div className="w-100 mt-auto" style={{ height: '8px', background: 'var(--surface-tertiary)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '72%', background: '#00e97a' }}></div>
                <div style={{ width: '28%', background: '#ef4444' }}></div>
              </div>
            </div>
          </Col>

          <Col lg={8}>
            <Row className="g-3 h-100">
              <Col md={4}>
                <div className="saas-mini-stat secondary-surface h-100">
                  <div className="stat-info">
                    <span className="stat-label">TOTAL TRANSACTIONS</span>
                    <span className="stat-value">{dashboardData.stats.transactions}</span>
                    <span className="stat-growth neutral-growth">Avg volume</span>
                  </div>
                  <div className="stat-chart">
                    <ResponsiveContainer width={70} height={35}>
                      <LineChart data={spark1}>
                        <Line type="monotone" dataKey="val" stroke="#94a3b8" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="saas-mini-stat secondary-surface h-100">
                  <div className="stat-info">
                    <span className="stat-label">DEPOSITS (MTD)</span>
                    <span className="stat-value text-positive">₹84,000</span>
                    <span className="stat-growth positive-growth">+12% vs last month</span>
                  </div>
                  <div className="stat-chart">
                    <ResponsiveContainer width={70} height={35}>
                      <LineChart data={spark2}>
                        <Line type="monotone" dataKey="val" stroke="#00e97a" strokeWidth={2} dot={false} style={{ filter: "drop-shadow(0px 4px 6px rgba(0,233,122,0.4))" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="saas-mini-stat secondary-surface h-100">
                  <div className="stat-info">
                    <span className="stat-label">WITHDRAWALS (MTD)</span>
                    <span className="stat-value text-negative">₹32,000</span>
                    <span className="stat-growth negative-growth">-4% vs last month</span>
                  </div>
                  <div className="stat-chart">
                    <ResponsiveContainer width={70} height={35}>
                      <LineChart data={spark3}>
                        <Line type="monotone" dataKey="val" stroke="#ef4444" strokeWidth={2} dot={false} style={{ filter: "drop-shadow(0px 4px 6px rgba(239,68,68,0.4))" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Asset Allocation & Recent Activity */}
        <Row className="mb-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Col lg={8} className="mb-3 mb-lg-0">
            <div className="saas-card secondary-surface p-[20px] h-100">
              <h6 className="card-label mb-4">ASSET ALLOCATION</h6>
              <Row className="align-items-center h-100">
                <Col lg={5} md={5}>
                  <div style={{ height: '200px' }} className="d-flex justify-content-center chart-entrance">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.allocation.length > 0 ? dashboardData.allocation : pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {(dashboardData.allocation.length > 0 ? dashboardData.allocation : pieData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
                <Col lg={7} md={7}>
                  <div className="allocation-list">
                    {pieData.map((entry, index) => (
                      <div key={index} className="allocation-item tertiary-surface">
                        <div className="d-flex align-items-center">
                          <span className="color-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span className="item-name">{entry.name}</span>
                        </div>
                        <span className="item-value">₹{entry.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={4}>
            <div className="saas-card secondary-surface p-[20px] h-100">
              <h6 className="card-label mb-4">RECENT ACTIVITY</h6>
              <div className="recent-activity-list">
                {dashboardData.recentActivity.map((activity, idx) => (
                  <div key={idx} className="activity-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="activity-icon-wrapper" style={{ background: `${activity.color}15`, color: activity.color }}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="activity-info ms-3">
                        <div className="activity-title text-primary-accent">{activity.title}</div>
                        <div className="activity-time text-muted smaller">{activity.time}</div>
                      </div>
                    </div>
                    <div className="activity-amount fw-700" style={{ color: activity.color }}>
                      {activity.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Top Spending Categories */}
        <Row className="mb-3 animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <Col lg={12}>
            <div className="saas-card secondary-surface p-[24px]">
              <h6 className="card-label mb-4"><i className="fas fa-receipt me-2"></i>TOP SPENDING CATEGORIES</h6>
              <Row>
                {(dashboardData.spending.length > 0 ? dashboardData.spending : spendingCategories).map((spend, idx) => (
                  <Col md={3} sm={6} key={idx} className="mb-3 mb-md-0">
                    <div className="spending-card tertiary-surface">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>{spend.category}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>₹{spend.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-100" style={{ height: '6px', background: 'var(--surface-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${spend.percent}%`, height: '100%', background: spend.color, borderRadius: '3px', boxShadow: `0 0 10px ${spend.color}80` }}></div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>

        {/* Account Management Subsection */}
        <Row className="mb-3 animate-fade-in" style={{ animationDelay: '0.48s' }}>
          <Col lg={12}>
            <div className="saas-card secondary-surface p-[24px]">
              <h6 className="card-label mb-4"><i className="fas fa-tasks me-2"></i>ACCOUNT MANAGEMENT</h6>
              <Row className="g-3">
                {managementActions.map((action, idx) => (
                  <Col md={3} sm={6} key={idx}>
                    <div
                      className="quick-action-btn tertiary-surface d-flex align-items-center justify-content-center p-4"
                      style={{ cursor: 'pointer', minHeight: '110px' }}
                      onClick={() => navigate(action.path)}
                    >
                      <div className="d-flex flex-column align-items-center">
                        <i className={action.icon} style={{ color: action.color, fontSize: '24px', marginBottom: '12px' }}></i>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{action.title}</span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>

        {/* System Status */}
        <Row className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Col lg={12}>
            <div className="system-status-strip">
              <div className="d-flex align-items-center">
                <i className="fas fa-shield-alt status-icon"></i>
                <span className="status-msg">Advanced Security Active — 256-bit encryption enabled & multi-factor active</span>
              </div>
            </div>
          </Col>
        </Row>

      </Container>

      {/* Transaction Modal */}
      <Modal show={showTxModal} onHide={() => setShowTxModal(false)} centered contentClassName={theme === 'dark' ? "bg-[#111821] border-white/10" : ""}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--card-border)' }}>
          <Modal.Title style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {txType === 'deposit' ? 'Fast Deposit' : 'Secure Withdrawal'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form onSubmit={handleTransaction}>
            <div className="mb-4">
              <label className="d-block mb-2 smaller fw-600 text-muted uppercase tracking-wider">Amount (INR)</label>
              <div className="position-relative">
                <span className="position-absolute translate-middle-y" style={{ left: '16px', top: '50%', color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-100 py-3 ps-5 border-0 rounded-3 text-primary-accent fw-700"
                  style={{ background: 'var(--surface-tertiary)', fontSize: '24px', outline: 'none' }}
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            {txType === 'deposit' ? (
              <div className="p-3 mb-4 rounded-3" style={{ background: 'rgba(0,233,122,0.05)', border: '1px solid rgba(0,233,122,0.1)' }}>
                <p className="small mb-0 text-muted">Deposits are handled securely via our payment gateway. You will be redirected to the transfer page.</p>
              </div>
            ) : (
              <div className="p-3 mb-4 rounded-3" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                <p className="small mb-0 text-muted">Withdrawals are processed instantly to your linked bank account. Minimum ₹100 required.</p>
              </div>
            )}
            <Button
              type="submit"
              disabled={txLoading}
              className="w-100 py-3 border-0 fw-700"
              style={{
                background: txType === 'deposit' ? 'var(--primary)' : '#ef4444',
                color: '#000',
                borderRadius: '12px',
                boxShadow: txType === 'deposit' ? '0 8px 20px rgba(0, 233, 122, 0.3)' : '0 8px 20px rgba(239, 68, 68, 0.3)'
              }}
            >
              {txLoading ? <Spinner size="sm" /> : txType === 'deposit' ? 'Proceed to Deposit' : 'Confirm Withdrawal'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <style>{`
        /* Root & Typography */
        .saas-dashboard {
          background-color: var(--bg-dashboard);
          color: var(--text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-height: 100vh;
          padding: 130px 0 50px 0;
        }

        .saas-dashboard h1 {
          font-size: 26px;
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }
        
        .saas-dashboard h1 span.text-white {
          color: var(--text-primary);
          font-weight: 700;
        }

        .saas-dashboard p {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 0;
          font-weight: 400;
        }

        /* Utilities */
        .text-positive { color: #00e97a !important; text-shadow: 0 0 10px rgba(0,233,122,0.3); }
        .text-negative { color: #ef4444 !important; }
        .text-primary-accent { color: #00e97a !important; }
        
        .positive-glow {
          text-shadow: 0 0 15px rgba(0,233,122,0.4);
        }

        /* Layered Surfaces */
        .primary-surface { background: var(--surface-primary) !important; }
        .secondary-surface { background: var(--surface-secondary) !important; }
        .tertiary-surface { background: var(--surface-tertiary) !important; }

        /* Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(0, 233, 122, 0.1);
          border: 1px solid rgba(0, 233, 122, 0.25);
          padding: 6px 14px;
          border-radius: 20px;
        }

        .status-badge .status-dot {
          width: 6px;
          height: 6px;
          background: #00e97a;
          border-radius: 50%;
          margin-right: 8px;
          box-shadow: 0 0 8px rgba(0,233,122,0.8);
        }

        .status-badge .status-text {
          font-size: 13px;
          font-weight: 700;
          color: #00a859;
          letter-spacing: 0.02em;
        }

        /* SaaS Card Base */
        .saas-card {
          border: 1px solid var(--card-border);
          border-radius: 16px;
          transition: all 0.3s ease;
          box-shadow: var(--card-shadow);
        }

        .primary-surface.saas-card {
          box-shadow: var(--card-shadow);
        }

        .saas-card:hover {
          border-color: rgba(0,233,122,0.4);
        }

        .card-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 0px;
        }

        /* Balance Card */
        .balance-card {
          padding: 24px;
        }

        .balance-value {
          font-size: 34px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .balance-meta {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        /* Insight Banner */
        .insight-banner {
          background: rgba(0,233,122,0.08);
          border: 1px solid rgba(0,233,122,0.25);
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 13px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        /* Range Controls */
        .range-controls {
          display: flex;
          gap: 6px;
          background: var(--surface-tertiary);
          border-radius: 8px;
          padding: 4px;
          border: 1px solid var(--card-border);
        }
        .range-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .range-btn:hover { color: var(--text-primary); }
        .range-btn.active {
          background: var(--primary);
          color: #000000;
        }

        /* Quick Actions */
        .quick-action-btn {
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .quick-action-btn:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(0,233,122,0.3);
          box-shadow: 0 10px 30px rgba(0,233,122,0.1);
          transform: translateY(-2px);
        }

        .quick-action-btn i {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .quick-action-btn span {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* Charts Section */
        .chart-legend {
          font-size: 12px;
          color: #94a3b8;
          align-items: center;
        }
        .chart-legend .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          margin-right: 6px;
          display: inline-block;
        }

        .chart-container {
          margin-top: 14px;
        }

        .chart-entrance {
          animation: chartFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(15px);
        }
        @keyframes chartFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Tooltip */
        .custom-tooltip {
          background: var(--surface-primary);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 10px 14px;
          box-shadow: var(--card-shadow);
        }
        .custom-tooltip .label {
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 600;
          margin: 0;
        }

        /* Mini Stats */
        .saas-mini-stat {
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        .saas-mini-stat:hover {
          border-color: rgba(0,233,122,0.4);
        }

        .saas-mini-stat .stat-info {
          display: flex;
          flex-direction: column;
        }
        .saas-mini-stat .stat-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }
        .saas-mini-stat .stat-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          margin-bottom: 2px;
        }
        .stat-growth { font-size: 11px; font-weight: 500; }
        .positive-growth { color: #00e97a; }
        .negative-growth { color: #ef4444; }
        .neutral-growth { color: #64748b; }

        .stat-chart {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Allocation List */
        .allocation-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .allocation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid var(--card-border);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        .allocation-item:hover {
          background: var(--surface-tertiary) !important;
        }
        .allocation-item .color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 12px;
        }
        .allocation-item .item-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .allocation-item .item-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .activity-item {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border: 1px solid var(--card-border);
          border-radius: 12px;
          transition: background 0.2s ease;
        }
        .activity-item:hover {
          background: var(--surface-tertiary) !important;
        }
        .activity-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          margin-right: 14px;
        }
        .activity-details {
          display: flex;
          flex-direction: column;
        }
        .act-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }
        .act-time {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }

        /* Status Strip */
        .system-status-strip {
          background: rgba(0,233,122,0.04);
          border: 1px solid rgba(0,233,122,0.15);
          border-radius: 10px;
          padding: 12px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-icon {
          color: #00e97a;
          margin-right: 10px;
          font-size: 14px;
        }
        .status-msg {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* Spending Block */
        .spending-card {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          transition: background 0.2s ease;
        }
        .spending-card:hover {
          background: var(--surface-primary) !important;
        }

        /* Animations */
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
