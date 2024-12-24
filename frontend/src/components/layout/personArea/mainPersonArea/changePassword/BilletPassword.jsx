import React from 'react'

const BilletPassword = ({setIsEditing}) => {
    const handleEditClick = () => {
        setIsEditing(true);
    };
    return (
        <div className='user-edit'>
            <h3>Пароль</h3>
            <div className='container-edit-btn'>
                <button className='edit-password button' onClick={handleEditClick}>
                    Изменить
                </button>
            </div>
        </div>
    )
}

export default BilletPassword
