import React, { useState } from 'react';
import { Modal, Button, Form, ButtonGroup, Col, Row, Container, Image, Dropdown, InputGroup, DropdownButton, } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import UkLogo from '../../../assets/images/UK-flag-logo.png';

const AudioSection = () => {

    // Set Dummy Content
    const sampleArr = [1, 2, 3, 4, 5, 6, 7, 8];
    const [selectedNotebooks, setSelectedNotebooks] = useState([]);

    const handleCheckboxChange = (id) => {
        setSelectedNotebooks((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleClear = () => {
        setSelectedNotebooks([]);
    };

    // Set Share Chat Modal 
    const [shareChat, setShareChat] = useState(false);

    const handleShareChat = () => {
        setShareChat(true);
    };

    const handleCloseChat = () => {
        setShareChat(false);
    };

    // Set New debate Modal 
    const [newDebate, setNewDebate] = useState(false);

    const handleNewDebate = () => {
        setNewDebate(true);
    };

    const handleCloseDebate = () => {
        setNewDebate(false);
    };

    // Set Add New Document Modal 
    const [addDocument, setAddDocument] = useState(false);

    const handleAddDocument = () => {
        setAddDocument(true);
    };

    const handleCloseDocument = () => {
        setAddDocument(false);
    };

    // Copy text from input field
    const [link, setLink] = useState('');

    const handleCopyButtonClick = () => {
        console.log('Link copied:', link);
    };

    return (
        <>
            <Col className='rounded-end px-0' lg={3} style={{ backgroundColor: 'white', borderBlockEnd: '1px solid black' }}>
                <Col className='d-flex justify-content-end align-items-center py-2 px-4'>
                    <Button variant="dark" className='mx-1 p-1 btn-sm' style={{ color: 'white' }} onClick={handleShareChat}>Share</Button>
                    <span><i className="bi bi-bounding-box-circles mx-3"></i></span>
                    <DropdownButton className='profile-dropdown-bg' id="profile-dropdown" title={<Image src={UkLogo} alt="Circular Image" className='p-2 profile-dropdown' roundedCircle />
                    }>
                        <Dropdown.Item>
                            <Image src={UkLogo} alt="Profile Image" roundedCircle style={{ width: '30px', height: '30px' }}
                            /><span className="ml-2 ps-2"><b>Tran Mau Tri Tam</b></span>
                        </Dropdown.Item>
                        <Col className='user-profile-dropdown-bg mx-2 mt-2 rounded-top-2'>
                            {/* Inner Dropdown */}
                            <Dropdown.Item className='m-0 px-3 py-1'>
                                <DropdownButton id="nested-dropdown" title={<><i className="bi bi-circle-fill pe-2"></i> Switch to Super User</>} drop="end"></DropdownButton>
                            </Dropdown.Item>
                        </Col>
                        <Col className='mx-2 rounded-bottom-2' style={{ backgroundColor: '#f0f0f0' }}>
                            <Dropdown.Item><i className="bi bi-arrow-down-circle pe-2"></i> New version available</Dropdown.Item>
                            <Dropdown.Item><i className="bi bi-box-arrow-right pe-2"></i> Log out</Dropdown.Item>
                        </Col>
                    </DropdownButton>
                </Col>
                <Col lg={12} style={{ backgroundColor: '#f7f7f7' }}>
                    <Col lg={12} className='d-flex justify-content-center py-4'>
                        <Col lg={11} className='rounded-2 py-1 px-1'>
                            <Row className='d-flex justify-content-between align-items-center pb-2'>
                                <Col lg={5} className='pe-0'><p className='mb-0'>Live Notebook<span style={{ backgroundColor: '#E9ECEF' }} className='rounded-2 ms-1 px-1'>{sampleArr.length}</span></p></Col>
                                <Col lg={7} className='d-flex justify-content-end'>
                                    <Button className='me-1 px-2 py-1' style={{ backgroundColor: 'dodgerblue', color: 'white' }} onClick={handleAddDocument}>+</Button>
                                    <Button className='me-1 px-2 py-1' variant='secondary' style={{ color: 'white' }}><i className="bi bi-file-earmark-pdf"></i></Button>
                                    <Button className='me-1 px-2 py-1' variant='secondary' style={{ color: 'white' }}><i className="bi bi-file-earmark-text"></i></Button>
                                    <Button className='me-1 px-2 py-1' variant='secondary' style={{ color: 'white' }} onClick={handleClear}>Clear</Button>
                                </Col>
                            </Row>
                            {sampleArr && sampleArr.map((id) => (
                                <div className="input-group py-1" key={id}>
                                    <span className="input-group-text border-end-0" style={{ backgroundColor: '#E9ECEF' }}>
                                        <input className="form-check-input" type="checkbox" id={`checkbox-${id}`} checked={selectedNotebooks.includes(id)} onChange={() => handleCheckboxChange(id)} style={{ boxShadow: 'unset' }}
                                        />
                                    </span>
                                    <Form.Control type="text" disabled className='border border-variant border-start-0' placeholder="Name Member" aria-label="Enter text" aria-describedby="basic-addon1" style={{ fontSize: 'small', borderLeft: 'none', boxShadow: 'unset' }}
                                    />
                                </div>
                            ))}
                        </Col>
                    </Col>
                    <Col lg={12} className='rounded-4' style={{ backgroundColor: '#E9ECEF' }} >
                        <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                        <Col lg={12} className='d-flex justify-content-center pb-2'>
                            <Col lg={11} className='d-flex justify-content-between'>
                                <InputGroup className=''>
                                    <Dropdown>
                                        <Dropdown.Toggle className='toggle-icon p-1 m-1' size='sm' variant="dark">Export <i class="bi bi-upload"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='col-lg-11'>
                                            <Dropdown.Header className='d-flex justify-content-between'>
                                                <span>Exporting 1 audio</span><i className="bi bi-x-lg" onClick={handleCloseChat}></i>
                                            </Dropdown.Header> <hr className='m-0' />

                                            <Dropdown.Item eventKey="1">
                                                <span size='sm'>Export</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="2">
                                                <span><i className="bi bi-music-note-beamed"></i> .MP3</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="3">
                                                <span><i className="bi bi-music-note"></i> .WAV</span>
                                            </Dropdown.Item> <hr className='m-0' />

                                            <Dropdown.Item className="text-right">
                                                <span>Share</span><br />
                                                <span><i className="bi bi-link-45deg"></i> Get a link</span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Button variant="light" className='btn-sm p-1 m-1'>Edit <i className="bi bi-pencil"></i></Button>
                                    <Dropdown.Toggle className='btn-sm p-1 m-1' variant="light">English(US)</Dropdown.Toggle>

                                    <Dropdown as={ButtonGroup}>
                                        <Button variant="light" className='p-1 ms-1 my-1 btn-sm'><div className="d-flex justify-content-between"><span className='border-end pe-1'>Speed</span><span className="border-end"></span><span className='ps-1'>465</span></div></Button>
                                        <Dropdown.Toggle split className='p-1 btn-sm my-1' variant="light" id="dropdown-custom-2" />
                                    </Dropdown>

                                    <Dropdown as={ButtonGroup}>
                                        <Button variant="light" className='p-1 ms-1 my-1 btn-sm'><div className="d-flex justify-content-between"><span className='border-end pe-1'>Voice</span><span className="border-end"></span><span className='ps-1'>Female</span></div></Button>
                                        <Dropdown.Toggle split className='p-1 btn-sm my-1' variant="light" id="dropdown-custom-2" />
                                        <Button variant="light" className='p-1 my-1 btn-sm'><div className="d-flex justify-content-between"><span className='border-start ps-1'><i className="bi bi-volume-up-fill"></i> Jenny</span></div>
                                        </Button>
                                        <Dropdown.Toggle split className='p-1 btn-sm my-1' variant="light" id="dropdown-custom-2" />
                                    </Dropdown>

                                    <Dropdown.Toggle className='btn-sm p-1 m-1' variant="light"><i className="bi bi-emoji-smile"></i> Friendly </Dropdown.Toggle>
                                </InputGroup>
                            </Col>
                        </Col>
                    </Col>
                    <Col lg={12} className='d-flex justify-content-center' >
                        <Col lg={11} className='d-flex justify-content-between py-3'>
                            <Button variant="primary" className='col-lg-6 me-1 p-1 align-items-center btn-sm' style={{ color: 'white' }} onClick={handleShareChat}><i className="bi bi-plus-lg"></i> New chat</Button>
                            <Button className='col-lg-6 ms-1 p-1 align-items-center btn-sm' style={{ color: 'white', backgroundColor: '#8d3eb0' }} onClick={handleNewDebate}><i className="bi bi-plus-lg"></i> New debate</Button>
                        </Col>
                    </Col>
                </Col>
            </Col>
            {/* Share Chat Modal */}
            <Modal show={shareChat} centered onHide={handleCloseChat}>
                <Modal.Header closeButton>
                    <Modal.Title>Share this Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className="mb-3">
                            <Form.Label className='px-0' style={{ fontWeight: 'bold', color: 'black' }}>Copy Link</Form.Label>
                            <Col className='px-0'>
                                <Form.Control type="text" placeholder="https://icons.getbootstrap.com/" value={link} onChange={(e) => setLink(e.target.value)} />
                            </Col>
                            <Col xs="auto" className='px-0'>
                                <Button variant="dark" style={{ color: 'white' }} onClick={handleCopyButtonClick}>Copy</Button>
                            </Col>
                            <Form.Label className='px-0 pt-5' style={{ color: 'black' }}>Or share to remembers</Form.Label>
                            <div className="input-group mt-3">
                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'white' }}>
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <Form.Control type="email" className='border border-variant border-start-0' placeholder="Name Member" aria-label="Enter email" aria-describedby="basic-addon1" style={{ fontSize: 'small', borderLeft: "none", boxShadow: "unset", borderColor: "floralwhite" }} />
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="white border border-variant" onClick={handleCloseChat}>Cancel</Button>
                    <Button variant="primary border border-variant" onClick={handleCloseChat}>Share</Button>
                </Modal.Footer>
            </Modal>
            {/* New Debate Modal */}
            <Modal show={newDebate} centered onHide={handleCloseDebate}>
                <Modal.Body>
                    <Modal.Title className='pb-3'>Start your debate</Modal.Title>
                    <Container>
                        <Row className="mb-3 border border-#d4d4d4 rounded-2 p-3">
                            <Form.Label className='px-0' style={{ color: 'black' }}>Debate Title</Form.Label>
                            <Col className='px-0'>
                                <Form.Control type="text" placeholder="New Term" value={link} onChange={(e) => setLink(e.target.value)} />
                            </Col>
                            <Form.Label className='px-0 pt-2' style={{ color: 'black' }}>Add users to the chat</Form.Label>
                            <div className="input-group p-0">
                                <span className="input-group-text border-end-0" style={{ backgroundColor: 'white' }}>
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <Form.Control type="email" className='border border-variant border-start-0' placeholder="Name Member" aria-label="Email Address" aria-describedby="basic-addon1" style={{ fontSize: 'small', borderLeft: "none", boxShadow: "unset", borderColor: "floralwhite" }} />
                                <Col xs="auto" className='ms-2'>
                                    <Button variant="light" onClick={handleCopyButtonClick}>Invite</Button>
                                </Col>
                            </div>
                            <Form.Label className='px-0 pt-2' style={{ color: 'black' }}>Users added to the chat</Form.Label>
                            <Col lg={12} className='d-flex justify-content-start align-items-center px-0 pb-1'>
                                <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                <p className='mb-0 d-block col-lg-10 d-grid'>
                                    <strong>Smith Roman</strong><small>smithroman@gmail.com</small>
                                </p>
                                <i className="bi bi-x"></i>
                            </Col>
                            <Col lg={12} className='d-flex justify-content-start align-items-center px-0 pb-1'>
                                <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                <p className='mb-0 d-block col-lg-10 d-grid'>
                                    <strong>Smith Roman</strong><small>smithroman@gmail.com</small>
                                </p>
                                <i className="bi bi-x"></i>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-end'>
                                <Button className='me-2' variant="white border border-variant" onClick={handleCloseDebate}>Cancel</Button>
                                <Button variant="primary border border-variant" onClick={handleCloseDebate}>Start Debate</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
            {/* Add New Document */}
            <Modal show={addDocument} centered onHide={handleCloseDocument}>
                <Modal.Body>
                    <Container>
                        <Row className="mb-3 rounded-2 p-2">
                            <Form.Label className='px-0' style={{ color: 'black' }}>Please select the option</Form.Label>
                            <Col className='d-flex justify-content-center px-0 py-2'>
                                <Col className='border border-#d4d4d4 rounded-2 p-3 '>
                                    <Col className='border border-#d4d4d4 rounded-2 p-3 d-flex justify-content-center' style={{ backgroundColor: 'dodgerblue' }}><i className="bi bi-translate"></i></Col>
                                    <Form.Text style={{ fontSize: '10px', fontWeight: 'bold' }}>Document Translation</Form.Text>
                                </Col>
                                <Col className='border border-#d4d4d4 rounded-2 p-3 mx-2'>
                                    <Col className='border border-#d4d4d4 rounded-2 p-3 d-flex justify-content-center' style={{ backgroundColor: 'dodgerblue' }}><i className="bi bi-journal-check"></i></Col>
                                    <Form.Text style={{ fontSize: '10px', fontWeight: 'bold' }}>Summarize Document</Form.Text>
                                </Col>
                                <Col className='border border-#d4d4d4 rounded-2 p-3 '>
                                    <Col className='border border-#d4d4d4 rounded-2 p-3 d-flex justify-content-center' style={{ backgroundColor: 'dodgerblue' }}><i className="bi bi-journal-text"></i></Col>
                                    <Form.Text style={{ fontSize: '10px', fontWeight: 'bold' }}>Exam Me</Form.Text>
                                </Col>
                            </Col>
                            <Button variant="primary border border-variant mt-2" onClick={handleCloseDocument}>Next</Button>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AudioSection;
