import React, { useState, useEffect } from 'react';

const AdSlider = ({ ads, setSelectedAd, setShowAdModal }) => {
  const [activeAd, setActiveAd] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAd((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="ad-slider-container mb-4 overflow-hidden position-relative animate-fade-in" style={{ background: 'var(--surface-primary)', height: '240px', animationDelay: '0.15s', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
      <div className="ad-slides-wrapper" style={{
        display: 'flex',
        transition: 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)',
        transform: `translateX(-${activeAd * 100}%)`,
        width: `${ads.length * 100}%`,
        height: '100%'
      }}>
        {ads.map((ad) => (
          <div key={ad.id} style={{ width: '100%', height: '100%', flexShrink: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', zIndex: 1 }}></div>
            <img src={ad.img} alt={ad.theme} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            
            <div className="ad-content-overlay" style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)', zIndex: 2, width: '90%', maxWidth: '500px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#00e97a', fontWeight: 800, display: 'block', marginBottom: '8px' }}>{ad.tag}</span>
              <h3 style={{ margin: '0 0 12px 0', fontWeight: 800, fontSize: '1.75rem', color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{ad.theme}</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: '1.6', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{ad.description}</p>
              <button
                className="ad-discover-btn"
                onClick={() => { alert(`Initiating application for ${ad.theme}...`); }}
                style={{
                  background: '#00e97a', color: '#000', border: 'none', padding: '10px 24px',
                  borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 233, 122, 0.3)'
                }}
              >
                Claim Offer <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setActiveAd((prev) => (prev === 0 ? ads.length - 1 : prev - 1))} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', zIndex: 3, transition: 'background 0.3s, color 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
        <i className="fas fa-chevron-left"></i>
      </button>

      <button onClick={() => setActiveAd((prev) => (prev + 1) % ads.length)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', zIndex: 3, transition: 'background 0.3s, color 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
        <i className="fas fa-chevron-right"></i>
      </button>

      <div style={{ position: 'absolute', bottom: '20px', right: '30px', zIndex: 3, display: 'flex', gap: '8px' }}>
        {ads.map((_, idx) => (
          <div key={idx} onClick={() => setActiveAd(idx)} style={{ width: activeAd === idx ? '30px' : '10px', height: '4px', borderRadius: '2px', background: activeAd === idx ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s ease', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
};

export default AdSlider;
