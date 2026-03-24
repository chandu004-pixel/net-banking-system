import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CountUp from 'react-countup';
import { BarChart, Bar, ResponsiveContainer } from "recharts";

const BalanceHero = ({ userName, balance, accountDetails, sparkHero, actions, navigate, setTxType, setShowTxModal, setShowBankModal, getGreeting }) => {
  return (
    <>
      <div className="hero-greeting-strip animate-fade-in mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          <div className="greeting-text mb-4 mb-lg-0">
            <h1 className="fw-normal mb-1" style={{ fontSize: '22px', letterSpacing: '-0.01em', color: 'var(--text-secondary)' }}>
              {getGreeting()}, <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{userName}</span>
            </h1>
            <p className="mb-0" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Your financial overview for today</p>
          </div>

          <div className="hero-actions d-flex flex-wrap gap-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                className="glass-pill-btn"
                onClick={() => {
                  if (action.title === 'Deposit') { setTxType('deposit'); setShowTxModal(true); }
                  else if (action.title === 'Withdraw') { setTxType('withdraw'); setShowTxModal(true); }
                  else if (action.title === 'Add Your Bank') { setShowBankModal(true); }
                  else { navigate(action.path); }
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

              <div className="d-flex align-items-center mt-3 gap-3 flex-wrap">
                <span className="badge bg-success bg-opacity-25 text-success px-2 py-1" style={{ border: '1px solid rgba(0,233,122,0.3)' }}>
                  <i className="fas fa-arrow-up me-1"></i> 12% Month
                </span>
                <span className="text-white px-3 py-1 shadow-sm" style={{ fontSize: '13px', background: 'rgba(25,188,253,0.1)', borderRadius: '6px', border: '1px solid rgba(25,188,253,0.3)' }}>
                  <i className="fas fa-university text-[#19bcfd] me-2"></i> ACC: <span className="text-white fw-bold mx-1" style={{ letterSpacing: '1px' }}>{accountDetails?.account || 'Pending'}</span>
                </span>
                <span className="text-white px-3 py-1 shadow-sm" style={{ fontSize: '13px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  IFSC: <span className="text-white fw-bold" style={{ letterSpacing: '1px' }}>{accountDetails?.ifsc || 'NEXB0000001'}</span>
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

            <div className="hero-decoration"></div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BalanceHero;
