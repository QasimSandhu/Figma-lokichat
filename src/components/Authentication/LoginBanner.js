import React from 'react';
import { Row, Col } from 'react-bootstrap';
import loginportal from '../../assets/images/login-portal.png';


const LoginBanner = () => {

    return (
        <div className='py-3 col-lg-8' >
            <Row className="mx-2">
                <Col>
                    <h2 className='text-white text-center pt-5 font-weight-bold' >Unlock the power of AI</h2>
                    <p className='text-white text-center font-italic'>Chat with the smartest AI - Experience the power of AI with us</p>
                    <Col className='d-flex justify-content-center'>
                        <img src={loginportal} alt="Model" />
                    </Col>
                </Col>
            </Row>
        </div>
    );
}

export default LoginBanner;
