import React from 'react';
import { Button, Col, Image, Dropdown, DropdownButton, Form, } from 'react-bootstrap';
import UkLogo from '../../../assets/images/UK-flag-logo.png';


const GoalDetail = () => {

    // Goal Details Dummy Text
    const goalDetails = [
        {
            label: 'Goal Name',
            heading: 'Figma design courses - Test'
        },
        {
            label: 'Status',
            heading: 'In Progress'
        },
        {
            label: 'End date',
            heading: <span><i className="bi bi-calendar4"></i> 26 June 2023</span>
        },
        {
            label: 'Notifications Reminder',
            heading: 'Yes'
        },
        {
            label: 'Reminder Frequency',
            heading: '2 hours before'
        },
        {
            label: 'Write key Points',
            heading: '1 is compulsory and 3 is optional'
        }
    ]

    return (
        <>
            <Col className='rounded-end px-0' lg={3} style={{ backgroundColor: 'white', borderBlockEnd: '1px solid black' }}>
                <Col className='d-flex justify-content-end align-items-center py-2 px-4'>
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
                    <Button variant="dark" className='mx-1 p-1 btn-sm px-2' style={{ color: 'white' }} >Share</Button>
                </Col>
                <Col lg={12} style={{ backgroundColor: '#f7f7f7', height: '86vh' }}>
                    <Col lg={12} className='d-flex justify-content-center py-3'>
                        <Col lg={11} className='rounded-2 py-1 px-1'>
                            <Col className='d-flex justify-content-between align-items-center pb-2'>
                                <p className='mb-0 fw-bold fs-4'>Goal Details</p>
                                <Button className='me-1 px-2 py-1 border border-2 rounded-0' variant='light' >Edit Goal</Button>
                            </Col>
                        </Col>
                    </Col>
                    <Col lg={12} >
                        <Col lg={10} className='d-grid justify-content-center'>
                            {
                                goalDetails && goalDetails.map((goal, key) => (
                                    <Col key={key}>
                                        <Form.Text className='color-darkgray fs-7'>{goal.label}</Form.Text>
                                        <p className='fw-medium mb-2'>{goal.heading}</p>
                                        <hr className='color-darkgray my-2' />
                                    </Col>
                                ))
                            }
                        </Col>
                    </Col>
                </Col>
            </Col>
        </>
    );
}

export default GoalDetail;
