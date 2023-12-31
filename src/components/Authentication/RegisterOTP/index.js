import React, { useState } from 'react';
import { Col, Form, Button, Container, Row } from 'react-bootstrap';
import loginlogo from '../../../assets/images/login-logo.jpg';
import LoginBanner from '../LoginBanner';
import { Link, useNavigate } from 'react-router-dom';
import PinField from "react-pin-field";
import './style.css';

const RegisterOTP = () => {

    // Navigate
    const navigate = useNavigate();

    // Get OTP from Inputfields
    const [pin, setPin] = useState('');
    const handlePinChange = (value) => {
        setPin(value);
    };

    // Verify Signup OTP
    const handleSignupOTP = (e) => {
        e.preventDefault();
        const Email = localStorage.getItem('Email');
        console.log(Email, 'Email');
        console.log(pin, 'pin');
        alert('Your Account has been created')
        navigate("/chat");
    }

    return (
        <Container fluid >
            <Row className='d-flex justify-content-between px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <LoginBanner />
                <Col lg={4} className='rounded-3 bg-color-white p-5' >
                    <Link to={'/signin'}><i className="bi bi-arrow-left"></i></Link>
                    <Col lg={12} className='d-flex justify-content-center align-items-center text-center' >
                        <div className='text-center mt-4 col-lg-10'>
                            <img src={loginlogo} alt="loginlogo" />
                            <h4 className='text-center pt-2 font-weight-bold' >Verification</h4>
                            <p>Click the link or enter the code sent to <Link>johnmorino5@loki.com</Link>in order to proceed</p>
                            <div className='justify-content-center align-item-center text-center d-flex'>
                                <Form className='col-lg-8'>
                                    <Form.Group controlId="formBasicPin" className='col-lg-12'>
                                        <div className="input-group-box input-group mt-3 d-flex justify-content-between">
                                            <PinField className='text-center fw-bold' onComplete={handlePinChange} />
                                        </div>
                                    </Form.Group>
                                </Form>
                            </div>
                            <Button as={Link} to={'/confirm_new_password'} className='mt-5 col-lg-12 mb-3' style={{ backgroundColor: 'lightskyblue' }} type="button" onClick={handleSignupOTP}>Confirm OTP</Button>
                            <Form.Label>Didn't Receive a code? <Link>Resend</Link></Form.Label>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterOTP;
