import React from 'react';
import { Col, Form, Button, Container, Row } from 'react-bootstrap';
import loginlogo from '../../../assets/images/login-logo.jpg';
import LoginBanner from '../LoginBanner';
import { Link } from 'react-router-dom';
import PinField from "react-pin-field";
import './style.css';



const ConfirmOPT = () => {

    return (
        <Container fluid >
            <Row className='d-flex justify-content-between px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <LoginBanner />
                <Col lg={4} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px' }}> {/*className="d-flex align-items-center" */}
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
                                            <PinField />
                                        </div>
                                    </Form.Group>

                                </Form>
                            </div>
                            <Button as={Link} to={'/confirm_new_password'} className='mt-5 col-lg-12 mb-3' style={{ backgroundColor: 'lightskyblue' }} type="submit">Confirm Code</Button>
                            <Form.Label>Didn't Receive a code? <Link>Resend</Link></Form.Label>
                        </div>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default ConfirmOPT;
