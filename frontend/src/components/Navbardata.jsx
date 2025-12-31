import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbardata = () => {

    const isLoggedIn = !!localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    return (
        <Navbar fixed="top" expand="lg" className="navbar">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center">
                    <div style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #00e97a 0%, #19bcfd 100%)',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        boxShadow: '0 4px 15px rgba(0, 233, 122, 0.3)'
                    }}>
                        <i className="fas fa-landmark" style={{ color: '#07090c', fontSize: '1.2rem' }}></i>
                    </div>
                    <span style={{
                        fontWeight: 700,
                        fontSize: '1.4rem',
                        letterSpacing: '-0.5px',
                        color: 'white'
                    }}>Nex<span className="text-gradient">Bank</span></span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ filter: 'invert(1)' }} />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard" className="mx-2">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/add" className="mx-2">KYC Enrollment</Nav.Link>
                                <Nav.Link as={Link} to="/view" className="mx-2">Repository</Nav.Link>
                                <Nav.Link as={Link} to="/transactions" className="mx-2">Audit</Nav.Link>
                                <Nav.Link as={Link} to="/transfer" className="mx-2 text-gradient fw-600">Deposit</Nav.Link>
                                <Nav.Link as={Link} to="/withdraw" className="mx-2">Withdraw</Nav.Link>

                                <div className="ms-3 d-flex align-items-center">
                                    <div style={{
                                        padding: '6px 16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 30,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#00e97a',
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    }}>
                                        <i className="far fa-user-circle me-2"></i>
                                        {userName}
                                    </div>
                                    <Nav.Link as={Link} to="/logout" className="ms-3" style={{ color: '#ef4444', fontWeight: 600 }}>
                                        <i className="fas fa-power-off"></i>
                                    </Nav.Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link">Login</Nav.Link>
                                <Link to="/register" style={{
                                    marginLeft: 15,
                                    padding: '8px 24px',
                                    background: 'linear-gradient(135deg, #00e97a 0%, #19bcfd 100%)',
                                    borderRadius: 30,
                                    color: '#07090c',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }}>Join Now</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};


export default Navbardata;
