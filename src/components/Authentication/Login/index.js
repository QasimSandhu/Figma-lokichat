import React, { useState } from 'react';
import { Col, Form, Button, Container, Row } from 'react-bootstrap';
import loginlogo from '../../../assets/images/login-logo.jpg';
import LoginBanner from '../LoginBanner';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import AppleLogin from 'react-apple-login';
import './styles.css';


const Login = () => {
    // Active and Navigate Login, Signup button
    const [activeButton, setActiveButton] = useState(1);
    const handleActive = (index) => {
        setActiveButton(index);
    }

    return (
        <Container fluid >
            <Row className='d-flex justify-content-between px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <LoginBanner />
                <Col lg={4} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px' }}>
                    <Link to={'/signup'}><i className="bi bi-arrow-left"></i></Link>
                    <Col lg={12} className='d-flex justify-content-center align-items-center' >
                        <div className='text-center mt-4 col-lg-10'>
                            <img src={loginlogo} alt="loginlogo" />
                            <h4 className='text-center pt-2 font-weight-bold' >Log In to your account</h4>
                            <p>It's free an easy</p>
                            <div className='rounded-2' style={{ backgroundColor: '#d9d9d9', padding: '5px' }}>
                                <Button as={Link} to={'/signup'} className='col-lg-6' style={{
                                    fontSize: 'small', border: 'none',
                                    backgroundColor: activeButton === 0 ? 'white' : '#d9d9d9', color: 'black',
                                    borderRadius: activeButton === 0 ? '6px' : '0'
                                }} onClick={() => handleActive(0)} >Create account</Button>
                                <Button as={Link} to={'/signin'} className='col-lg-6' style={{
                                    fontSize: 'small', border: 'none',
                                    backgroundColor: activeButton === 1 ? 'white' : '#d9d9d9', color: 'black',
                                    borderRadius: activeButton === 1 ? '6px' : '0'
                                }} variant={activeButton === 1 ? 'white' : '#b3b3b3'} onClick={() => handleActive(1)}>Log in</Button>
                            </div>
                            <div>
                                <Button className='col-lg-12 mt-4' href="#" variant='white' style={{ padding: 0, border: '3px solid #d9d9d9' }}>
                                    <GoogleOAuthProvider clientId='<your_client_id>'>
                                        <GoogleLogin style={{ border: 'none' }} onSuccess={credentialResponse => { console.log(credentialResponse); }} onError={() => { alert('Login Failed'); console.log('Login Failed'); }}></GoogleLogin>
                                    </GoogleOAuthProvider>
                                </Button>

                                <Button className='col-lg-12 mt-2 d-flex justify-content-between align-items-center text-center' variant="white" style={{ border: '3px solid #d9d9d9' }}>
                                    <i className="bi bi-apple col-lg-1" style={{ marginRight: '8px' }}></i>
                                    <AppleLogin clientId="com.react.apple.login" redirectURI="https://redirectUrl.com" buttonText="Continue with Apple"
                                        render={({ onClick }) => (
                                            <p onClick={onClick} className="apple-login-button mb-0 col-lg-11" style={{ border: 'none', backgroundColor: 'unset' }}>
                                                Continue with Apple
                                            </p>
                                        )}
                                    />
                                </Button>
                                <div className='mt-3 d-flex justify-content-end align-items-center'>
                                    <div className='col-lg-6' ></div>
                                    <div style={{ color: '#b3b3b3' }}>or</div>
                                    <div className='col-lg-6 ms-2' style={{ flex: '1', borderBottom: '2px solid #b3b3b3' }}></div>
                                </div>
                            </div>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <div className="input-group mt-3">
                                        <span className="input-group-text align-items-center" style={{ background: '#D9D9D9', width: '30px', }}>
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <Form.Control
                                            type="email"
                                            placeholder="Type your email"
                                            aria-label="Enter email"
                                            aria-describedby="basic-addon1"
                                            style={{ fontSize: 'small', borderLeft: "none", background: "#D9D9D9", boxShadow: "unset", borderColor: "floralwhite" }}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text" style={{ background: '#D9D9D9', width: '30px', textAlign: 'center' }}><i className="bi bi-lock"></i></span>
                                        <Form.Control
                                            type="email"
                                            placeholder="Type your password"
                                            aria-label="Enter email"
                                            aria-describedby="basic-addon1"
                                            style={{ fontSize: 'small', borderLeft: "none", background: "#D9D9D9", boxShadow: "unset", borderColor: "floralwhite" }}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className='d-flex justify-content-between align-items-center mt-2'>
                                    <Form.Check type='checkbox'>
                                        <Form.Check.Input aria-label="option 1" style={{ boxShadow: "unset", borderColor: "#D9D9D9" }} /> <span>Remember me</span>
                                    </Form.Check>
                                    <div>
                                        <Link to={'/forgot_password'}>Forgot Password?</Link>
                                    </div>
                                </Form.Group>

                                <Button as={Link} to={'/'} className='mt-5 col-lg-12' style={{ backgroundColor: 'lightskyblue' }} type="submit">Log in</Button>
                            </Form>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
