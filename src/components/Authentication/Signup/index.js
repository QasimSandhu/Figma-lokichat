import React, { useState } from 'react';
import { Col, Form, Button, Container, Row } from 'react-bootstrap';
import loginlogo from '../../../assets/images/login-logo.jpg';
import LoginBanner from '../LoginBanner';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import AppleLogin from 'react-apple-login';
import './style.css';
import axios from 'axios';


const Signup = () => {

    // Navigate
    const navigate = useNavigate();

    // Active and Navigate Login, Signup button
    const [activeButton, setActiveButton] = useState(0);
    const handleActive = (index) => {
        setActiveButton(index);
    }

    // Get user data from input field
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Create user Account
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const userData = {
                email: email,
                password: password,
                userName: username,
            };

            const response = await axios.post('http://localhost:3003/api/auth/register', userData);

            localStorage.setItem('Email', response.data.data.email);

            if (response.status === 200) {
                navigate("/register_otp");
            }

        } catch (error) {
            console.error(error.response);
        }
    };


    return (
        <Container fluid >
            <Row className='d-flex justify-content-between px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <LoginBanner />
                <Col lg={4} className='bg-color-white p-4 rounded-4'>
                    <Col lg={12} className='d-flex justify-content-center align-items-center' >
                        <div className='text-center mt-4 col-lg-10'>
                            <img src={loginlogo} alt="loginlogo" />
                            <h4 className='text-center pt-2 font-weight-bold' >Create your account</h4>
                            <p>It's free an easy</p>
                            <div className='rounded-2 p-1 bg-color-lightGray'>
                                <Button as={Link} to={'/signup'} className='col-lg-6 create-account-btn' style={{
                                    backgroundColor: activeButton === 0 ? 'white' : '#d9d9d9', color: 'black',
                                    borderRadius: activeButton === 0 ? '6px' : '0'
                                }} onClick={() => handleActive(0)} >Create account</Button>

                                <Button as={Link} to={'/signin'} className='col-lg-6 create-account-btn' style={{
                                    backgroundColor: activeButton === 1 ? 'white' : '#d9d9d9', color: 'black',
                                    borderRadius: activeButton === 1 ? '6px' : '0'
                                }} variant={activeButton === 1 ? 'white' : '#b3b3b3'} onClick={() => handleActive(1)}>Log in</Button>
                            </div>
                            <div>
                                <Button className='col-lg-12 mt-4 p-0 border border-3' href="#" variant='white'>
                                    <GoogleOAuthProvider clientId='<your_client_id>'>
                                        <GoogleLogin className='border-0' onSuccess={credentialResponse => { console.log(credentialResponse); }} onError={() => { alert('Login Failed'); console.log('Login Failed'); }}></GoogleLogin>
                                    </GoogleOAuthProvider>
                                </Button>

                                <Button className='col-lg-12 mt-2 d-flex justify-content-between align-items-center text-center border border-3' variant="white">
                                    <i className="bi bi-apple col-lg-1"></i>
                                    <AppleLogin clientId="com.react.apple.login" redirectURI="https://redirectUrl.com" buttonText="Continue with Apple"
                                        render={({ onClick }) => (
                                            <p onClick={onClick} className="apple-login-button mb-0 col-lg-11 border-0">Continue with Apple</p>
                                        )}
                                    />
                                </Button>
                                <div className='mt-3 d-flex align-items-center'>
                                    <div className='col-lg-5 me-2' style={{ flex: '1', borderBottom: '2px solid #b3b3b3' }}></div>
                                    <div style={{ color: '#b3b3b3' }}>or</div>
                                    <div className='col-lg-5 ms-2' style={{ flex: '1', borderBottom: '2px solid #b3b3b3' }}></div>
                                </div>
                            </div>
                            <Form>
                                <Form.Group controlId="formBasicName">
                                    <div className="input-group mt-3">
                                        <span className="input-group-text border-end-0 bg-color-lightGray">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <Form.Control type="text" placeholder="Please enter your name" aria-label="Enter Name" className='border-start-0 signup-input-field bg-color-lightGray box-shadow-inheri border-color-lightGray' value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text align-items-center bg-color-lightGray"><i className="bi bi-envelope"></i></span>
                                        <Form.Control type="email" className='border-color-lightGray fs-7 border-start-0 bg-color-lightGray box-shadow-inheri' placeholder="Type your email" aria-label="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text align-items-center bg-color-lightGray"><i className="bi bi-lock"></i></span>
                                        <Form.Control type="password" className='border-color-lightGray fs-7 border-start-0 bg-color-lightGray box-shadow-inheri' placeholder="Type your password" aria-label="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </Form.Group>

                                <Form.Group className='mt-2'>
                                    <div className='d-flex justify-content-start'>
                                        <Form.Check type='checkbox'>
                                            <Form.Check.Input aria-label="option 1 signup-check-input-field" />
                                        </Form.Check>
                                        <Form.Label className='ms-1 fs-7' style={{ textAlign: 'left' }}>By creating an account means you agree to the<b> Terms and Conditions,</b> and our<b> Privacy Policy</b></Form.Label>
                                    </div>
                                </Form.Group>

                                <Button onClick={handleRegister} className='mt-5 col-lg-12 bg-color-lightskyblue' type="button">Create my account</Button>
                            </Form>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;
