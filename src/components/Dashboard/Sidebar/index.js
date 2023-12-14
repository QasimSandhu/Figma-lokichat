import React, { useState } from 'react';
import { Tab, Container, Row, Col, Nav, Image, Tabs, Modal, Button, Form } from 'react-bootstrap';
import './style.css';
import UkLogo from '../../../assets/images/UK-flag-logo.png';
import SidebarLogo from '../../../assets/images/sidebar-logo.svg';

const Sidebar = () => {

    // Set New debate Modal 
    const [addNewCategory, setAddNewCategory] = useState(false);

    const handleAddNewCategory = () => {
        setAddNewCategory(true);
    };

    const handleCloseNewCategory = () => {
        setAddNewCategory(false);
    };

    // Collapsed Chat List
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <Col lg={2} className='d-flex flex-column'>
                <Tab.Container id="left-tabs-example" defaultActiveKey="chats">
                    <Row className='d-flex justify-content-between align-items-center col-lg-12'>
                        <Col lg={10} className='px-0'><Image src={SidebarLogo} alt="Logo" fluid style={{ padding: '10px', width: '150px', height: '80px' }} /></Col>
                        <Col lg={2} className='px-0'><Button><i class="bi bi-trello"></i></Button></Col>
                    </Row>
                    <Row>
                        <Col lg={12} className='py-0'>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item><Nav.Link eventKey="chats"><i className="bi bi-chat-left-text me-3 chat"></i> Chats</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="search"><i className="bi bi-search me-3 search"></i>Search</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="subscription"><i className="bi bi-card-heading me-3 manage"></i>Manage Subscription</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="updates"><i className="bi bi-kanban me-3 updates"></i>Updates & FAQ</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="settings"><i className="bi bi-gear me-3 settings"></i>Settings</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="audioLibrary"><i className="bi bi-mic me-3 audio-library"></i>Audio Library</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="imageLibrary"><i className="bi bi-images me-3 image-library"></i>Image Library</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="goalManagement"><i className="bi bi-crosshair2 me-3 goal-management"></i>Goal Management</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="referralManagement"><i className="bi bi-people me-3 referal-management"></i>Referral Management</Nav.Link></Nav.Item>
                            </Nav>
                            <div className='my-3' style={{ flex: '1', borderBottom: '1px solid #bfbdbd' }}></div>
                            <Nav variant="pills" className="flex-column">
                                <Nav variant="pills" className={`flex-column ${isCollapsed ? 'collapsed' : ''}`}>
                                    <Nav.Link eventKey="chatlist" onClick={handleToggle} data-toggle="collapse" href="#navItems">
                                        <i className={`bi bi-chevron-${isCollapsed ? 'up' : 'down'} me-3`}></i>Chat list
                                    </Nav.Link>
                                    <div id="navItems" className={`collapse ${isCollapsed ? 'show' : ''}`}>
                                        <Nav.Link eventKey="math">
                                            <i className="bi bi-check rounded-1 me-3 text-center chat-list-math"></i>Math
                                        </Nav.Link>
                                        <Nav.Link eventKey="architecture">
                                            <i className="bi bi-check rounded-1 me-3 text-center chat-list-architecture" ></i>Architecture
                                        </Nav.Link>
                                        <Nav.Link eventKey="coding">
                                            <i className="bi bi-check rounded-1 me-3 text-center chat-list-coading"></i>Coding
                                        </Nav.Link>
                                    </div>
                                </Nav>

                                <Row className='m-1 ms-0 p-2 rounded-2 sidebar-button-bg col-lg-12'>
                                    <Col lg={9} className='p-0 d-flex justify-content-start align-items-center'>
                                        <Image src={UkLogo} alt="Profile Image" roundedCircle className='sidebar-user-image' />
                                        <p className='mb-0 d-block col-lg-10 d-grid ps-2'>
                                            <strong className='sidebar-button-profile-text text-white'>Robert Morine</strong><small className='sidebar-button-profile-text-sm'>robert@lokichat.net</small>
                                        </p>
                                        <Button className='px-2 align-items-center btn-sm' style={{ color: 'black ', backgroundColor: 'lawngreen' }} onClick={handleAddNewCategory}>Free</Button>
                                    </Col>
                                    <Col lg={12} className='d-flex justify-content-between px-0 pt-3'>
                                        <Col lg={6} className='d-grid pe-1'><Button className='p-2 align-items-center btn-sm sidebar-button-bg rounded-3 border border-1'>Track your assets</Button></Col>
                                        <Col lg={6} className='d-grid ps-1'><Button className='p-2 align-items-center btn-sm sidebar-button-bg rounded-3 border border-1 fs-x-small'>Prompt advisor</Button></Col>
                                    </Col>
                                </Row>

                                <Row className='m-1 ms-0 p-2 rounded-2  sidebar-dark-light-tabs-bg col-lg-12'>
                                    <Tabs defaultActiveKey="light" id="tab-example" className='rounded-2 nav-dark-light d-flex justify-content-between pe-0 sidebar-dark-light-tabs'>
                                        <Tab eventKey="light" title={<span><i className="bi bi-brightness-high-fill pe-2"></i> Light</span>}></Tab>
                                        <Tab eventKey="dark" title={<span><i className="bi bi-moon pe-2"></i> Dark</span>}></Tab>
                                    </Tabs>
                                </Row>
                            </Nav>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>
            {/* Add New Category */}
            <Modal show={addNewCategory} centered onHide={handleCloseNewCategory}>
                <Modal.Body>
                    <Container>
                        <Row className="mb-3">
                            <Modal.Title className='pb-3'>Add New Category</Modal.Title>
                            <Col lg={12} className='d-flex justify-content-between p-0'>
                                <Col className="input-group p-1">
                                    <Form.Label className='px-0 pt-2' style={{ color: 'black' }}>Category Name</Form.Label>
                                    <div className='input-group'>
                                        <span className="input-group-text border-end-0" style={{ backgroundColor: 'white' }}>
                                            <i className="bi bi-chat-right-text"></i>
                                        </span>
                                        <Form.Control type="email" className='border border-variant border-start-0' placeholder="Name" aria-label="Email Address" aria-describedby="basic-addon1" style={{ fontSize: 'small', borderLeft: "none", boxShadow: "unset", borderColor: "floralwhite" }} />
                                    </div>
                                </Col>
                                <Col className="input-group p-1">
                                    <Form.Label className='px-0 pt-2' style={{ color: 'black' }}>Color</Form.Label>
                                    <div className='input-group'>
                                        <span className="input-group-text border-end-0" style={{ backgroundColor: 'white' }}>
                                            <i className="bi bi-chat-right-text"></i>
                                        </span>
                                        <Form.Control type="email" className='border border-variant border-start-0' placeholder="Name" aria-label="Email Address" aria-describedby="basic-addon1" style={{ fontSize: 'small', borderLeft: "none", boxShadow: "unset", borderColor: "floralwhite" }} />
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-end'>
                                <Button className='me-2' variant="white border border-variant" onClick={handleCloseNewCategory}>Cancel</Button>
                                <Button variant="primary border border-variant" onClick={handleCloseNewCategory}>Add Category</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Sidebar;