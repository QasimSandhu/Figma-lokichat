import React, { useState } from 'react';
import { Tab, Container, Row, Col, Nav, Image, Tabs, Modal, Button, Form } from 'react-bootstrap';
import './style.css';
import UkLogo from '../../../assets/images/UK-flag-logo.png';
import SidebarLogo from '../../../assets/images/sidebar-logo.svg';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';


const Sidebar = () => {
    // Dummy Side Srarchbar Data
    const sidebarSearchText = [
        {
            heading: 'How can I be more productive?',
            text: 'With increasing demands in personal and professional life, people often look for...',
        },
        {
            heading: 'How can I learn a new language quickly?',
            text: 'Language learning is a popular activity, and people often ask...',
        },
        {
            heading: 'How can I be more productive?',
            text: 'With increasing demands in personal and professional life, people often look for...',
        },
        {
            heading: 'How can I learn a new language quickly?',
            text: 'Language learning is a popular activity, and people often ask...',
        },
        {
            heading: 'How can I be more productive?',
            text: 'With increasing demands in personal and professional life, people often look for...',
        }
    ];

    // Dummy last 30 days text
    const sidebarSearchRecentText = [
        {
            heading: 'Whats the best way to implement a database in my web...',
            text: 'Write code (HTML,CSS, JS) for a simple form with 3 input fields and a...'
        },
        {
            heading: 'Whats the best way to implement a database in my web...',
            text: 'Write code (HTML,CSS, JS) for a simple form with 3 input fields and a...'
        }
    ]

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

    // Sidebar Search Modal
    const [sideSearchModal, setSideSearchModal] = useState(false);
    const [searchSidebar, setSearchSidebar] = useState('');

    const handleSearchModal = () => {
        setSideSearchModal(true);
    };

    const handleCloseSearchModal = () => {
        setSideSearchModal(false);
    };

    // Sidebar Profile Setting Modal
    const [sidebarProfileSetting, setSidebarProfileSetting] = useState(false);

    const handleProfileSetting = () => {
        setSidebarProfileSetting(true);
    };

    const handleCloseProfileSetting = () => {
        setSidebarProfileSetting(false);
    };

    // React Date Picker
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Set sow buttons on hover
    const [hoveredIndexText, setHoveredIndexText] = useState(null);
    const [hoveredIndexRecentText, setHoveredIndexRecentText] = useState(null);

    const handleMouseEnterText = (index) => {
        setHoveredIndexText(index);
    };

    const handleMouseLeaveText = () => {
        setHoveredIndexText(null);
    };

    const handleMouseEnterRecentText = (index) => {
        setHoveredIndexRecentText(index);
    };

    const handleMouseLeaveRecentText = () => {
        setHoveredIndexRecentText(null);
    };

    return (
        <>
            <Col lg={2} className='d-flex flex-column'>
                <Tab.Container id="left-tabs-example" defaultActiveKey="chats">
                    <Row className='d-flex justify-content-between align-items-center col-lg-12'>
                        <Col lg={10} className='px-0'><Image src={SidebarLogo} alt="Logo" fluid style={{ padding: '10px', width: '150px', height: '80px' }} /></Col>
                        <Col lg={2} className='px-0'><Button><i className="bi bi-trello"></i></Button></Col>
                    </Row>
                    <Row>
                        <Col lg={12} className='py-0'>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item><Nav.Link as={Link} to="/chat" eventKey="chats"><i className="bi bi-chat-left-text me-3 chat"></i> Chats</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="search" onClick={handleSearchModal}><i className="bi bi-search me-3 search"></i>Search</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link as={Link} to='/manage-subscription' eventKey="subscription"><i className="bi bi-card-heading me-3 manage"></i>Manage Subscription</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link as={Link} to={'/updates-faq'} eventKey="updates"><i className="bi bi-kanban me-3 updates"></i>Updates & FAQ</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="settings" onClick={handleProfileSetting}><i className="bi bi-gear me-3 settings"></i>Settings</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link as={Link} to='/audio-library' eventKey="audioLibrary"><i className="bi bi-mic me-3 audio-library"></i>Audio Library</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="imageLibrary"><i className="bi bi-images me-3 image-library"></i>Image Library</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link as={Link} to='/goal-management' eventKey="goalManagement"><i className="bi bi-crosshair2 me-3 goal-management"></i>Goal Management</Nav.Link></Nav.Item>
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
            {/* Sidebar Search Modal */}
            <Modal show={sideSearchModal} onHide={handleCloseSearchModal}>
                <Modal.Header className='p-2'>
                    <div className="input-group">
                        <span className="input-group-text border-0" style={{ backgroundColor: 'white' }}>
                            <i className="bi bi-search"></i>
                        </span>
                        <Form.Control type="email" className='border-0 set-input-field' placeholder="Search" aria-label="Enter email" aria-describedby="basic-addon1" value={searchSidebar} onChange={(e) => setSearchSidebar(e.target.value)} />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="searchSidebar" className='px-2 mx-1'>
                            <div className="input-group mt-1 justify-content-end">
                                <span className="input-group-text border-end-0 rounded-start-5" style={{ backgroundColor: 'white' }}>
                                    <i className="bi bi-clock-fill"></i>
                                </span>
                                <DatePicker selected={selectedDate} onChange={handleDateChange} className="form-control fs-6 border border-variant border-start-0 border-end-0 rounded-0 set-input-field px-0" placeholderText="Date" dateFormat="MM/dd/yyyy" isClearable dropdownMode="scroll" />
                                <span className="input-group-text border-start-0 rounded-end-5 p-0 pe-2" style={{ backgroundColor: 'white' }}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            <Form.Label className='fw-bold pe-2 font-size-small'>Today</Form.Label><small className='font-size-x-small color-dark-grey'> Thu 16 Feb</small>
                            {sidebarSearchText && sidebarSearchText.map((recentText, index) => (
                                <Row className={`sidebar-search-recently ${index === hoveredIndexText ? 'hovered' : ''}`} key={index} onMouseEnter={() => handleMouseEnterText(index)} onMouseLeave={handleMouseLeaveText}>
                                    {
                                        index === hoveredIndexText ? <Col lg={8} className='pe-0'>
                                            <a href="#!" className='mb-1 py-2 d-block'>
                                                <strong className='d-block font-size-small'>{recentText.heading}</strong>
                                                <small className='font-size-x-small color-dark-grey'>{recentText.text}</small>
                                            </a>
                                        </Col> : <Col lg={10} className='pe-0'>
                                            <a href="#!" className='mb-1 py-2 d-block'>
                                                <strong className='d-block font-size-small'>{recentText.heading}</strong>
                                                <small className='font-size-x-small color-dark-grey'>{recentText.text}</small>
                                            </a>
                                        </Col>
                                    }

                                    {
                                        index === hoveredIndexText ? <Col lg={4} className="hover-buttons d-flex justify-content-between align-items-center">
                                            <Button size='sm' className='py-0 px-1 font-size-x-small' variant="light">Move Chat</Button>{' '}
                                            <Button size='sm' className='py-0 px-1 font-size-x-small' variant="light">Jump</Button>{' '}
                                        </Col> : <Col lg={2} className='d-flex justify-content-end ps-0'>
                                            <small className='font-size-x-small color-dark-grey d-flex align-items-center'>1m ago</small></Col>
                                    }
                                </Row>
                            ))
                            }
                            <Form.Label className='fw-bold pe-2 font-size-small'>Last 30 days</Form.Label>
                            {sidebarSearchRecentText && sidebarSearchRecentText.map((recentText, index) => (
                                <Row className={`sidebar-search-recently ${index === hoveredIndexRecentText ? 'hovered' : ''}`} key={index} onMouseEnter={() => handleMouseEnterRecentText(index)} onMouseLeave={handleMouseLeaveRecentText}>
                                    {
                                        index === hoveredIndexRecentText ? <Col lg={8} className='pe-0'>
                                            <a href="#!" className='mb-1 py-2 d-block'>
                                                <strong className='d-block font-size-small'>{recentText.heading}</strong>
                                                <small className='font-size-x-small color-dark-grey'>{recentText.text}</small>
                                            </a>
                                        </Col> : <Col lg={10} className='pe-0'>
                                            <a href="#!" className='mb-1 py-2 d-block'>
                                                <strong className='d-block font-size-small'>{recentText.heading}</strong>
                                                <small className='font-size-x-small color-dark-grey'>{recentText.text}</small>
                                            </a>
                                        </Col>
                                    }
                                    {
                                        index === hoveredIndexRecentText ? <Col lg={4} className="hover-buttons d-flex justify-content-between align-items-center">
                                            <Button size='sm' className='py-0 px-1 font-size-x-small' variant="light">Move Chat</Button>{' '}
                                            <Button size='sm' className='py-0 px-1 font-size-x-small' variant="light">Jump</Button>{' '}
                                        </Col> : <Col lg={2} className='d-flex justify-content-end ps-0'>
                                            <small className='font-size-x-small color-dark-grey d-flex align-items-center'>1m ago</small></Col>
                                    }
                                </Row>
                            ))}
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
            {/* Sidebar Profile Setting Modal */}
            <Modal show={sidebarProfileSetting} onHide={handleCloseProfileSetting}>
                <Modal.Body>
                    {/* Left Sidebar with Sidebar Tabs */}
                    <Col className="left-sidebar">
                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                            <Row>
                                <Col lg={4}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link eventKey="editProfile"><i class="bi bi-person-fill"></i> Edit Profile</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="password"><i class="bi bi-shield-lock-fill"></i> Password</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="notification"><i class="bi bi-bell-fill"></i> Notification</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="chatSupport"><i class="bi bi-arrow-down-circle-fill"></i> Chat Support</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="billingDetails"><i class="bi bi-arrow-down-circle-fill"></i> Billing Details</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="sessions"><i class="bi bi-arrow-right-circle-fill"></i> Sessions</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="appearance"><i class="bi bi-brightness-high-fill"></i> Appearance</Nav.Link>
                                        </Nav.Item>
                                        <hr />
                                        <Nav.Item>
                                            <Nav.Link eventKey="deleteAccount"><i class="bi bi-x"></i> Delete Account</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col lg={8}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="editProfile">
                                            <Col><p className='fw-bold fs-5'>Edit Profile</p></Col>
                                            <Col>
                                                <Form.Label className='fw-bold'>Avatar</Form.Label>
                                                <Col lg={12} className='d-flex justify-content-start align-items-center px-0 pb-1'>
                                                    <Col lg={4}><Image src={UkLogo} alt="Circular Image" roundedCircle className='avatar-profile-img' /></Col>
                                                    <Col lg={8}>
                                                        <Button className='btn btn-sm'>Upload new image</Button>
                                                        <p className='mb-0 d-block d-grid'>
                                                            <p className='d-grid color-darkgray fs-7'>At least 800x800 px recommended.<small>JPG or PNG and GIF is allowed</small></p>
                                                        </p>
                                                    </Col>
                                                </Col>
                                            </Col>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="password">Second tab content</Tab.Pane>
                                        <Tab.Pane eventKey="notification">First tab content</Tab.Pane>
                                        <Tab.Pane eventKey="chatSupport">Second tab content</Tab.Pane>
                                        <Tab.Pane eventKey="billingDetails">First tab content</Tab.Pane>
                                        <Tab.Pane eventKey="sessions">Second tab content</Tab.Pane>
                                        <Tab.Pane eventKey="appearance">First tab content</Tab.Pane>
                                        <Tab.Pane eventKey="deleteAccount">Second tab content</Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Sidebar;