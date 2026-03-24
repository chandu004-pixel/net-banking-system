import React from 'react';
import { Row, Col } from 'react-bootstrap';

const FinancialInsights = () => {
  return (
    <>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0, 233, 122, 0.2), transparent)', margin: '40px 0 30px', opacity: 0.5 }}></div>

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
              <Col lg={6} md={12}>
                <div className="insight-card hero-insight h-100 p-4">
                  <div className="d-flex justify-content-between align-items-start mb-4 w-100">
                    <div className="d-flex align-items-center">
                      <div className="insight-icon info shadow-sm"><i className="fas fa-shield-alt"></i></div>
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

              <Col lg={6} md={12}>
                <div className="d-flex flex-column gap-3 h-100">
                  <div className="insight-card actionable-insight flex-grow-1 p-3">
                    <div className="d-flex align-items-center w-100">
                      <div className="insight-icon success me-3"><i className="fas fa-lightbulb"></i></div>
                      <div className="flex-grow-1">
                        <h6 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Smart Suggestion</h6>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '0', lineHeight: '1.4' }}>
                          Reduce subscription costs by ₹500/month to save <span className="text-primary-accent fw-bold">₹6,000 annually</span>.
                        </p>
                      </div>
                      <button className="insight-action-btn ms-3 shrink-0">Review <i className="fas fa-arrow-right ms-1"></i></button>
                    </div>
                  </div>

                  <div className="insight-card actionable-insight flex-grow-1 p-3">
                    <div className="d-flex align-items-center w-100">
                      <div className="insight-icon warning me-3"><i className="fas fa-chart-line"></i></div>
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
    </>
  );
};

export default FinancialInsights;
