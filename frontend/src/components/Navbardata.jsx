import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
const Navbardata = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const hl = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    return <>
        <Navbar bg='dark' variant='dark' expand="lg">
            <Navbar.Brand as={Link} to='/'>KYC SYSTEM</Navbar.Brand>
            <Navbar.Toggle aria-controls='x' />
            <Navbar.Collapse id='x'>
                <Nav className='ms-auto'>
                    <Nav.Link as={Link} to="/">Register</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    {

                        token && (
                            <>
                                <Nav.Link as={Link} to="/add">Add KYC</Nav.Link>
                                <Nav.Link as={Link} to="/view">View KYC</Nav.Link>
                                <button className='btn btn-dark' onClick={hl}>Logout</button>
                            </>
                        )
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>


    </>
}

export default Navbardata