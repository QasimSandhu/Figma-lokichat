import React, { useState } from 'react';
import { Tab, Container, Row, Col, Image, Tabs, InputGroup, Dropdown, FormControl, DropdownButton, DropdownDivider } from 'react-bootstrap';
import './style.css';
import UkLogo from '../../../assets/images/UK-flag-logo.png';
import Sidebar from '../Sidebar';
import AudioSection from './AudioSection';

const Home = () => {

    // Is Active Language Profile Icon
    const [selectLanguage, setSelectLanguage] = useState('Spanish');

    const handleLanguageIconActive = (language) => {
        setSelectLanguage(language);
    };

    return (
        <Container fluid >
            <Row className='p-3' style={{ background: '#141414', height: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />
                {/* Chat Page */}
                <Col className='rounded-start px-0 border-end border-2 border-black' lg={7} style={{ backgroundColor: 'white' }}>
                    <Col className='d-flex justify-content-between align-items-center py-2 px-4'>
                        <h3>Hello Jack</h3>
                        <DropdownButton drop='down-centered' key={'down-centered'} className='profile-dropdown-bg' id="profile-dropdown" title={<Image src={UkLogo} alt="Circular Image" className='language-image-active' roundedCircle />}>
                            <Dropdown.Item> <h6>Selec Language</h6> </Dropdown.Item>
                            <DropdownDivider className='m-0'></DropdownDivider>
                            <Col className='d-flex justify-content-between'>
                                <Dropdown.Item className='d-grid'>
                                    <Image src={UkLogo} alt="Circular Image" onClick={() => handleLanguageIconActive('English')} className='border border-1 language-image-active' roundedCircle />
                                    {selectLanguage === 'English' && <i className="bi bi-check-circle language-image-active-icon"></i>}English
                                </Dropdown.Item>
                                <Dropdown.Item className='d-grid'>
                                    <Image src={UkLogo} alt="Circular Image" onClick={() => handleLanguageIconActive('Spanish')} className='border border-1 language-image-active' roundedCircle />
                                    {selectLanguage === 'Spanish' && <i className="bi bi-check-circle language-image-active-icon"></i>}Spanish
                                </Dropdown.Item>
                            </Col>
                        </DropdownButton>
                    </Col>
                    <Col lg={12} style={{ backgroundColor: '#f7f7f7', paddingBottom: '14rem' }}>
                        <Col lg={12} className='d-flex justify-content-center py-4'>
                            <Col lg={8} className='rounded-2 d-flex justify-content-center py-1 px-1' style={{ backgroundColor: '#d6d6d6' }}>
                                <Tabs className='tabs-button' defaultActiveKey="lokiChatModel" id="justify-tab-example">
                                    <Tab eventKey="lokiChatModel" title="Loki Chat Model"></Tab>
                                    <Tab eventKey="gpt" title={<span><i className="bi bi-lightning-charge"></i> GPT 3.5</span>}></Tab>
                                    <Tab eventKey="copywriting" title={<span><i className="bi bi-journal-text me-2"></i> Copywriting</span>}></Tab>
                                </Tabs>
                            </Col>
                        </Col>
                        <Row lg={12} className='d-flex justify-content-center' style={{ margin: 0 }}>
                            <Col lg={11} className='rounded-3 py-3 px-3' style={{ backgroundColor: '#f0f0f0' }}>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio dolores esse exercitationem qui ipsa, earum laboriosam. Similique soluta labore quibusdam. Ab dolore architecto fugiat natus asperiores officiis odio accusamus nemo!</p>

                                <Tabs className='chat-button pb-5' defaultActiveKey="startChat" id="justify-tab-example">
                                    <Tab eventKey="startChat" title={<span><i className="bi bi-chat-dots"></i> Start Chat</span>}></Tab>
                                    <Tab eventKey="startDebate" title={<span><i className="bi bi-gear-wide-connected"></i> Start Debate</span>}></Tab>
                                    <Tab eventKey="photoGeneration" title={<span><i className="bi bi-brilliance"></i> Photo generation</span>}></Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Col>
                    <Col className='d-flex justify-content-between py-3 px-4'>
                        <InputGroup className='d-flex justify-content-between'>
                            <Dropdown>
                                <Dropdown.Toggle className='d-flex justify-content-center align-items-center rounded-circle' variant="outline-secondary" id="dropdown-custom-components">+</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="1"><span><i className="bi bi-translate"></i> Document Translation</span></Dropdown.Item>
                                    <Dropdown.Item eventKey="2"><span><i className="bi bi-calendar2-check"></i> Summarize Document</span></Dropdown.Item>
                                    <Dropdown.Item eventKey="3"><span><i className="bi bi-pencil-square"></i> Exam Me</span></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <FormControl as={'textarea'} className='mx-4' placeholder="Type here..." aria-label="Type here..." aria-describedby="basic-addon2" />
                            <InputGroup.Text className="chat-field-arrow rounded-3 my-2">
                                <i className="bi bi-arrow-up"></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Col>
                </Col>
                {/* Right Audio Section */}
                <AudioSection />
            </Row >
        </Container >
    );
};

export default Home;