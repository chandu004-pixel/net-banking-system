import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Searchbar from '../pages/Searchbar';
import Notification from '../pages/Notification';
import { useTheme } from '../context/ThemeContext';

const Navbardata = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('token');

    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Toggle popup function
    const togglePopup = () => setIsPopupOpen(!isPopupOpen);

    return (
        <>
            <nav className={`absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 lg:px-12 py-3 theme-nav`}>
                {/* Left Group */}
                <div className="flex items-center gap-5">
                    {/* Hamburger & Logo Section */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="sidebar-hamburger"
                            title="Open Menu"
                            style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', marginRight: '16px', borderRadius: '8px', transition: 'background 0.2s' }}
                        >
                            <i className="fas fa-bars" style={{ fontSize: '18px' }}></i>
                        </button>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                background: "linear-gradient(135deg,#00e97a,#19bcfd)",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 10
                            }}
                        >
                            <i className="fas fa-landmark text-dark"></i>
                        </div>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <span
                                style={{
                                    fontWeight: 600,
                                    fontSize: "1.2rem",
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.5px"
                                }}
                            >
                                Nex<span style={{ color: "#00e97a" }}>Bank</span>
                            </span>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-white/30 ml-2"></div>

                    {/* Icons */}
                    <div className="relative ml-2">
                        <button onClick={togglePopup} title="Quick Actions Menu" style={{ display: 'flex', alignItems: 'center' }} className="text-white/90 hover:text-white transition bg-transparent border-none p-0 cursor-pointer focus:outline-none">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M20 14h.01M20 17h.01M20 20h.01M17 20h.01" strokeLinecap="round" strokeWidth="2" />
                            </svg>
                        </button>

                        {/* App Grid Popup Menu */}
                        {isPopupOpen && (
                            <div className="absolute top-10 left-0 rounded-xl shadow-2xl p-3 w-64 z-50 animate-fade-in" style={{ gridTemplateColumns: 'repeat(2, 1fr)', display: 'grid', gap: '8px', background: 'var(--surface-primary)', border: '1px solid var(--card-border)' }}>
                                <Link to={isLoggedIn ? "/transfer" : "/login"} onClick={() => setIsPopupOpen(false)} className="app-grid-btn">
                                    <i className="fas fa-paper-plane text-[#00e97a]"></i>
                                    <span>Transfer</span>
                                </Link>
                                <Link to={isLoggedIn ? "/history" : "/login"} onClick={() => setIsPopupOpen(false)} className="app-grid-btn">
                                    <i className="fas fa-history text-[#19bcfd]"></i>
                                    <span>History</span>
                                </Link>
                                <Link to={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setIsPopupOpen(false)} className="app-grid-btn">
                                    <i className="fas fa-user-circle text-[#f59e0b]"></i>
                                    <span>Profile</span>
                                </Link>
                                <Link to={isLoggedIn ? "/settings" : "/login"} onClick={() => setIsPopupOpen(false)} className="app-grid-btn">
                                    <i className="fas fa-cog text-[#ef4444]"></i>
                                    <span>Settings</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        className="text-white/90 hover:text-white transition bg-transparent border-none p-0 cursor-pointer focus:outline-none ml-2"
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        {theme === 'dark' ? (
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        )}
                    </button>

                    <a href="https://finance.yahoo.com/" target="_blank" rel="noopener noreferrer" title="Global Markets" style={{ display: 'flex', alignItems: 'center' }} className="text-white/90 hover:text-white transition ml-2 bg-transparent border-none p-0 cursor-pointer">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                    </a>
                </div>

                {/* Right Group */}
                <div className="flex items-center gap-12">
                    {/* Desktop Menu/Search */}
                    <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        <Searchbar />
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-6 font-semibold text-[15px]">
                        {isLoggedIn ? (
                            <>
                                <Notification />
                                <Link to="/logout" style={{ textDecoration: 'none' }} className="text-red-500 hover:text-red-400 transition ml-2">
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)' }} className="hover:opacity-80 transition">
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    style={{ textDecoration: 'none' }}
                                    className="signup-btn bg-[#48ddd0] text-black px-6 py-2.5 rounded font-bold hover:bg-[#3bc2b6] transition"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <style>{`
                .nav-link-custom {
                    position: relative;
                }
                .nav-link-custom::after {
                    content: "";
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -6px;
                    left: 0;
                    background: #00e97a;
                    transition: width 0.3s ease;
                }
                .nav-link-custom:hover::after {
                    width: 100%;
                }
                .signup-btn {
                    box-shadow: 0 8px 25px rgba(0,233,122,0.3);
                }
                .app-grid-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 16px 12px;
                    border-radius: 12px;
                    background: var(--surface-tertiary);
                    border: 1px solid var(--card-border);
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .app-grid-btn:hover {
                    background: var(--surface-primary);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }
                .app-grid-btn i {
                    font-size: 1.25rem;
                    margin-bottom: 8px;
                }
                .app-grid-btn span {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .sidebar-hamburger:hover {
                    background: var(--surface-secondary) !important;
                }
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    color: var(--text-primary);
                    text-decoration: none;
                    font-weight: 500;
                    transition: background 0.2s;
                }
                .sidebar-link:hover {
                    background: var(--surface-tertiary);
                }
            `}</style>
            </nav>

            {/* Global Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 9999
                    }}
                />
            )}

            {/* Global Sidebar */}
            <div
                className="global-sidebar"
                style={{
                    position: 'fixed',
                    top: 0, left: 0, bottom: 0,
                    width: '300px',
                    background: 'var(--surface-primary)',
                    borderRight: '1px solid var(--card-border)',
                    boxShadow: isSidebarOpen ? '4px 0 24px rgba(0,0,0,0.3)' : 'none',
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Retract Chevron Button in the Middle */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    title="Collapse Sidebar"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '-16px',
                        transform: 'translateY(-50%)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 10001,
                        opacity: isSidebarOpen ? 1 : 0,
                        pointerEvents: isSidebarOpen ? 'auto' : 'none',
                        transition: 'opacity 0.3s ease 0.2s, background 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--surface-tertiary)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--surface-secondary)'; }}
                >
                    <i className="fas fa-chevron-left" style={{ fontSize: '13px', marginLeft: '-2px' }}></i>
                </button>

                {/* Sidebar Content */}
                <div style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#00e97a,#19bcfd)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                            <i className="fas fa-landmark text-dark"></i>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                            Nex<span style={{ color: "#00e97a" }}>Bank</span>
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>Main Menu</span>

                        <Link to={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setIsSidebarOpen(false)} className="sidebar-link" style={{ background: location.pathname === '/dashboard' ? 'var(--surface-tertiary)' : 'transparent' }}>
                            <i className="fas fa-chart-pie" style={{ width: '24px', color: location.pathname === '/dashboard' ? '#00e97a' : 'inherit' }}></i> Dashboard
                        </Link>
                        <Link to={isLoggedIn ? "/transfer" : "/login"} onClick={() => setIsSidebarOpen(false)} className="sidebar-link" style={{ background: location.pathname === '/transfer' ? 'var(--surface-tertiary)' : 'transparent' }}>
                            <i className="fas fa-paper-plane" style={{ width: '24px', color: location.pathname === '/transfer' ? '#19bcfd' : 'inherit' }}></i> Transfers
                        </Link>
                        <Link to={isLoggedIn ? "/history" : "/login"} onClick={() => setIsSidebarOpen(false)} className="sidebar-link" style={{ background: location.pathname === '/history' ? 'var(--surface-tertiary)' : 'transparent' }}>
                            <i className="fas fa-history" style={{ width: '24px', color: location.pathname === '/history' ? '#f59e0b' : 'inherit' }}></i> Transaction History
                        </Link>

                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px', marginTop: '24px', fontWeight: 600 }}>Preferences</span>

                        <Link to={isLoggedIn ? "/settings" : "/login"} onClick={() => setIsSidebarOpen(false)} className="sidebar-link" style={{ background: location.pathname === '/settings' ? 'var(--surface-tertiary)' : 'transparent' }}>
                            <i className="fas fa-cog" style={{ width: '24px', color: location.pathname === '/settings' ? '#ef4444' : 'inherit' }}></i> Settings
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbardata;
