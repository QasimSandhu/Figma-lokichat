import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './style.css';
import Sidebar from '../Sidebar';
import GoalDetail from './GoalDetails';

const GoalManagement = () => {

    return (
        <Container fluid >
            <Row className='p-3' style={{ background: '#141414', height: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />
                {/* Chat Page */}
                <Col className='rounded-start px-0 border-end border-2 border-black' lg={7} style={{ backgroundColor: 'white' }}>
                    <Col className='d-flex justify-content-between align-items-center'>
                        <Col className='d-flex justify-content-between align-items-center pt-3 py-2 px-4'>
                            <Col lg={10}><h3>Hello Jack</h3></Col>
                            <Col lg={2} className='d-flex justify-content-between align-items-center p-2'>
                                <i className="bi bi-star"></i>
                                <i className="bi bi-bookmark"></i>
                                <i className="bi bi-upload"></i>
                                <i className="bi bi-three-dots"></i>
                            </Col>
                        </Col>
                    </Col>
                    <Col lg={12} style={{ backgroundColor: '#f7f7f7' }}>
                        <Col lg={12} className='d-flex justify-content-center py-3'>
                            <Col lg={11} className='rounded-2 py-1 px-1'>
                                <Col className='d-flex justify-content-between align-items-center pb-2'>
                                    <p className='mb-0 fw-bold fs-3'>Goal Management</p>
                                    <Button className='me-1 px-3 py-1' variant='primary' >+ Add Goal</Button>
                                </Col>
                            </Col>
                        </Col>
                        <Col lg={12} className='d-flex justify-content-center'>
                            <Col lg={11} className='py-1 px-1 d-flex justify-content-between'>
                                <Col lg={7} className='pb-2'>
                                    <p className='mb-0 fw-bold fs-5 d-grid'>Goal <span>This month</span></p>
                                </Col>
                                <Col lg={5} className='d-flex justify-content-between'>
                                    <Col lg={5} className='d-flex justify-content-between'>
                                        <Col className='border-end'>
                                            <Form.Label className='color-darkgray mb-0'>Goal</Form.Label>
                                            <p className='mb-0 fw-bold fs-5'>4 Goals</p>
                                        </Col>
                                    </Col>
                                    <Col className='d-grid justify-content-end'>
                                        <Col>
                                            <Form.Label className='color-darkgray mb-0'>Goal Achieved</Form.Label>
                                            <p className='mb-0 fw-bold fs-5'>2 Achievements</p>
                                        </Col>
                                    </Col>
                                </Col>
                            </Col>
                        </Col>
                        <Col lg={12} className='d-flex justify-content-center'>
                            <Col lg={11} className='d-flex'>
                                <Col lg={1}>
                                    <Col lg={7} className='rounded-3 icon-bg-gray py-2 d-flex justify-content-center'><i class="bi bi-box-fill"></i></Col>
                                </Col>
                                <Col lg={3} className='d-flex align-items-center'>
                                    <p className='fw-bold mb-0'>In Progress</p>
                                </Col>
                            </Col>
                        </Col>
                    </Col>
                </Col>
                {/* Right Audio Section */}
                <GoalDetail />
            </Row >
        </Container >
    );
};

export default GoalManagement;