import React from 'react';
import { Col, Form, Button, Container, Row } from 'react-bootstrap';
import loginlogo from '../../../assets/images/login-logo.jpg';
import LoginBanner from '../LoginBanner';
import { Link } from 'react-router-dom';


const ForgotPassword = () => {

    return (
        <Container fluid >
            <Row className='d-flex justify-content-between px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <LoginBanner />
                <Col lg={4} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px' }}> {/*className="d-flex align-items-center" */}
                    <Link to={'/signin'}><i className="bi bi-arrow-left"></i></Link>
                    <Col lg={12} className='d-flex justify-content-center align-items-center text-center' >
                        <div className='text-center mt-4 col-lg-10'>
                            <img src={loginlogo} alt="loginlogo" />
                            <h4 className='text-center pt-2 font-weight-bold' >Forgot Password</h4>
                            <p>Enter your email and we will send you a reset link</p>

                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <div className="input-group mt-3">
                                        <span className="input-group-text" style={{ background: '#D9D9D9', width: '30px', textAlign: 'center' }}>
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

                                <Button as={Link} to={'/confirm_otp'} className='mt-5 col-lg-12' style={{ backgroundColor: 'lightskyblue' }} type="submit">Generate OTP</Button>
                            </Form>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default ForgotPassword;
