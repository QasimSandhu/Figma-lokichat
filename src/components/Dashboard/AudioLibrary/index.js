import React, { useState } from 'react';
import { Tab, Container, Row, Col, Tabs, Form, Button, Image } from 'react-bootstrap';
import Sidebar from '../Sidebar';
import AudioSection from '../Chat/AudioSection';
import './style.css';
import ReactPlayer from 'react-player';
import UkLogo from '../../../assets/images/UK-flag-logo.png'
import DatePicker from 'react-datepicker';


const AudioLibrary = () => {
    const avatarImages = [
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp',
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-3.webp',
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-4.webp',
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp',
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp',
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-3.webp',
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-4.webp',
        'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp',
    ];

    const maxVisibleAvatarImages = 3;

    // React Date Picker
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <Container fluid >
            <Row className='p-3 page-bg-color'>
                {/* Sidebar */}
                <Sidebar />
                {/* Chat Page */}
                <Col className='rounded-start px-0 border-end border-2 border-black chat-page-bg' lg={7} >
                    <Col className='d-flex justify-content-between align-items-center pt-3 py-2 px-4'>
                        <Col lg={10}><h3>Hello Jack</h3></Col>
                        <Col lg={2} className='d-flex justify-content-between align-items-center p-2'>
                            <i className="bi bi-star"></i>
                            <i className="bi bi-bookmark"></i>
                            <i className="bi bi-upload"></i>
                            <i className="bi bi-three-dots"></i>
                        </Col>
                    </Col>
                    <Col lg={12} className='caht-page-bg-color px-4'>
                        <Col className='d-flex justidy-content-between pt-3'>
                            <Col lg={8}>
                                <h1><b>Audio Library</b></h1>
                            </Col>
                            <Col lg={4}>
                                <Form.Group controlId="dob">
                                    <div className="input-group mt-3">
                                        <span className="input-group-text border-end-0" style={{ backgroundColor: 'white' }}>
                                            <i className="bi bi-clock-fill"></i>
                                        </span>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            className="px-0 form-control fs-6 border border-variant border-start-0 border-end-0 rounded-0 set-input-field"
                                            placeholderText="Date"
                                            dateFormat="MM/dd/yyyy"
                                            isClearable
                                            dropdownMode="scroll"
                                        />
                                        <span className="p-0 pe-2 input-group-text border-start-0 rounded-end-2" style={{ backgroundColor: 'white' }}>
                                            <i className="bi bi-calendar3 ps-1"></i>
                                        </span>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Col>
                        <Col>
                            <Tabs defaultActiveKey="yourAudios" id="tab-example" className='border-0 audios-button m-3'>
                                <Tab eventKey="yourAudios" title='Your Audios'>
                                    <Row>
                                        <Col lg={12} className='d-flex justify-content-center'>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-5'>Paul</p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col className="d-flex align-items-center avatar-pf-images col-lg-10">
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-5'>Paul</p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col className="d-flex align-items-center avatar-pf-images col-lg-10">
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-5'>Paul</p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col className="d-flex align-items-center avatar-pf-images col-lg-10">
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                        </Col>
                                        <p>Previous 30 Days</p>
                                        <Col lg={12} className='d-flex justify-content-center pb-5'>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-5'>Paul</p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col className="d-flex align-items-center avatar-pf-images col-lg-10">
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-5'>Paul</p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col className="d-flex align-items-center avatar-pf-images col-lg-10">
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-5'>Paul</p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col className="d-flex align-items-center avatar-pf-images col-lg-10">
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="sharedAudios" title='Shared Audios'>
                                    <Row>
                                        <Col lg={12} className='d-flex justify-content-center'>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-6 fs-7'><b>New Recording 1901</b></p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col lg={12} className="d-flex align-items-center avatar-pf-images justify-content-end">
                                                        <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                                        <p className='mb-0 d-block col-lg-6 d-grid'>
                                                            <strong>John Doe</strong><small>Author</small>
                                                        </p>
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-6 fs-7'><b>New Recording 1901</b></p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col lg={12} className="d-flex align-items-center avatar-pf-images justify-content-end">
                                                        <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                                        <p className='mb-0 d-block col-lg-6 d-grid'>
                                                            <strong>John Doe</strong><small>Author</small>
                                                        </p>
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-6 fs-7'><b>New Recording 1901</b></p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col lg={12} className="d-flex align-items-center avatar-pf-images justify-content-end">
                                                        <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                                        <p className='mb-0 d-block col-lg-6 d-grid'>
                                                            <strong>John Doe</strong><small>Author</small>
                                                        </p>
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                        </Col>
                                        <p>Previous 30 Days</p>
                                        <Col lg={12} className='d-flex justify-content-center pb-5'>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-6 fs-7'><b>New Recording 1901</b></p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col lg={12} className="d-flex align-items-center avatar-pf-images justify-content-end">
                                                        <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                                        <p className='mb-0 d-block col-lg-6 d-grid'>
                                                            <strong>John Doe</strong><small>Author</small>
                                                        </p>
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-6 fs-7'><b>New Recording 1901</b></p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col lg={12} className="d-flex align-items-center avatar-pf-images justify-content-end">
                                                        <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                                        <p className='mb-0 d-block col-lg-6 d-grid'>
                                                            <strong>John Doe</strong><small>Author</small>
                                                        </p>
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                            <Col lg={4} className='rounded-4 m-1 p-2 audio-sections'>
                                                <Col className='d-flex justify-content-between align-items-center py-1'>
                                                    <p className='mb-0 col-lg-6 fs-7'><b>New Recording 1901</b></p>
                                                    <Button className='p-1 btn-sm border-0 coading-bg-color'>Coading</Button>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Col>
                                                <Col>
                                                    <p>22-06-23-12:56 PM</p>
                                                    <ReactPlayer className='py-2' url='https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3' controls width='100%' height='50px' />
                                                </Col>

                                                <Col className="d-flex justify-content-center align-items-center">
                                                    <Col lg={12} className="d-flex align-items-center avatar-pf-images justify-content-end">
                                                        <Image src={UkLogo} alt="Circular Image" roundedCircle className='debate-image-add' />
                                                        <p className='mb-0 d-block col-lg-6 d-grid'>
                                                            <strong>John Doe</strong><small>Author</small>
                                                        </p>
                                                        {avatarImages.slice(0, maxVisibleAvatarImages).map((image, index) => (
                                                            <Image key={index} width="35" src={image} alt={`avatar-${index}`} className="rounded-circle" fluid />
                                                        ))}
                                                        {avatarImages.length > maxVisibleAvatarImages && (
                                                            <span className="rounded-circle avatar-count-images d-flex justify-content-center align-items-center">
                                                                +{avatarImages.length - maxVisibleAvatarImages}
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Col>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Col>
                </Col>
                {/* Right Audio Section */}
                <AudioSection />
            </Row >
        </Container >
    );
}

export default AudioLibrary;
