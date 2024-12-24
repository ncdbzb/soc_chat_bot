import React, { useState } from 'react';
import './informationUser.css';
import Leaderboard from '../leaderboard/Leaderboard';
import { Popup } from '../../popups/popup';
import UpdateUserData from './UpdateUserData';
import UpdatePassword from './changePassword/UpdatePassword';
import AccountUser from './AccountUser';
import BilletPassword from './changePassword/BilletPassword';
const InformationUser = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingSave, setIsEditingSave] = useState(false);
    const [flag,setFlag] = useState(false);
    const [message, setMessage] = useState('');

    return (
        <section className='container-person-area'>
            {flag && <Popup isOpen={flag} message={message} setFlag={setFlag}/>}
            <h2>Личные данные</h2>
            <div className='person-area-user'>
                {!isEditingSave ? (
                    <AccountUser setIsEditingSave={setIsEditingSave}/>
                ) : (
                    <UpdateUserData setIsEditingSave={setIsEditingSave}/>
                )}
            </div>
            <>
                {!isEditing ? (
                    <BilletPassword setIsEditing={setIsEditing}/>
                ) : (
                    <UpdatePassword setIsEditing={setIsEditing} setFlag={setFlag} setMessage={setMessage}/>
                )}
            </>
            <Leaderboard />
        </section>
    );
};

export default InformationUser;
