import React from 'react';
import { Container, Button, Row, Col, Badge } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Investments = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';

    const data = [
        { time: 'Jan', val: 4000 }, { time: 'Feb', val: 4500 }, { time: 'Mar', val: 4200 },
        { time: 'Apr', val: 5100 }, { time: 'May', val: 5900 }, { time: 'Jun', val: 6800 },
    ];

    const stocks = [
        { ticker: 'AAPL', name: 'Apple Inc.', price: '$189.50', change: '+1.2%', up: true },
        { ticker: 'TSLA', name: 'Tesla Motors', price: '$210.40', change: '-3.4%', up: false },
        { ticker: 'NVDA', name: 'Nvidia Corp.', price: '$495.20', change: '+5.7%', up: true },
        { ticker: 'BTC', name: 'Bitcoin', price: '$64,200', change: '+2.1%', up: true },
    ];

    return (
        <div style={{
            padding: '120px 20px 40px',
            minHeight: '100vh',
            background: isLight ? '#f4f7fb' : 'var(--bg-dashboard)',
            color: 'var(--text-primary)',
            transition: 'background 0.3s ease'
        }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                    <div>
                        <h2 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Wealth Management</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Track and grow your investment portfolio.</p>
                    </div>
                </div>

                <Row className="animate-slide-up">
                    <Col lg={8} md={12} className="mb-4">
                        <div className="p-4" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h6 style={{ fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '12px' }}>Total Portfolio Value</h6>
                                    <h2 style={{ fontWeight: 800, margin: 0, color: '#8b5cf6' }}>$142,504.20</h2>
                                </div>
                                <Badge bg="success" className="px-3 py-2" style={{ fontSize: '13px' }}>+ 12.4% (YTD)</Badge>
                            </div>
                            
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: 'var(--surface-primary)', borderColor: 'var(--border-subtle)' }} />
                                        <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorInvest)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Col>

                    <Col lg={4} md={12}>
                        <div className="p-4 h-100" style={{ background: isLight ? '#fff' : 'var(--surface-primary)', border: isLight ? '1px solid #e9eef5' : '1px solid var(--card-border)', borderRadius: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 style={{ fontWeight: 700, margin: 0 }}><i className="fas fa-chart-line me-2 text-[#8b5cf6]"></i> Watchlist</h5>
                                <Button variant="link" className="p-0 text-decoration-none" style={{ fontSize: '13px', color: 'var(--primary)' }}>View All</Button>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {stocks.map((stock, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center p-3" style={{ background: 'var(--surface-tertiary)', borderRadius: '16px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div className="d-flex align-items-center">
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '10px', marginRight: '15px' }}>
                                                {stock.ticker}
                                            </div>
                                            <div>
                                                <h6 style={{ fontWeight: 700, margin: 0 }}>{stock.ticker}</h6>
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stock.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <h6 style={{ fontWeight: 700, margin: 0 }}>{stock.price}</h6>
                                            <span style={{ fontSize: '11px', fontWeight: 600, color: stock.up ? '#10b981' : '#ef4444' }}>
                                                <i className={`fas fa-caret-${stock.up ? 'up' : 'down'} me-1`}></i> {stock.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <Button className="w-100 mt-4 fw-bold border-0" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                <i className="fas fa-plus me-2"></i> Add Symbol
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Investments;
