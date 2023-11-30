import React from 'react';
import { Col, Form, Button, Container, Row } from 'react-bootstrap';
import loginlogo from '../../../assets/images/login-logo.jpg';
import LoginBanner from '../LoginBanner';
import { Link } from 'react-router-dom';


const NewPassword = () => {

    return (
        <Container fluid >
            <Row className='d-flex justify-content-between px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <LoginBanner />
                <Col lg={4} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px' }}>
                    <Link to={'/signup'}><i className="bi bi-arrow-left"></i></Link>
                    <Col lg={12} className='d-flex justify-content-center align-items-center' >
                        <div className='text-center mt-4 col-lg-10'>
                            <img src={loginlogo} alt="loginlogo" />
                            <h4 className='text-center pt-2 font-weight-bold' >Forgot Password</h4>
                            <p>Enter your email and we will send you a reset link</p>

                            <Form>

                                <Form.Group controlId="formBasicEmail">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text" style={{ background: '#D9D9D9', width: '30px', textAlign: 'center' }}><i className="bi bi-lock"></i></span>
                                        <Form.Control
                                            type="password"
                                            placeholder="Old Password"
                                            aria-label="Enter old password"
                                            aria-describedby="basic-addon1"
                                            style={{ fontSize: 'small', borderLeft: "none", background: "#D9D9D9", boxShadow: "unset", borderColor: "floralwhite" }}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formBasicNewPassword">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text" style={{ background: '#D9D9D9', width: '30px', textAlign: 'center' }}><i className="bi bi-lock"></i></span>
                                        <Form.Control
                                            type="password"
                                            placeholder="New Password"
                                            aria-label="Enter new password"
                                            aria-describedby="basic-addon1"
                                            style={{ fontSize: 'small', borderLeft: "none", background: "#D9D9D9", boxShadow: "unset", borderColor: "floralwhite" }}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formBasicReEnterPassword">
                                    <div className="input-group mt-2">
                                        <span className="input-group-text" style={{ background: '#D9D9D9', width: '30px', textAlign: 'center' }}><i className="bi bi-lock"></i></span>
                                        <Form.Control
                                            type="password"
                                            placeholder="Re-Enter Password"
                                            aria-label="Re-Enter Password"
                                            aria-describedby="basic-addon1"
                                            style={{ fontSize: 'small', borderLeft: "none", background: "#D9D9D9", boxShadow: "unset", borderColor: "floralwhite" }}
                                        />
                                    </div>
                                </Form.Group>

                                <Button as={Link} to={'/'} className='mt-5 col-lg-12' style={{ backgroundColor: 'lightskyblue' }} type="submit">Reset Password</Button>
                            </Form>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default NewPassword;
