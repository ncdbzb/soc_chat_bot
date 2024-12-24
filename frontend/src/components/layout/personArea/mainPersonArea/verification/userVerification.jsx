import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import '../../mainPersonArea/informationUser.css';
import { Popup } from '../../../popups/popup';
import { useAcceptUserMutation, useGetListUserVerificationMutation, useRejectUserMutation } from '../../../../store/services/admin';

const UserVerification = ({ onClick }) => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [flag, setFlag] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false); // Начальное состояние - кнопки не заблокированы
    const{
        handleSubmit,
    } = useForm();

    const [requestGetListVerification, {
        data: dataListUserVerification,
        status: statusRequestGetListVerification
    }] = useGetListUserVerificationMutation()

    const [requestAcceptUser,{
        status: statusRequestAcceptUser
    }] = useAcceptUserMutation();

    const [requestRejectUser,{
        status: statusRequestRejectUser
    }] = useRejectUserMutation();

    const toggleDropdown = async () => {
        if (!isOpen) {
            requestGetListVerification()
        }
        setIsOpen(!isOpen);
    };

    const acceptRequest = async (id) => {
        await requestAcceptUser(id);
        setDisabledButton(true)
    }

    const rejectRequest = async (id) => {
        setDisabledButton(true)
        await requestRejectUser(id)
    }

    const handleClose = () => {
        setFlag(false);
        setIsOpen(false);
    };
    useEffect(()=>{
        if(statusRequestGetListVerification==='fulfilled'){
            setData(dataListUserVerification)
        }
    },[statusRequestGetListVerification])

    useEffect(()=>{
        if(statusRequestAcceptUser==='fulfilled'){
            setMessage('Заявка на верификацию одобрена!');
            setFlag(true);
        }
    }, [statusRequestAcceptUser])

    useEffect(()=>{
        if(statusRequestRejectUser==='fulfilled'){
            setMessage('Заявка на верификацию отклонена!');
            setFlag(true);
        }
    }, [statusRequestRejectUser])
    
    return (
        <div className="dropdown-container">
            <div className="dropdown">
                {flag && <Popup disabled={disabledButton} isOpen={flag} message={message} onClose={()=>handleClose()} setFlag={setFlag} setDisabledButton={setDisabledButton} />}
                <button className='user-verification' onClick={toggleDropdown}>Пользователи на верификацию</button>
                {isOpen && data.length > 0 && (
                    <ul className='verf-list'>
                        {data.map((item, index) => (
                            <li className='verf-list-item' key={index}>
                                <div className='verf-item-inform'>
                                    <div className='inform-user'>
                                        <p>{item['info'].name}</p>
                                        <p>{item['info'].surname}</p>
                                    </div>
                                    <div className='verf-item-email'>
                                        <p>{item['info'].email}</p>
                                    </div>
                                </div>
                                <div className='verf-item-block-btn container-button'>
                                    <button disabled={disabledButton} className='button' onClick={() => acceptRequest(item['id'])}>Принять</button>
                                    <button disabled={disabledButton} className='button' onClick={() => rejectRequest(item['id'])}>Отклонить</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {isOpen && data.length === 0 && (
                    <div>Нет пользователей на верификацию</div>
                )}
            </div>
        </div>
    );
}

export default UserVerification;