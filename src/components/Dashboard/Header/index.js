import React, { useState } from 'react';
import './style.css';
import UkLogo from '../../../assets/images/UK-flag-logo.png';
import { Col, Dropdown, DropdownButton, DropdownDivider, Image } from 'react-bootstrap';

const Header = () => {

    // Is Active Language Profile Icon
    const [selectLanguage, setSelectLanguage] = useState('Spanish');

    const handleLanguageIconActive = (language) => {
        setSelectLanguage(language);
    };

    return (
        <Col className='px-0' style={{ backgroundColor: 'white' }}>
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
        </Col>
    );
}

export default Header;
