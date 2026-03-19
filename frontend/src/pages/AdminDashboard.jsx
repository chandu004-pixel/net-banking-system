import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import CountUp from 'react-countup';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from "recharts";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [kycStats, setKycStats] = useState({ total: 0, pending: 0, verified: 0 });
  const [adminStats, setAdminStats] = useState({
      systemLiquidity: 0,
      activeUsers: 0,
      txVolumeData: [
        { day: "Mon", vol: 0 }, { day: "Tue", vol: 0 }, { day: "Wed", vol: 0 },
        { day: "Thu", vol: 0 }, { day: "Fri", vol: 0 }, { day: "Sat", vol: 0 }, { day: "Sun", vol: 0 }
      ],
      recentFlags: [
        { id: 'FLG-8821', type: 'Velocity Limit', user: 'u_9812A', risk: 'High', time: '10 mins ago' },
        { id: 'FLG-8820', type: 'Login Location', user: 'u_1104C', risk: 'Medium', time: '1 hr ago' },
        { id: 'FLG-8819', type: 'Large Transfer', user: 'u_4402Z', risk: 'Low', time: '3 hrs ago' }
      ]
  });
  const [loading, setLoading] = useState(true);

  const isLight = theme === 'light';
  const userName = localStorage.getItem('userName') || 'Super Admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resKyc = await api.get('/kyc');
        if (resKyc.data.success) {
          const records = resKyc.data.data;
          setKycStats({
            total: records.length,
            pending: records.filter(r => r.status === 'Pending').length,
            verified: records.filter(r => r.status === 'Verified').length
          });
        }
        
        const resAdmin = await api.get('/users/admin/stats');
        setAdminStats(prev => ({
            systemLiquidity: resAdmin.data.systemLiquidity || 0,
            activeUsers: resAdmin.data.activeUsers || 0,
            txVolumeData: resAdmin.data.txVolumeData || prev.txVolumeData,
            recentFlags: resAdmin.data.recentFlags || prev.recentFlags
        }));

      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kycFunnelData = [
    { name: 'Approved', value: kycStats.verified > 0 ? kycStats.verified : 0.1 },
    { name: 'Pending', value: kycStats.pending > 0 ? kycStats.pending : 0.1 },
    { name: 'Rejected', value: 0 },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-subtle)', padding: '10px 15px', borderRadius: '8px', color: 'var(--text-primary)' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>{`${label || payload[0].name} : ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      padding: '100px 20px 40px',
      minHeight: '100vh',
      background: isLight ? '#f4f7fb' : '#0b0f14',
      transition: 'background 0.3s ease',
      color: 'var(--text-primary)'
    }}>
      <Container fluid className="px-4 px-lg-5">
        
        {/* GLOBAL COMMAND CENTER HEADER */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 animate-fade-in">
          <div>
            <div className="d-flex align-items-center mb-2">
                <Badge bg="danger" className="me-2" style={{ letterSpacing: '2px', fontSize: '10px', padding: '5px 8px' }}>SUPERADMIN</Badge>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>GLOBAL COMMAND CENTER</span>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '28px', letterSpacing: '-0.5px', marginBottom: '4px' }}>
                System Overview, <span style={{ color: '#19bcfd' }}>{userName}</span>
            </h2>
          </div>
          <div className="d-flex gap-3 mt-3 mt-lg-0">
             <Button variant="outline-danger" className="border-danger text-danger fw-bold shadow-sm" style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px' }}>
                <i className="fas fa-lock me-2"></i> Lock System
             </Button>
             <Button 
                onClick={() => navigate('/viewkyc')}
                className="border-0 px-4 py-2 shadow-[0_15px_30px_rgba(25,188,253,0.3)] hover:scale-105 transition duration-300"
                style={{ background: 'linear-gradient(135deg, #19bcfd, #3b82f6)', borderRadius: '10px', fontWeight: 700 }}
            >
                KYC Repository <i className="fas fa-arrow-right ms-2"></i>
            </Button>
          </div>
        </div>

        {/* PRIMARY METRICS ROW */}
        <Row className="mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Liquidity Card */}
          <Col lg={8} md={12} className="mb-3 mb-lg-0">
            <div className="p-[30px] d-flex flex-column flex-md-row justify-content-between align-items-center position-relative overflow-hidden" 
                 style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div className="z-1">
                <h6 className="opacity-75 mb-2 tracking-wider uppercase text-white" style={{ fontSize: '11px', fontWeight: 600 }}>Total System Liquidity</h6>
                <div className="d-flex align-items-baseline mb-1">
                  <span className="text-[#00e97a] me-2" style={{ fontSize: '28px', fontWeight: 500 }}>₹</span>
                  <h2 className="mb-0 text-white" style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-1px' }}>
                    <CountUp end={adminStats.systemLiquidity} duration={2} separator="," />
                  </h2>
                </div>
                <div className="d-flex align-items-center mt-3">
                  <span className="badge bg-success bg-opacity-25 text-success me-3 px-2 py-1" style={{ border: '1px solid rgba(0,233,122,0.3)' }}>
                    <i className="fas fa-arrow-up me-1"></i> +4.2% YoY
                  </span>
                  <span className="text-white opacity-75" style={{ fontSize: '13px' }}>
                    <i className="fas fa-server text-[#19bcfd] me-1"></i> Node Status: Deep Green
                  </span>
                </div>
              </div>
              <div className="z-1 mt-4 mt-md-0 d-flex flex-column align-items-end" style={{ width: '250px' }}>
                   <div style={{ height: '80px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={adminStats.txVolumeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#19bcfd" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#19bcfd" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="vol" stroke="#19bcfd" fillOpacity={1} fill="url(#colorVol)" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
              </div>
              {/* Decoration Glow */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(25,188,253,0.15) 0%, transparent 70%)', transform: 'translate(-50%, -50%)', zIndex: 0 }}></div>
            </div>
          </Col>

          {/* Active Users Card */}
          <Col lg={4} md={12}>
            <div className="p-[30px] d-flex flex-column justify-content-center h-100 position-relative" 
                 style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(0,233,122,0.1)', borderRadius: '50%' }}></div>
                 <div className="d-flex align-items-center mb-4 z-1">
                    <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(0,233,122,0.1)', color: '#00e97a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                        <i className="fas fa-users-cog"></i>
                    </div>
                    <h6 className="ms-3 mb-0 uppercase" style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '12px', letterSpacing:'1px' }}>Global Userbase</h6>
                 </div>
                 <div className="z-1">
                     <h2 style={{ fontWeight: 800, fontSize: '48px', margin: 0 }}>
                         <CountUp end={adminStats.activeUsers} duration={2} separator="," />
                     </h2>
                     <p className="mt-2 mb-0" style={{ color: '#00e97a', fontWeight: 600, fontSize: '13px' }}><i className="fas fa-caret-up"></i> 1,204 this week</p>
                 </div>
            </div>
          </Col>
        </Row>

        {/* OPERATIONS GRID */}
        <Row className="mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          {/* Main Chart: Global Transaction Volume */}
          <Col lg={8} md={12} className="mb-3 mb-lg-0">
             <div className="p-4 h-100" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                   <h6 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }} className="uppercase m-0">Global Transaction Velocity (7D)</h6>
                   <Badge bg="secondary" text="light">Live Sync</Badge>
                </div>
                <div style={{ height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adminStats.txVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                            <Bar dataKey="vol" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>
          </Col>

          {/* KYC Funnel Overview */}
          <Col lg={4} md={12}>
             <div className="p-4 h-100 d-flex flex-column" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                <h6 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }} className="uppercase mb-3">KYC Pipeline Analytics</h6>
                
                <div style={{ height: '180px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={kycFunnelData}
                                cx="50%" cy="50%"
                                innerRadius={50} outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {kycFunnelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-auto d-flex flex-column gap-2">
                    {kycFunnelData.map((entry, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center p-2 rounded-3" style={{ background: 'var(--surface-tertiary)' }}>
                            <div className="d-flex align-items-center">
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index], marginRight: '10px' }}></div>
                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{entry.name}</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 700 }}>{loading ? '-' : entry.value}</span>
                        </div>
                    ))}
                </div>
             </div>
          </Col>
        </Row>

        {/* SECURITY & AML FRAMEWORK */}
        <Row className="mb-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Col lg={12}>
                <div className="p-4" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(239,68,68,0.05)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center">
                            <div style={{ width: '40px', height: '40px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginRight: '15px' }}>
                                <i className="fas fa-satellite-dish fa-pulse"></i>
                            </div>
                            <div>
                                <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>AML & Fraud Radar</h5>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time algorithmic risk detection</span>
                            </div>
                        </div>
                        <Button 
                            onClick={() => navigate('/admin/review')}
                            variant="primary" 
                            size="sm" 
                            className="border-0 px-4 py-2 shadow-sm transition hover:translate-y-[-2px]" 
                            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}
                        >
                            <i className="fas fa-microscope me-2"></i> Review Flagged
                        </Button>
                    </div>

                    <div className="table-responsive">
                        <table className="w-100" style={{ minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <th className="py-3 px-2" style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>FLAG ID</th>
                                    <th className="py-3 px-2" style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>TRIGGER TYPE</th>
                                    <th className="py-3 px-2" style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>USER ALIAS</th>
                                    <th className="py-3 px-2" style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>RISK SCORE</th>
                                    <th className="py-3 px-2 text-end" style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>TIME DETECTED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminStats.recentFlags.map((flag, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s cursor-pointer' }} className="hover:bg-white/5">
                                        <td className="py-3 px-2" style={{ fontSize: '13px', fontWeight: 600, color: '#19bcfd' }}>{flag.id}</td>
                                        <td className="py-3 px-2" style={{ fontSize: '13px', fontWeight: 500 }}>{flag.type}</td>
                                        <td className="py-3 px-2" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}><i className="fas fa-user-secret me-2 opacity-50"></i>{flag.user}</td>
                                        <td className="py-3 px-2">
                                            <Badge bg={flag.risk === 'High' ? 'danger' : flag.risk === 'Medium' ? 'warning' : 'info'} className="px-3 py-1" style={{ borderRadius: '6px', fontWeight: 600 }}>
                                                {flag.risk}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-2 text-end" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{flag.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Col>
        </Row>
        {/* INFRASTRUCTURE & API GATEWAY */}
        <Row className="mb-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Col lg={4} md={6} className="mb-3 mb-lg-0">
               <div className="p-4 h-100" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                  <h6 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }} className="uppercase mb-4"><i className="fas fa-server me-2"></i>Server Load Allocation</h6>
                  <div className="d-flex justify-content-between mb-2">
                     <span style={{ fontSize: '12px', fontWeight: 600 }}>US-EAST-1 (Core)</span>
                     <span style={{ fontSize: '12px', color: '#00e97a', fontWeight: 700 }}>42%</span>
                  </div>
                  <div className="w-100 mb-4" style={{ height: '6px', background: 'var(--surface-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                     <div style={{ width: '42%', height: '100%', background: '#00e97a', borderRadius: '3px' }}></div>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                     <span style={{ fontSize: '12px', fontWeight: 600 }}>EU-WEST-2 (Backup)</span>
                     <span style={{ fontSize: '12px', color: '#19bcfd', fontWeight: 700 }}>18%</span>
                  </div>
                  <div className="w-100 mb-4" style={{ height: '6px', background: 'var(--surface-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                     <div style={{ width: '18%', height: '100%', background: '#19bcfd', borderRadius: '3px' }}></div>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                     <span style={{ fontSize: '12px', fontWeight: 600 }}>AP-SOUTH-1 (Edge)</span>
                     <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>68%</span>
                  </div>
                  <div className="w-100" style={{ height: '6px', background: 'var(--surface-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                     <div style={{ width: '68%', height: '100%', background: '#f59e0b', borderRadius: '3px' }}></div>
                  </div>
               </div>
            </Col>

            <Col lg={8} md={6}>
               <div className="p-4 h-100 d-flex flex-column justify-content-between" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                     <h6 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }} className="uppercase mb-0"><i className="fas fa-terminal me-2"></i>Live System Terminal</h6>
                     <span className="badge bg-dark border border-secondary" style={{ fontSize: '10px' }}><i className="fas fa-circle text-success me-1" style={{ fontSize: '8px' }}></i>CONNECTED</span>
                  </div>
                  <div style={{ background: '#07090c', border: '1px solid #1e293b', borderRadius: '12px', padding: '15px', flexGrow: 1, fontFamily: 'monospace', fontSize: '12px', color: '#00e97a', overflowY: 'hidden' }}>
                      <p className="mb-2" style={{ margin: 0 }}><span style={{ color: '#94a3b8' }}>[{new Date().toLocaleTimeString('en-US', {hour12: false}).replace(/(.*)\D\d+/, '$1')}:42]</span> <span style={{ color: '#3b82f6' }}>INFO</span> : Re-evaluating KYC endpoints...</p>
                      <p className="mb-2" style={{ margin: 0 }}><span style={{ color: '#94a3b8' }}>[{new Date().toLocaleTimeString('en-US', {hour12: false}).replace(/(.*)\D\d+/, '$1')}:45]</span> <span style={{ color: '#3b82f6' }}>INFO</span> : 3 new requests received for verification.</p>
                      <p className="mb-2" style={{ margin: 0 }}><span style={{ color: '#94a3b8' }}>[{new Date().toLocaleTimeString('en-US', {hour12: false}).replace(/(.*)\D\d+/, '$1')}:49]</span> <span style={{ color: '#f59e0b' }}>WARN</span> : High latency detected in API Gateway (412ms).</p>
                      <p className="mb-2" style={{ margin: 0 }}><span style={{ color: '#94a3b8' }}>[{new Date().toLocaleTimeString('en-US', {hour12: false}).replace(/(.*)\D\d+/, '$1')}:52]</span> <span style={{ color: '#3b82f6' }}>INFO</span> : Scaling read replicas up by 2 instances.</p>
                      <p className="mb-2" style={{ margin: 0 }}><span style={{ color: '#94a3b8' }}>[{new Date().toLocaleTimeString('en-US', {hour12: false}).replace(/(.*)\D\d+/, '$1')}:58]</span> <span style={{ color: '#10b981' }}>OK</span> : Scaling complete. Latency normalized (35ms).</p>
                      <p className="mb-0 blink-cursor" style={{ margin: 0 }}>_</p>
                  </div>
               </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
