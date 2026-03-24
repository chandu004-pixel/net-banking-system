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
    <div className="ad-slider-container mb-4 overflow-hidden position-relative animate-fade-in" style={{ background: 'transparent', height: '180px', animationDelay: '0.15s', borderRadius: '16px' }}>
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
            
            <div style={{ position: 'absolute', top: '50%', left: '70px', transform: 'translateY(-50%)', zIndex: 2, maxWidth: '55%' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#00e97a', fontWeight: 700, display: 'block', marginBottom: '8px' }}>{ad.tag}</span>
              <h3 style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '24px', color: '#fff', letterSpacing: '-0.02em' }}>{ad.theme}</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ad.description}</p>
              <button
                className="ad-discover-btn"
                onClick={() => { setSelectedAd(ad); setShowAdModal(true); }}
                style={{
                  background: '#00e97a', color: '#000', border: 'none', padding: '8px 24px',
                  borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
                }}
              >
                Discover <i className="fas fa-arrow-right ms-1"></i>
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
