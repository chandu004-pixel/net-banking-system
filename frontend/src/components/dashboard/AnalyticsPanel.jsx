import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AnalyticsPanel = ({ chartRange, setChartRange, getPerformanceData, dashboardData, theme, CustomTooltip, gridColor, tickColor, dotBg, pieData }) => {
  return (
    <>
      <Row className="mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Col lg={8} md={12} className="mb-3 mb-lg-0">
          <div className="muted-card h-100 p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <h6 className="section-label mb-0 me-4">ACCOUNT PERFORMANCE</h6>
              </div>
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
                  <Tooltip content={CustomTooltip} cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="value" stroke="var(--text-primary)" strokeWidth={2} fillOpacity={1} fill="url(#primaryGlow)" activeDot={{ r: 4, fill: dotBg, stroke: 'var(--text-primary)', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        <Col lg={4} md={12}>
          <div className="d-flex flex-column gap-3 h-100">
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
              <div className="w-100" style={{ height: '4px', background: 'var(--surface-tertiary)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${dashboardData.cashFlow.percent}%`, background: '#64748b' }}></div>
                <div style={{ width: `${100 - dashboardData.cashFlow.percent}%`, background: '#334155' }}></div>
              </div>
            </div>

            <div className="muted-card p-4 flex-grow-1">
              <h6 className="section-label mb-3">UPCOMING BILLS</h6>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center"><span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>Internet Bill</span></div>
                <div className="text-end">
                  <span className="d-block" style={{ fontSize: '12px', fontWeight: 600 }}>₹1,200</span>
                  <span className="d-block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due in 3 days</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center"><span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>Electricity</span></div>
                <div className="text-end">
                  <span className="d-block" style={{ fontSize: '12px', fontWeight: 600 }}>₹2,450</span>
                  <span className="d-block" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Due in 5 days</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

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
                        cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none"
                      >
                        {(dashboardData.allocation.length > 0 ? dashboardData.allocation : pieData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#cbd5e1', '#94a3b8', '#64748b', '#475569'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip content={CustomTooltip} cursor={{ fill: 'transparent' }} />
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
        
        {/* Placeholder for ActivityFeed which will be appended securely via props from Dashboard */}
        <Col lg={5} md={12} id="activity-feed-slot">
        </Col>
      </Row>
    </>
  );
};

export default AnalyticsPanel;
