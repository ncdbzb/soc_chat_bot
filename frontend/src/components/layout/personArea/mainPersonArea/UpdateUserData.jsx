import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { surnameValidator } from '../../../validation/surname';
import { nameValidator } from '../../../validation/name';
import { emailRegistrationValidator } from '../../../validation/email';
import { useResetPasswordMutation } from '../../../store/services/users';
import { updateUser } from '../../../features/editUserDataSlice';
const UpdateUserData = ({setIsEditingSave}) => {
    const userData = useSelector(state => state.updateUser) || null; 
    const [serverErrorEmail, setServerErrorEmail] = useState('');
    
    const editSchema = yup.object().shape({
        surname: surnameValidator,
        name: nameValidator,
        email: emailRegistrationValidator,
      });
    const dispatch = useDispatch()
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors }
      } = useForm({
        resolver: yupResolver(editSchema),
    });
    
    const [userResetData, {
        error: errorResetUser, status: statusResetUser
    }] = useResetPasswordMutation();
    const onSubmitEdit = async (data) => {
        setServerErrorEmail('')
        dispatch(updateUser({data}))
        await userResetData({data});      
    };

    const handleCancelEdit = () => {
        resetEdit({
            surname: userData.surname,
            name: userData.name,
            email: userData.email,
        });
        setIsEditingSave(false);
        setServerErrorEmail('');
    };
    useEffect(()=>{
        if(statusResetUser==='fulfilled'){
            setIsEditingSave(false);
        } 
        if(errorResetUser && errorResetUser.status===400){
            setServerErrorEmail('Данная почта уже зарегистрирована')
        }
    },[statusResetUser])
    return (
        <form className="form-container edit-form" onSubmit={handleSubmitEdit(onSubmitEdit)}>
            <div className='form-container-brim'>
                <div className='block-surname'>
                    <label htmlFor="last-name">Фамилия</label>
                    <input {...registerEdit("surname")} type="text" id="last-name" defaultValue={userData.surname || ''}/>
                    {editErrors.surname && <p className='form-validation' style={{ color: 'red' }}>{editErrors.surname.message}</p>}
                </div>
                <div className='block-username'>
                    <label htmlFor="first-name">Имя</label>
                    <input {...registerEdit("name")} type="text" id="first-name" defaultValue={userData.name || ''}/>
                    {editErrors.name && <p className='form-validation' style={{ color: 'red' }}>{editErrors.name.message}</p>}
                </div>
                <div className='block-email'>
                    <label htmlFor="email">Почта</label>
                    <input {...registerEdit("email")} type="email" id="email" defaultValue={userData.email || ''}/>
                    {editErrors.email && <p className='form-validation' style={{ color: 'red' }}>{editErrors.email.message}</p>}
                    {serverErrorEmail && <p className='form-validation' style={{ color: 'red' }}>{serverErrorEmail}</p>}
                </div>
                <div className='container-button'>
                    <button className='submit-form' type="submit">Сохранить</button>
                    <button type="button" className="button" onClick={handleCancelEdit}>Отменить</button>
                </div>
            </div>
        </form>
    )
}

export default UpdateUserData
