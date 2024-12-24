import React from 'react'
import { useSelector } from 'react-redux';
import UserVerification from './verification/userVerification'
import btnEdit from '../../../../img/edit.svg';
const AccountUser = ({setIsEditingSave}) => {
    const userData = useSelector(state => state.updateUser) || null; 
    const handleEditClickSave = () => {
        setIsEditingSave(true);
    };
    return (
        <div className='admin-panel'>
            <div className='user-information'>
                <div className='user-img'></div>
                <div className='inform-list'>
                    <div className='inform-list-item'>
                        <div>{userData.name} {userData.surname}</div>
                        <div>{userData.email}</div>
                        { userData.is_superuser ? (
                                <div>Админ</div>
                            )
                            :(
                                <div>Сотрудник компании</div>
                            )
                        }
                    </div>
                    <a onClick={handleEditClickSave}>
                        <img src={btnEdit} alt='Edit' />
                    </a>
                </div>
            </div>
            {userData.is_superuser && 
                <div className='verification-container'>
                    <UserVerification />
                </div>
            }
        </div>
    )
    }

export default AccountUser
