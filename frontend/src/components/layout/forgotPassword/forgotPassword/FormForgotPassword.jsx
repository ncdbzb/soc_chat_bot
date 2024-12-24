import React, { useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Popup } from '../../popups/popup';
import { useForgotPasswordMutation } from '../../../store/services/auth';

const schema = yup.object().shape({
    email: yup
    .string()
    .required('Почта обязательна')
    .email('Неверный формат электронной почты')
});

function FormForgotPassword(){
    const [disabledButton, setDisabledButton] = useState(false); // Начальное состояние - кнопки не заблокированы
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [serverError, setServerError] = useState('');

    const {
        register,
        reset,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [requestForgotPassword,{
        status,
        error
    }] = useForgotPasswordMutation()
    const onSubmit = async (data) => {
        setDisabledButton(true)
        setServerError('');
        await requestForgotPassword(data)
    }
    const handleClose = () => {
        setIsPopupOpen(false);
    };
    useEffect(()=>{
        if(status==='fulfilled'){
            setIsPopupOpen(true);
            setMessage('Проверьте почту!');
        }
        if(error?.status===404){
            setDisabledButton(false)
            setServerError('Пользователя с данной почтой не зарегистрованно');
        }
    }, [status,error])
    return (
        <section className="container-forgot-password">
            <form className="form-container" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
                {isPopupOpen && <Popup isOpen={isPopupOpen} message={message} onClose={handleClose} disabledButton={setDisabledButton} urlNavigate='/' />}
                <h2>Восстановление пароля</h2>
                <div className='form-container-brim'>
                    <label for="email">Email</label>
                    <input {...register("email")} onChange={(e)=> setServerError('')} type="email" id="email" name="email" />
                    {errors.email && <p className='form-validation' style={{ color: 'red' }}>{errors.email.message}</p>}
                    {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                </div>
                <button disabled={disabledButton} className='submit-form' type="submit">Восстановить пароль</button>
            </form>
        </section>
    );
}

export default FormForgotPassword;