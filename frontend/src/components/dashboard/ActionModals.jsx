import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const ActionModals = ({
  showTxModal, setShowTxModal, txType, txAmount, setTxAmount, handleTransaction, txLoading, selectedBank, setSelectedBank, linkedBanks,
  showBankModal, setShowBankModal, bankData, setBankData, handleLinkBank, bankLoading,
  showAdModal, setShowAdModal, selectedAd, theme
}) => {
  return (
    <>
      <Modal show={showTxModal} onHide={() => setShowTxModal(false)} centered contentClassName={theme === 'dark' ? "bg-[#111821] border-white/10" : ""}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-primary)', borderRadius: '8px 8px 0 0' }} className="border-0">
          <Modal.Title style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>
            {txType === 'deposit' ? 'Fast Deposit' : 'Secure Withdrawal'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: 'var(--surface-primary)', borderRadius: '0 0 8px 8px' }}>
          <form onSubmit={handleTransaction}>
            <div className="mb-4">
              <label className="d-block mb-2 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{txType === 'deposit' ? 'Select Source' : 'Select Destination'}</label>
              <select
                className="w-100 py-2 px-3 border-0 rounded-3"
                style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', outline: 'none' }}
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                required
              >
                <option value="razorpay">Razorpay (Cards/UPI/NetBanking)</option>
                {linkedBanks.map(bank => (
                  <option key={bank._id} value={bank._id}>{bank.bankName} - {bank.accountNumber.slice(-4).padStart(bank.accountNumber.length, '*')}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="d-block mb-2 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (INR)</label>
              <div className="position-relative">
                <span className="position-absolute translate-middle-y" style={{ left: '16px', top: '50%', color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-100 py-3 ps-5 border-0 rounded-3 fw-bold"
                  style={{ background: 'var(--surface-tertiary)', fontSize: '20px', outline: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            {txType === 'deposit' ? (
              <div className="p-3 mb-4 rounded-3 d-flex align-items-start" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <i className="fas fa-info-circle mt-1 me-2" style={{ color: '#3b82f6' }}></i>
                <p className="small mb-0" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Deposits are handled securely via our payment gateway. You will be redirected.</p>
              </div>
            ) : (
              <div className="p-3 mb-4 rounded-3 d-flex align-items-start" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <i className="fas fa-shield-alt mt-1 me-2" style={{ color: '#f59e0b' }}></i>
                <p className="small mb-0" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Withdrawals are processed instantly to your linked bank account. Min ₹100.</p>
              </div>
            )}
            <Button
              type="submit" disabled={txLoading} className="w-100 py-3 border-0 fw-600 shadow-sm"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-dashboard)', borderRadius: '8px', fontSize: '14px', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {txLoading ? <Spinner size="sm" /> : txType === 'deposit' ? 'Proceed to Deposit' : 'Confirm Withdrawal'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showBankModal} onHide={() => setShowBankModal(false)} centered contentClassName={theme === 'dark' ? "bg-[#111821] border-white/10" : ""}>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-primary)', borderRadius: '8px 8px 0 0' }} className="border-0">
          <Modal.Title style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>Link Your Bank Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: 'var(--surface-primary)', borderRadius: '0 0 8px 8px' }}>
          <form onSubmit={handleLinkBank}>
            <div className="mb-3">
              <label className="d-block mb-2 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Bank</label>
              <select className="w-100 py-2 px-3 border-0 rounded-3" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} value={bankData.bankName} onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}>
                <option value="State Bank of India">State Bank of India</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="d-block mb-2 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Number</label>
              <input type="text" placeholder="Enter Account Number" className="w-100 py-2 px-3 border-0 rounded-3" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} value={bankData.accountNumber} onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="d-block mb-2 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>IFSC Code</label>
              <input type="text" placeholder="e.g. SBIN0001234" className="w-100 py-2 px-3 border-0 rounded-3" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} value={bankData.ifscCode} onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value })} required />
            </div>
            <div className="mb-4">
              <label className="d-block mb-2 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Holder Name</label>
              <input type="text" placeholder="Full Name as per Bank" className="w-100 py-2 px-3 border-0 rounded-3" style={{ background: 'var(--surface-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} value={bankData.accountHolderName} onChange={(e) => setBankData({ ...bankData, accountHolderName: e.target.value })} required />
            </div>
            <Button type="submit" disabled={bankLoading} className="w-100 py-3 border-0 fw-600 shadow-sm" style={{ background: 'var(--text-primary)', color: 'var(--bg-dashboard)', borderRadius: '8px', fontSize: '14px' }}>
              {bankLoading ? <Spinner size="sm" /> : 'Securely Link Bank'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showAdModal} onHide={() => setShowAdModal(false)} centered size="lg" contentClassName={theme === 'dark' ? "bg-[#111821] border-white/10" : "border-0 shadow-lg"}>
        {selectedAd && (
          <div className="p-0 position-relative overflow-hidden" style={{ borderRadius: '12px' }}>
            <button
              onClick={() => setShowAdModal(false)}
              className="position-absolute z-3 rounded-circle"
              style={{ top: '15px', right: '15px', width: '30px', height: '30px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.8)'} onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
            >
              <i className="fas fa-times"></i>
            </button>
            <div style={{ position: 'relative', height: '300px' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface-primary) 0%, transparent 100%)', zIndex: 1 }}></div>
              <img src={selectedAd.img} alt={selectedAd.theme} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="p-5 text-center" style={{ background: 'var(--surface-primary)', marginTop: '-40px', position: 'relative', zIndex: 2 }}>
              <span className="badge mb-3 px-3 py-2" style={{ background: 'rgba(0, 233, 122, 0.1)', color: '#00e97a', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{selectedAd.tag}</span>
              <h3 className="mb-3" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedAd.theme}</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 30px' }}>{selectedAd.description}</p>
              <button className="glass-pill-btn mx-auto d-inline-flex" style={{ background: '#00e97a', color: '#000', borderColor: '#00e97a', padding: '12px 32px', fontSize: '14px', borderRadius: '30px' }}>
                Apply Now / Learn More
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
export default ActionModals;
