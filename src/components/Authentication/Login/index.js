import React, { useState } from 'react';
import { Col, Form, Button, Container, Row } from 'react-bootstrap';
import loginlogo from '../../../assets/images/login-logo.jpg';
import LoginBanner from '../LoginBanner';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import AppleLogin from 'react-apple-login';
import './styles.css';
import axios from 'axios';


const Login = () => {

    // Navigate
    const navigate = useNavigate();
    // Get user data from input field
    const [email, setLoginEmail] = useState('');
    const [password, setLoginPassword] = useState('');

    // Login user Account
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userData = {
                email: email,
                password: password,
                ipAddress: "192.168.1.1",
                os: "os"
            };

            const response = await axios.post('http://localhost:3003/api/auth/login', userData);
            
            if (response.status === 200) {
                navigate("/chat");
            }

        } catch (error) {
            console.error(error.response);
        }
    };

    // Active and Navigate Login, Signup button
    const [activeButton, setActiveButton] = useState(1);
    const handleActive = (index) => {
        setActiveButton(index);
    }

    return (
        <Container fluid >
            <Row className='d-flex justify-content-between px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <LoginBanner />
                <Col lg={4} className='bg-color-white p-3 rounded-4'>
                    <Link to={'/signup'}><i className="bi bi-arrow-left"></i></Link>
                    <Col lg={12} className='d-flex justify-content-center align-items-center' >
                        <div className='text-center mt-4 col-lg-10'>
                            <img src={loginlogo} alt="loginlogo" />
                            <h4 className='text-center pt-2 font-weight-bold' >Log In to your account</h4>
                            <p>It's free an easy</p>
                            <div className='rounded-2 p-1 bg-color-d9'>
                                <Button as={Link} to={'/signup'} className='col-lg-6 fs-7 border-0' style={{
                                    backgroundColor: activeButton === 0 ? 'white' : '#d9d9d9', color: 'black',
                                    borderRadius: activeButton === 0 ? '6px' : '0'
                                }} onClick={() => handleActive(0)} >Create account</Button>
                                <Button as={Link} to={'/signin'} className='col-lg-6 fs-7 border-0' style={{
                                    backgroundColor: activeButton === 1 ? 'white' : '#d9d9d9', color: 'black',
                                    borderRadius: activeButton === 1 ? '6px' : '0'
                                }} variant={activeButton === 1 ? 'white' : '#b3b3b3'} onClick={() => handleActive(1)}>Log in</Button>
                            </div>
                            <div>
                                <Button className='col-lg-12 mt-4 p-0 border border-3' href="#" variant='white'>
                                    <GoogleOAuthProvider clientId='<your_client_id>'>
                                        <GoogleLogin onSuccess={credentialResponse => { console.log(credentialResponse); }} onError={() => { alert('Login Failed'); console.log('Login Failed'); }}></GoogleLogin>
                                    </GoogleOAuthProvider>
                                </Button>

                                <Button className='col-lg-12 mt-2 d-flex justify-content-between align-items-center text-center border border-3' variant="white">
                                    <i className="bi bi-apple col-lg-1"></i>
                                    <AppleLogin clientId="com.react.apple.login" redirectURI="https://redirectUrl.com" buttonText="Continue with Apple"
                                        render={({ onClick }) => (
                                            <p onClick={onClick} className="apple-login-button mb-0 col-lg-11">Continue with Apple</p>
                                        )}
                                    />
                                </Button>
                                <div className='mt-3 d-flex justify-content-end align-items-center'>
                                    <div className='col-lg-6' ></div>
                                    <div className='color-d9'>or</div>
                                    <div className='col-lg-6 ms-2' style={{ flex: '1', borderBottom: '2px solid #b3b3b3' }}></div>
                                </div>
                            </div>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <div className="input-group mt-3">
                                        <span className="input-group-text align-items-center bg-color-d9" style={{ width: '30px', }}>
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <Form.Control
                                            type="email" placeholder="Type your email" className='border-start-0 fs-7 bg-color-d9 box-shadow-unset border-color-d9' value={email} onChange={(e) => setLoginEmail(e.target.value)} />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text bg-color-d9 align-items-center" style={{ width: '30px' }}><i className="bi bi-lock"></i></span>
                                        <Form.Control type="email" placeholder="Type your password" className='border-start-0 fs-7 bg-color-d9 box-shadow-unset border-color-d9' value={password} onChange={(e) => setLoginPassword(e.target.value)} />
                                    </div>
                                </Form.Group>

                                <Form.Group className='d-flex justify-content-between align-items-center mt-2'>
                                    <Form.Check type='checkbox'>
                                        <Form.Check.Input aria-label="option 1" className='box-shadow-unset border-color-d9' /> <span>Remember me</span>
                                    </Form.Check>
                                    <div>
                                        <Link to={'/forgot_password'}>Forgot Password?</Link>
                                    </div>
                                </Form.Group>

                                <Button onClick={handleLogin} className='mt-5 col-lg-12 bg-color-lightskyblue' type="submit">Log in</Button>
                            </Form>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
