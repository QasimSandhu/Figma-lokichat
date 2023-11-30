import React from 'react';
import { Tab, Container, Row, Col, Nav, Image, Tabs, InputGroup, Dropdown, FormControl } from 'react-bootstrap';
import './style.css';
import UkLogo from '../../../assets/images/UK-flag-logo.png';
import SidebarLogo from '../../../assets/images/login-logo.jpg';

const Sidebar = () => {
    return (
        <Container fluid >
            <Row className='px-3 py-3' style={{ background: '#141414', height: '100vh' }}>
                <Col lg={2} className='d-flex flex-column'>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Image src={SidebarLogo} alt="Logo" fluid style={{ padding: '10px', width: '150px', height: '80px' }} />
                        </Row>
                        <Row>
                            <Col lg={12} className='py-3'>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item><Nav.Link eventKey="chats"><i class="bi bi-chat-left-text me-3"></i> Chats</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="search"><i class="bi bi-search me-3"></i>Search</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="subscription"><i class="bi bi-card-heading me-3"></i>Manage Subscription</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="updates"><i class="bi bi-kanban me-3"></i>Updates & FAQ</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="settings"><i class="bi bi-gear me-3"></i>Settings</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="audioLibrary"><i class="bi bi-mic me-3"></i>Audio Library</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="imageLibrary"><i class="bi bi-images me-3"></i>Image Library</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="goalManagement"><i class="bi bi-crosshair2 me-3"></i>Goal Management</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="referralManagement"><i class="bi bi-people me-3"></i>Referral Management</Nav.Link></Nav.Item>
                                </Nav>
                                <div className='my-3' style={{ flex: '1', borderBottom: '1px solid #bfbdbd' }}></div>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item><Nav.Link eventKey="chatlist"><i class="bi bi-chevron-down me-3"></i>Chat list</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="math"><i className="bi bi-check rounded-1 me-3 text-center" style={{
                                        backgroundColor: '#bfbdbd', border: '1px solid #bfbdbd', color: '#bfbdbd', width: '17px', height: '17px', display: 'inline-block'
                                    }}
                                    ></i>Math</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="architecture" className="d-flex align-items-center"><i className="bi bi-check rounded-1 me-3 text-center" style={{
                                        backgroundColor: '#9a45f5', border: '1px solid #bfbdbd', color: '#9a45f5', width: '17px', height: '17px', display: 'inline-block'
                                    }}
                                    ></i>Architecture</Nav.Link></Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="coding" className="d-flex align-items-center">
                                            <i className="bi bi-check rounded-1 me-3 text-center" style={{
                                                backgroundColor: 'red', border: '1px solid #bfbdbd', color: 'red', width: '17px', height: '17px', display: 'inline-block'
                                            }}></i>Coding
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Tabs defaultActiveKey="light" id="tab-example" className='rounded-2 nav-dark-light' style={{ backgroundColor: '#D6D6D6' }}>
                                        <Tab eventKey="light" title={<span><i class="bi bi-brightness-high-fill"></i> Light</span>} className="bg-light"></Tab>
                                        <Tab eventKey="dark" title={<span><i class="bi bi-moon"></i> Dark</span>} className="bg-dark text-white"></Tab>
                                    </Tabs>
                                </Nav>
                            </Col>
                            {/* <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="chats">First tab content</Tab.Pane>
                                    <Tab.Pane eventKey="search">Second tab content</Tab.Pane>
                                    </Tab.Content>
                                </Col> */}
                        </Row>
                    </Tab.Container>
                </Col>
                {/* Right page */}
                <Col className='rounded-start px-0' lg={7} style={{ backgroundColor: 'white' }}>
                    <Col className='d-flex justify-content-between py-3 px-4'>
                        <h3>Hello Jack</h3>
                        <Image src={UkLogo} alt="Circular Image" roundedCircle style={{ padding: '10px', width: '50px', height: '50px' }}
                        />
                    </Col>
                    <Col lg={12} style={{ backgroundColor: '#f7f7f7', paddingBottom: '14rem' }}>
                        <Col lg={12} className='d-flex justify-content-center py-4'>
                            <Col lg={8} className='rounded-2 d-flex justify-content-center py-1 px-1' style={{ backgroundColor: '#d6d6d6' }}>
                                <Tabs className='tabs-button' defaultActiveKey="lokiChatModel" id="justify-tab-example">
                                    <Tab eventKey="lokiChatModel" title="Loki Chat Model"></Tab>
                                    <Tab eventKey="gpt" title={<span><i class="bi bi-lightning-charge"></i> GPT 3.5</span>}></Tab>
                                    <Tab eventKey="copywriting" title={<span><i className="bi bi-journal-text me-2"></i> Copywriting</span>}></Tab>
                                </Tabs>
                            </Col>
                        </Col>
                        <Row lg={12} className='d-flex justify-content-center' style={{ margin: 0 }}>
                            <Col lg={11} className='rounded-3 py-3 px-3' style={{ backgroundColor: '#f0f0f0' }}>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio dolores esse exercitationem qui ipsa, earum laboriosam. Similique soluta labore quibusdam. Ab dolore architecto fugiat natus asperiores officiis odio accusamus nemo!</p>

                                <Tabs className='chat-button pb-5' defaultActiveKey="startChat" id="justify-tab-example">
                                    <Tab eventKey="startChat" title={<span><i class="bi bi-chat-dots"></i> Start Chat</span>}></Tab>
                                    <Tab eventKey="startDebate" title={<span><i class="bi bi-gear-wide-connected"></i> Start Debate</span>}></Tab>
                                    <Tab eventKey="photoGeneration" title={<span><i class="bi bi-brilliance"></i> Photo generation</span>}></Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Col>
                    <Col className='d-flex justify-content-between py-3 px-4'>
                        <InputGroup className='d-flex justify-content-between'>
                            <Dropdown>
                                <Dropdown.Toggle className='d-flex justify-content-center align-items-center rounded-circle' variant="outline-secondary" id="dropdown-custom-components">+</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="1"><span><i class="bi bi-translate"></i> Document Translation</span></Dropdown.Item>
                                    <Dropdown.Item eventKey="2"><span><i class="bi bi-calendar2-check"></i> Summarize Document</span></Dropdown.Item>
                                    <Dropdown.Item eventKey="3"><span><i class="bi bi-pencil-square"></i> Exam Me</span></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <FormControl className='mx-4' placeholder="Type here..." aria-label="Type here..." aria-describedby="basic-addon2" />
                            <InputGroup.Text className="chat-field-arrow rounded-3 my-2">
                                <i className="bi bi-arrow-up"></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default Sidebar;