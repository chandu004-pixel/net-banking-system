import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { Container, Row, Col, Modal, Button, Spinner } from 'react-bootstrap';
import CountUp from 'react-countup';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

      // Real API calls
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

  const pieData = [
    { name: 'Savings', value: 45000 },
    { name: 'Business', value: 25000 },
    { name: 'Investments', value: 15000 },
    { name: 'Loans', value: 5000 },
  ];

  const sparkHero = [{ val: 10 }, { val: 25 }, { val: 15 }, { val: 30 }, { val: 25 }, { val: 40 }, { val: 45 }, { val: 35 }, { val: 50 }];

  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txLoading, setTxLoading] = useState(false);

  const handleTransaction = async (e) => {
    e.preventDefault();
    setTxLoading(true);
    try {
      if (txType === 'deposit') {
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

        {/* HERO SECTION: Greeting & Actions */}
        <div className="hero-greeting-strip animate-fade-in mb-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div className="greeting-text mb-4 mb-lg-0">
              <h1 className="fw-normal mb-1" style={{ fontSize: '22px', letterSpacing: '-0.01em', color: 'var(--text-secondary)' }}>
                {getGreeting()}, <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{userName}</span>
              </h1>
              <p className="mb-0" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Your financial overview for today</p>
            </div>

            <div className="hero-actions d-flex flex-wrap gap-2">
              {actions.filter(a => ['Add KYC', 'Deposit', 'Withdraw'].includes(a.title)).map((action, idx) => (
                <button
                  key={idx}
                  className="glass-pill-btn"
                  onClick={() => {
                    if (action.title === 'Deposit') {
                      setTxType('deposit'); setShowTxModal(true);
                    } else if (action.title === 'Withdraw') {
                      setTxType('withdraw'); setShowTxModal(true);
                    } else {
                      navigate(action.path);
                    }
                  }}
                  title={action.title}
                >
                  <i className={`${action.icon}`} style={{ color: action.color }}></i>
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 1: HERO - Balance */}
        <Row className="mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Col lg={12}>
            <div className="hero-balance-card p-[30px] d-flex flex-column flex-md-row justify-content-between align-items-center position-relative overflow-hidden">
              <div className="z-1">
                <h6 className="hero-label opacity-75 mb-2 tracking-wider uppercase" style={{ fontSize: '11px', fontWeight: 600 }}>Available Balance</h6>
                <div className="d-flex align-items-baseline mb-1">
                  <span className="text-white me-2" style={{ fontSize: '24px', fontWeight: 500 }}>₹</span>
                  <h2 className="hero-value mb-0 text-white shadow-sm" style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1px' }}>
                    <CountUp end={balance} duration={1.5} separator="," />
                  </h2>
                </div>

                <div className="d-flex align-items-center mt-3">
                  <span className="badge bg-success bg-opacity-25 text-success me-3 px-2 py-1" style={{ border: '1px solid rgba(0,233,122,0.3)' }}>
                    <i className="fas fa-arrow-up me-1"></i> 12% Month
                  </span>
                  <span className="text-white opacity-75" style={{ fontSize: '13px' }}>
                    <i className="fas fa-check-circle text-success me-1"></i> Savings Account • Active
                  </span>
                </div>
              </div>

              <div className="z-1 mt-4 mt-md-0 d-flex flex-column align-items-end" style={{ width: '200px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '8px' }}>30-DAY TREND</span>
                <div style={{ height: '60px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sparkHero} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <Bar dataKey="val" fill="#00e97a" radius={[2, 2, 0, 0]} style={{ filter: "drop-shadow(0px 2px 4px rgba(0,233,122,0.6))" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hero Decoration */}
              <div className="hero-decoration"></div>
            </div>
          </Col>
        </Row>


        {/* Dynamic Advertisement Slider (Dimensionized 3-Column) */}
        <div className="ad-slider-container mb-4 overflow-hidden position-relative animate-fade-in" style={{ background: 'transparent', height: '180px', animationDelay: '0.15s' }}>
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
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }}></div>
                    <img src={ad.img} alt={ad.theme} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', zIndex: 2 }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: '#00e97a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{ad.tag}</span>
                      <h5 style={{ margin: '0 0 8px 0', fontWeight: 600, fontSize: '14px', color: '#fff' }}>{ad.theme}</h5>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Navigation Controls (Top Right) */}
          <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 3, display: 'flex', gap: '6px' }}>
            {adGroups.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveAdGroup(idx)}
                style={{
                  width: activeAdGroup === idx ? '24px' : '8px',
                  height: '4px',
                  borderRadius: '2px',
                  background: activeAdGroup === idx ? '#fff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        {/* SECTION 2: Primary Insight (Performance) */}
        <Row className="mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Col lg={8} md={12} className="mb-3 mb-lg-0">
            <div className="muted-card h-100 p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <h6 className="section-label mb-0 me-4">ACCOUNT PERFORMANCE</h6>
                </div>
                {/* Date Range Control */}
                <div className="subtle-range-controls">
                  {['7D', '1M', '3M', '1Y'].map(range => (
                    <button
                      key={range}
                      className={`subtle-range-btn ${chartRange === range ? 'active' : ''}`}
                      onClick={() => setChartRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-container" style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getPerformanceData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="primaryGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--text-primary)" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="var(--text-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--text-primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#primaryGlow)"
                      activeDot={{ r: 4, fill: dotBg, stroke: 'var(--text-primary)', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>

          {/* Right Column of Section 2 - Minimized Cash Flow & Bills */}
          <Col lg={4} md={12}>
            <div className="d-flex flex-column gap-3 h-100">
              {/* Minimized Cash Flow */}
              <div className="muted-card p-4 flex-grow-1">
                <h6 className="section-label mb-3">CASH FLOW OVERVIEW</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Inflow</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>₹{dashboardData.cashFlow.inflow.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Outflow</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>₹{dashboardData.cashFlow.outflow.toLocaleString()}</span>
                </div>

                {/* Quiet stacked bar */}
                <div className="w-100" style={{ height: '4px', background: 'var(--surface-tertiary)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${dashboardData.cashFlow.percent}%`, background: '#64748b' }}></div>
                  <div style={{ width: `${100 - dashboardData.cashFlow.percent}%`, background: '#334155' }}></div>
                </div>
              </div>

              {/* Upcoming Bills Tiny */}
              <div className="muted-card p-4 flex-grow-1">
                <h6 className="section-label mb-3">UPCOMING BILLS</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>Internet Bill</span>
                  </div>
                  <div className="text-end">
                    <span className="d-block" style={{ fontSize: '12px', fontWeight: 600 }}>₹1,200</span>
                    <span className="d-block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due in 3 days</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>Electricity</span>
                  </div>
                  <div className="text-end">
                    <span className="d-block" style={{ fontSize: '12px', fontWeight: 600 }}>₹2,450</span>
                    <span className="d-block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due in 5 days</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* SECTION 3: Secondary Insights (Allocation & Weekly) */}
        <Row className="mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Col lg={7} md={12} className="mb-3 mb-lg-0">
            <div className="muted-card h-100 p-4">
              <h6 className="section-label mb-4">ASSET ALLOCATION</h6>
              <Row className="align-items-center">
                <Col xs={5}>
                  <div style={{ height: '140px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.allocation.length > 0 ? dashboardData.allocation : pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {(dashboardData.allocation.length > 0 ? dashboardData.allocation : pieData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#cbd5e1', '#94a3b8', '#64748b', '#475569'][index % 4]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
                <Col xs={7}>
                  <div className="quiet-allocation-list">
                    {(dashboardData.allocation.length > 0 ? dashboardData.allocation : pieData).map((entry, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <div className="d-flex align-items-center">
                          <span style={{ backgroundColor: ['#cbd5e1', '#94a3b8', '#64748b', '#475569'][index % 4], width: '6px', height: '6px', borderRadius: '50%', marginRight: '8px' }}></span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{entry.name}</span>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>₹{entry.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={5} md={12}>
            <div className="muted-card h-100 p-4 d-flex flex-column">
              <h6 className="section-label mb-3">RECENT ACTIVITY</h6>
              <div className="recent-activity-scroll flex-grow-1" style={{ maxHeight: '130px', overflowY: 'auto', paddingRight: '5px' }}>
                {dashboardData.recentActivity.map((activity, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between py-2 mb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="d-flex align-items-center">
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{activity.title}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activity.time}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: activity.amount.startsWith('+') ? '#cbd5e1' : 'var(--text-primary)' }}>
                      {activity.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Divider Layer for Insights */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 233, 122, 0.2), transparent)',
          margin: '40px 0 30px',
          opacity: 0.5
        }}></div>

        {/* SECTION 4: Financial Insights (Intelligence Layer) */}
        <Row className="mb-5 animate-slide-up" style={{ animationDelay: '0.45s' }}>
          <Col lg={12}>
            <div className="insights-section">
              <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                  <h4 className="section-title d-flex align-items-center mb-1" style={{ fontSize: '18px', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
                    <i className="fas fa-brain me-2 text-primary-accent" style={{ fontSize: '14px' }}></i> Financial Insights
                  </h4>
                  <p className="section-subtitle mb-0" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    AI-powered analysis of your recent behavioral patterns.
                  </p>
                </div>
                <span className="insight-timestamp">Generated just now</span>
              </div>

              <Row className="g-3">
                {/* Hero Insight (Stability Score) - Spans 6 columns */}
                <Col lg={6} md={12}>
                  <div className="insight-card hero-insight h-100 p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4 w-100">
                      <div className="d-flex align-items-center">
                        <div className="insight-icon info shadow-sm">
                          <i className="fas fa-shield-alt"></i>
                        </div>
                        <div className="ms-3">
                          <h6 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Financial Stability</h6>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Health Score</span>
                        </div>
                      </div>
                      <div className="stability-score">
                        <span className="score-val text-primary-accent">82</span>
                        <span className="score-max">/100</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                      Your income comfortably covers your expenses with a healthy surplus. You are positioned well for emergency fund accumulation this month.
                    </p>

                    <div className="w-100 position-relative mt-auto" style={{ height: '6px', background: 'var(--surface-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div className="progress-glow-bar" style={{ width: '82%', height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                </Col>

                {/* Secondary Insights - Stacked in remaining 6 columns */}
                <Col lg={6} md={12}>
                  <div className="d-flex flex-column gap-3 h-100">

                    {/* Secondary Insight 1 */}
                    <div className="insight-card actionable-insight flex-grow-1 p-3">
                      <div className="d-flex align-items-center w-100">
                        <div className="insight-icon success me-3">
                          <i className="fas fa-lightbulb"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Smart Suggestion</h6>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '0', lineHeight: '1.4' }}>
                            Reduce subscription costs by ₹500/month to save <span className="text-primary-accent fw-bold">₹6,000 annually</span>.
                          </p>
                        </div>
                        <button className="insight-action-btn ms-3 shrink-0">
                          Review <i className="fas fa-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>

                    {/* Secondary Insight 2 */}
                    <div className="insight-card actionable-insight flex-grow-1 p-3">
                      <div className="d-flex align-items-center w-100">
                        <div className="insight-icon warning me-3">
                          <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Spending Increased</h6>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '0', lineHeight: '1.4' }}>
                            You spent <span className="text-danger fw-bold">18% more</span> this month, primarily in Food & Dining.
                          </p>
                        </div>
                        <button className="insight-action-btn border-danger text-danger ms-3 shrink-0" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                          Details <i className="fas fa-chevron-right ms-1"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>


        {/* Intelligent Footer / Security Panel */}
        <div className="dashboard-footer mt-5 pb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <i className="fas fa-shield-check me-2 text-primary-accent" style={{ fontSize: '16px' }}></i>
              <div>
                <span className="d-block text-primary-accent" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Active Terminal • Secured by NexBank</span>
                <span className="d-block" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>256-bit encryption active. Last login IP: 192.168.1.1</span>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <span className="status-blink me-2"></span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sync completed 2s ago</span>
            </div>
          </div>
        </div>

      </Container>


      {/* Transaction Modal */}
      <Modal show={showTxModal} onHide={() => setShowTxModal(false)} centered contentClassName={theme === 'dark' ? "bg-[#111821] border-white/10" : ""}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <Modal.Title style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>
            {txType === 'deposit' ? 'Fast Deposit' : 'Secure Withdrawal'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form onSubmit={handleTransaction}>
            <div className="mb-4">
              <label className="d-block mb-2 text-muted uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 600 }}>Amount (INR)</label>
              <div className="position-relative">
                <span className="position-absolute translate-middle-y" style={{ left: '16px', top: '50%', color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-100 py-3 ps-5 border-0 rounded-3 fw-bold"
                  style={{ background: 'var(--surface-tertiary)', fontSize: '20px', outline: 'none', color: 'var(--text-primary)' }}
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            {txType === 'deposit' ? (
              <div className="p-3 mb-4 rounded-3" style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)' }}>
                <p className="small mb-0 text-muted" style={{ fontSize: '12px' }}>Deposits are handled securely via our payment gateway. You will be redirected to the transfer page.</p>
              </div>
            ) : (
              <div className="p-3 mb-4 rounded-3" style={{ background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)' }}>
                <p className="small mb-0 text-muted" style={{ fontSize: '12px' }}>Withdrawals are processed instantly to your linked bank account. Minimum ₹100 required.</p>
              </div>
            )}
            <Button
              type="submit"
              disabled={txLoading}
              className="w-100 py-3 border-0 fw-600"
              style={{
                background: txType === 'deposit' ? 'var(--text-primary)' : 'var(--text-primary)',
                color: 'var(--bg-dashboard)',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              {txLoading ? <Spinner size="sm" /> : txType === 'deposit' ? 'Proceed to Deposit' : 'Confirm Withdrawal'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <style>{`
        /* Professional Neutral Color Strategy */
        :root {
            --border-subtle: rgba(255,255,255,0.08); /* Fallback for light mode override later */
        }
        [data-theme='dark'] {
             --border-subtle: rgba(255,255,255,0.06);
        }
        [data-theme='light'] {
             --border-subtle: rgba(0,0,0,0.06);
        }

        /* Root & Typography */
        .saas-dashboard {
          background-color: var(--bg-dashboard);
          color: var(--text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-height: 100vh;
          padding: 90px 0 50px 0;
        }

        .saas-dashboard h1 {
          font-size: 24px;
          margin-bottom: 4px;
          color: var(--text-secondary);
          letter-spacing: -0.01em;
          font-weight: 500;
        }

        .saas-dashboard p {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 0;
          font-weight: 400;
        }

        /* Hero Balance Block (The only colorful element) */
        .hero-balance-card {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        [data-theme='light'] .hero-balance-card {
            background: linear-gradient(135deg, #001a11 0%, #003322 100%);
        }

        .hero-decoration {
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background: radial-gradient(circle at top right, rgba(0,233,122,0.15), transparent 50%);
            pointer-events: none;
        }

        /* Muted Professional Cards for everything else */
        .muted-card {
            background: var(--surface-secondary);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
            transition: border-color 0.2s;
        }
        .muted-card:hover {
            border-color: rgba(148, 163, 184, 0.3); /* Subtle grey hover, not neon */
        }

        .section-label {
            font-size: 10px;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 0;
        }

        /* Hero Greeting Strip */
        .hero-greeting-strip {
          position: relative;
          padding: 24px;
          border-radius: 16px;
          background: var(--surface-primary);
          border: 1px solid var(--border-subtle);
          overflow: hidden;
        }
        .hero-greeting-strip::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to bottom, rgba(0,233,122,0.04), transparent);
          pointer-events: none;
        }

        /* Glass Pill Buttons */
        .glass-pill-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        [data-theme='light'] .glass-pill-btn {
          background: rgba(0, 0, 0, 0.02);
        }
        .glass-pill-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 233, 122, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 233, 122, 0.1);
        }
        [data-theme='light'] .glass-pill-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        /* Range Controls Subtle */
        .subtle-range-controls {
            display: flex;
            gap: 4px;
            background: var(--surface-tertiary);
            border-radius: 6px;
            padding: 3px;
        }
        .subtle-range-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 10px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .subtle-range-btn:hover { color: var(--text-primary); }
        .subtle-range-btn.active {
            background: var(--surface-primary);
            color: var(--text-primary);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Scrollbars */
        .recent-activity-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .recent-activity-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .recent-activity-scroll::-webkit-scrollbar-thumb {
            background: var(--border-subtle);
            border-radius: 4px;
        }

        /* Status Strip */
        .system-status-strip {
          background: transparent;
          border-top: 1px solid var(--border-subtle);
          padding-top: 16px;
        }

        /* Animations */
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        
        /* Remove Default Link Outlines */
        button:focus { outline: none; }

        /* Insights Cards */
        .insight-card {
          display: flex;
          align-items: flex-start;
          background: var(--surface-primary);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .insight-card:hover {
          transform: translateY(-2px);
          border-color: rgba(148, 163, 184, 0.3);
        }

        .insight-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 14px;
          flex-shrink: 0;
        }

        .insight-icon.success {
          background: rgba(0, 233, 122, 0.1);
          color: #00e97a;
        }

        .insight-icon.warning {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444; /* Changed to red to match text */
        }

        /* New Insight Styling */
        .insight-timestamp {
          font-size: 10px;
          color: var(--text-muted);
          background: var(--surface-tertiary);
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: 500;
        }

        .hero-insight {
          background: var(--surface-secondary);
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
          box-shadow: 0 4px 25px rgba(0,0,0,0.2), inset 0 0 40px rgba(59, 130, 246, 0.03);
          position: relative;
          overflow: hidden;
          flex-direction: column;
          align-items: stretch;
        }
        
        .hero-insight:hover {
           transform: translateY(-4px) scale(1.01);
           border-color: rgba(59, 130, 246, 0.4) !important;
        }

        .stability-score .score-val {
          font-size: 28px;
          font-weight: 800;
        }
        .stability-score .score-max {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .progress-glow-bar {
          position: relative;
        }
        .progress-glow-bar::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .actionable-insight:hover .insight-action-btn {
           background: var(--primary);
           color: #000;
           border-color: var(--primary);
        }

        .insight-action-btn {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .shrink-0 { flex-shrink: 0; }

        /* Fancy animations */
        .animate-slide-up {
           animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
           opacity: 0;
           transform: translateY(30px);
        }
        @keyframes slideUpFade {
           to { opacity: 1; transform: translateY(0); }
        }

        .status-blink {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00e97a;
          box-shadow: 0 0 8px #00e97a;
          animation: blinker 2s linear infinite;
        }
        @keyframes blinker {
          50% { opacity: 0.3; }
        }

      `}</style>
    </div>
  );
};

export default Dashboard;
