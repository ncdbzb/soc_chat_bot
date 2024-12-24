import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './formLogIn.css';
import btnPass from '../../../../img/icons/password/Visibility=True.svg';
import btnPassVisib from '../../../../img/icons/password/Visibility=False.svg';
import { emailRegistrationValidator } from '../../../validation/email';
import { Popup } from '../../popups/popup';
import { useLogInMutation } from '../../../store/services/auth';
import VerifyUserComponent from './vefifyUserComponent';
const schema = yup.object().shape({
    email: emailRegistrationValidator,
    password: yup
    .string()
    .required('Пароль обязателен')    
});


export default function FormLogIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState('');
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const [verificationComplete, setVerificationComplete] = useState(false); // Изначально false
    const [initialVerificationDone, setInitialVerificationDone] = useState(!token); // Флаг для контроля выполнения верификации
    const [currentImage, setCurrentImage] = useState(btnPass);
    const [serverError, setServerError] = useState('');
    const [inputType, setInputType] = useState('password');
    const [logIn, { error, status }] = useLogInMutation();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onClickEye = () => {
        setCurrentImage(currentImage === btnPass ? btnPassVisib : btnPass);
        setInputType(inputType === 'text' ? 'password' : 'text');
    };

    const handleClose = () => {
        setIsPopupOpen(false);
        setVerificationComplete(true)
        searchParams.delete('token')
    };

    const onSubmit = async (data) => {
        await logIn({ data });
        setServerError('');
    };

    useEffect(() => {
        // Логика после авторизации
        if (status === 'fulfilled') {
            navigate('/');
        }
        if (error && error.status === 400) {
            setServerError(`Неверная почта или пароль`);
        }
        if (error?.detail === 'LOGIN_USER_NOT_VERIFIED') {
            setServerError(`Пользователь не верифицирован`);
        }
    }, [error, status, navigate]);

    useEffect(() => {
        // Логика для верификации
        if (token && !initialVerificationDone) {
            setVerificationComplete(false);
        } else {
            setVerificationComplete(true); // Если токена нет, верификация не нужна
        }
    }, [token, initialVerificationDone]);
    return (
        <section className="container-log-in">
            {isPopupOpen && <Popup isOpen={isPopupOpen} message={message} onClose={handleClose} setFlag={setIsPopupOpen} />}
            {token && !verificationComplete && (
                <VerifyUserComponent
                    token={token}
                    setIsPopupOpen={setIsPopupOpen}
                    setMessage={setMessage}
                />
            )}
            {verificationComplete && (
                <form className="form-container" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
                    <h2>Вход</h2>
                    <div className="form-container-brim">
                        <div className="block-email">
                            <label className="email" htmlFor="email">Почта</label>
                            <input {...register("email")} type="email" id="email" />
                            {errors.email && <p className="form-validation" style={{ color: 'red' }}>{errors.email.message}</p>}
                        </div>
                        <div className="block-password">
                            <label htmlFor="password">Пароль</label>
                            <input {...register("password")} className="js-input-password" type={inputType} id="password" />
                            <img onClick={onClickEye} className="btn__pass js-btn-password" src={currentImage} alt="" />
                            {errors.password && <p className="form-validation" style={{ color: 'red' }}>{errors.password.message}</p>}
                            {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                        </div>
                        <button className="submit-form" type="submit">Войти</button>
                    </div>
                    <Link to="/forgot_password" className="btn-forgot"><p>Не помню пароль</p></Link>
                    <div className="block-registr">
                        <p>Нет аккаунта?</p>
                        <Link to="/signUp" className="btn-registr"><p>Зарегистрируйтесь</p></Link>
                    </div>
                </form>
            )}
        </section>
    );
}