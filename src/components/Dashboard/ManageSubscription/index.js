import React from 'react';
import './style.css';
import Header from '../Header';
import { Button, Card, Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import Sidebar from '../Sidebar';


const ManageSubscription = () => {

    // Dummy Plans Cards
    const plansCard = [
        {
            title: 'Choose Plan',
            price: 'Free',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
        },
        {
            title: 'Basic',
            price: '$9.99/month',
            features: ['Basic Feature 1', 'Basic Feature 2', 'Basic Feature 3'],
        },
        {
            title: 'Premium',
            price: '$19.99/month',
            features: ['Premium Feature 1', 'Premium Feature 2', 'Premium Feature 3'],
        },
        {
            title: 'Pro',
            price: '$29.99/month',
            features: ['Pro Feature 1', 'Pro Feature 2', 'Pro Feature 3'],
        },
    ];


    return (
        <Container fluid >
            <Row className='p-3' style={{ background: '#141414', height: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />
                <Col className='p-0 border-end border-2 border-black bg-color-light'>
                    {/* Header */}
                    <Header />
                    <Col className='px-5 mx-5'>
                        <Col className='px-5'>
                            <Col>
                                <h1 className='fw-bold text-center pt-5'>AI chat made affordable</h1>
                                <p className='dark-gray-color text-center'>Price Plans for every budget</p>
                            </Col>
                        </Col>
                        <Col>
                            <Tab.Container defaultActiveKey="regularPrice">
                                <Nav variant="pills" className='d-flex justify-content-center'>
                                    <Nav.Item>
                                        <Nav.Link className='background-blue rounded-5 px-3 m-2' eventKey="regularPrice">Regular Prices</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='background-blue rounded-5 px-3 m-2' eventKey="referralPrices">Referral Prices</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="regularPrice">
                                        <Col>
                                            <Col>
                                                <Col className='d-flex justify-content-around mt-4'>
                                                    {plansCard.map((plan, index) => (
                                                        <Card key={index}>
                                                            <Card.Body>
                                                                <Card.Title>{plan.title}</Card.Title>
                                                                <Card.Subtitle className="mb-2 text-muted">{plan.price}</Card.Subtitle>
                                                                <Card.Text>
                                                                    <ul>
                                                                        {plan.features.map((feature, i) => (
                                                                            <li key={i}>{feature}</li>
                                                                        ))}
                                                                    </ul>
                                                                </Card.Text>
                                                                <Button variant="primary">Current Plan</Button>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                </Col>
                                            </Col>
                                        </Col>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="referralPrices">
                                        <Col>
                                            <Col>
                                                <Col className='d-flex justify-content-around mt-4'>
                                                    {plansCard.map((plan, index) => (
                                                        <Card key={index}>
                                                            <Card.Body>
                                                                <Card.Title>{plan.title}</Card.Title>
                                                                <Card.Subtitle className="mb-2 text-muted">{plan.price}</Card.Subtitle>
                                                                <Card.Text>
                                                                    <ul>
                                                                        {plan.features.map((feature, i) => (
                                                                            <li key={i}>{feature}</li>
                                                                        ))}
                                                                    </ul>
                                                                </Card.Text>
                                                                <Button variant="primary">Select Plan</Button>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                </Col>
                                            </Col>
                                        </Col>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Col>
                    </Col>
                </Col>
            </Row>
        </Container >
    );
}

export default ManageSubscription;
