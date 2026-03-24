import React from 'react';
import { Col } from 'react-bootstrap';

const ActivityFeed = ({ dashboardData }) => {
  return (
    <Col lg={5} md={12}>
      <div className="muted-card h-100 p-4 d-flex flex-column">
        <h6 className="section-label mb-3">RECENT ACTIVITY</h6>
        <div className="recent-activity-scroll flex-grow-1" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
          {dashboardData.recentActivity.map((activity, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between py-2 mb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="d-flex align-items-center">
                <div style={{ marginRight: '12px', width: '32px', height: '32px', borderRadius: '8px', background: `rgba(${activity.color.replace('#', '') === '00e97a' ? '0,233,122' : '239,68,68'}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activity.color }}>
                   <i className={activity.icon}></i>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{activity.title}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activity.time}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: activity.amount.startsWith('+') ? '#00e97a' : 'var(--text-primary)' }}>
                {activity.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Col>
  );
};

export default ActivityFeed;
