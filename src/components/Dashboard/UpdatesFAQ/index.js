import React from 'react';
import { Accordion, Col, Container, DropdownDivider, Nav, Row, Tab } from 'react-bootstrap';
import Sidebar from '../Sidebar';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdatesFAQ = () => {

    // Dummy Videos
    const updatesText = [
        {
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            text: 'Loki is a powerful Al-driven academic support tool specifiaclly designed to help students excel in their university studies. By providing assistanve in various subjects, Loki is able to answer question and offer in-depth explanations, as well as practical examples to enhance understanding. Beyond subject-specific support, Loki also assists students with setting and managing their study goals, enabling them to track progress and stay on track for academix success. By facilitating efficient learning, students can maximize their study time, grap complex concepts more easily, and ultimately achieve better results. Experience the benefits of Loki and unlock your full academic potential today.',
            icon: <i className="bi bi-box"></i>,
            heading: '"Unlock Your Academic Potential with Loki: The Ultimate AI Study Companion"',
            date: '22 Feb 2023'
        },
        {
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            text: 'Loki is a powerful Al-driven academic support tool specifiaclly designed to help students excel in their university studies. By providing assistanve in various subjects, Loki is able to answer question and offer in-depth explanations, as well as practical examples to enhance understanding. Beyond subject-specific support, Loki also assists students with setting and managing their study goals, enabling them to track progress and stay on track for academix success. By facilitating efficient learning, students can maximize their study time, grap complex concepts more easily, and ultimately achieve better results. Experience the benefits of Loki and unlock your full academic potential today.',
            icon: <i className="bi bi-box"></i>,
            heading: '"Unlock Your Academic Potential with Loki: The Ultimate AI Study Companion"',
            date: '22 Feb 2023'
        },
        {
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            text: 'Loki is a powerful Al-driven academic support tool specifiaclly designed to help students excel in their university studies. By providing assistanve in various subjects, Loki is able to answer question and offer in-depth explanations, as well as practical examples to enhance understanding. Beyond subject-specific support, Loki also assists students with setting and managing their study goals, enabling them to track progress and stay on track for academix success. By facilitating efficient learning, students can maximize their study time, grap complex concepts more easily, and ultimately achieve better results. Experience the benefits of Loki and unlock your full academic potential today.',
            icon: <i className="bi bi-box"></i>,
            heading: '"Unlock Your Academic Potential with Loki: The Ultimate AI Study Companion"',
            date: '22 Feb 2023'
        },
        {
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            text: 'Loki is a powerful Al-driven academic support tool specifiaclly designed to help students excel in their university studies. By providing assistanve in various subjects, Loki is able to answer question and offer in-depth explanations, as well as practical examples to enhance understanding. Beyond subject-specific support, Loki also assists students with setting and managing their study goals, enabling them to track progress and stay on track for academix success. By facilitating efficient learning, students can maximize their study time, grap complex concepts more easily, and ultimately achieve better results. Experience the benefits of Loki and unlock your full academic potential today.',
            icon: <i className="bi bi-box"></i>,
            heading: '"Unlock Your Academic Potential with Loki: The Ultimate AI Study Companion"',
            date: '22 Feb 2023'
        },
        {
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            text: 'Loki is a powerful Al-driven academic support tool specifiaclly designed to help students excel in their university studies. By providing assistanve in various subjects, Loki is able to answer question and offer in-depth explanations, as well as practical examples to enhance understanding. Beyond subject-specific support, Loki also assists students with setting and managing their study goals, enabling them to track progress and stay on track for academix success. By facilitating efficient learning, students can maximize their study time, grap complex concepts more easily, and ultimately achieve better results. Experience the benefits of Loki and unlock your full academic potential today.',
            icon: <i className="bi bi-box"></i>,
            heading: '"Unlock Your Academic Potential with Loki: The Ultimate AI Study Companion"',
            date: '22 Feb 2023'
        },
    ]

    // Dummy FAQ tax
    const FAQdata = [
        {
            heading: 'Are there any setup or installation fee?',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat null apariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            heading: 'Are there any setup or installation fee?',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat null apariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            heading: 'Are there any setup or installation fee?',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat null apariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            heading: 'Are there any setup or installation fee?',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat null apariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            heading: 'Are there any setup or installation fee?',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim adminim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat. Duis aute irure dolor inreprehenderit in voluptate velit esse cillum dolore eu fugiat null apariatur. Excepteur sint occaecat cupidatat non proident, sunt inculpa qui officia deserunt mollit anim id est laborum.'
        },
    ]

    return (
        <Container fluid >
            <Row className='p-3' style={{ background: '#141414', height: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />
                <Col className='rounded-top px-5 border-end border-2 border-black' lg={10} style={{ backgroundColor: 'white' }}>
                    <Col className='p-5'>
                        <Row className='px-5'>
                            <Col>
                                <h1 className='fw-bold'>Updates & FAQ</h1>
                                <p className='font-color-darkgray'>Features, fixes & improvements.</p>
                                <Tab.Container defaultActiveKey="updates">
                                    <Nav variant="pills">
                                        <Nav.Item>
                                            <Nav.Link className='background-blue rounded-5 px-3 ms-0 m-2' eventKey="updates">Updates</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='background-blue rounded-5 px-3 m-2' eventKey="faq">FAQ</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="updates">
                                            {
                                                updatesText && updatesText.map((data, key) => (
                                                    <Row key={key} className='mt-4 pt-5'>
                                                        <Col lg={3}>
                                                            <Col lg={1} className='rounded-5 icon-bg-color p-1 d-flex justify-content-center px-3'>{data.icon}</Col>
                                                            <Col>
                                                                <p className='my-3 fw-bold'>{data.heading}</p>
                                                                <p className='font-color-darkgray'>{data.date}</p>
                                                            </Col>
                                                        </Col>
                                                        <Col lg={7} className='px-5'>
                                                            <Col>
                                                                <video className='rounded-top-4' width="100%" controls>
                                                                    <source src={data.videoUrl} type="video/mp4" />
                                                                </video>
                                                                <p className='font-color-darkgray font-size-small mt-4'>{data.text}</p>
                                                            </Col>
                                                        </Col>
                                                    </Row>
                                                ))
                                            }
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="faq" className='pt-5'>
                                            {
                                                FAQdata && FAQdata.map((data, key) => (
                                                    <Accordion defaultActiveKey="0" key={key} flush>
                                                        <Accordion.Item eventKey={key}>
                                                            <DropdownDivider />
                                                            <Accordion.Header className='collapse-remove-bg fw-bold py-2'>{data.heading}</Accordion.Header>
                                                            <Accordion.Body>{data.text}</Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                ))
                                            }
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
}

export default UpdatesFAQ;
