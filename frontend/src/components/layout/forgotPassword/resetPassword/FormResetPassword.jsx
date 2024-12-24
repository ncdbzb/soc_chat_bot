import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import btnPass from '../../../../img/icons/password/Visibility=True.svg'
import btnPassVisib from '../../../../img/icons/password/Visibility=False.svg'
import { confirmPasswordValidator } from '../../../validation/password';
import { passwordValidator } from '../../../validation/password';
import { Popup } from '../../popups/popup';
import { useResetPasswordUserMutation } from '../../../store/services/auth';
const schema = yup.object().shape({
    password: passwordValidator,
    confirmation_password: confirmPasswordValidator   
});

function FormResetPassword(){
    const [disabledButton, setDisabledButton] = useState(false); // Начальное состояние - кнопки не заблокированы
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState('');
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [currentImage, setCurrentImage] = useState(btnPass);
    const [inputType, setInputType] = useState('password');

    const [confirmation_password, setConfirmPassword] = useState('');
    const [currentConfirmImage, setCurrentConfirmImage] = useState(btnPass);
    const [inputConfirmType, setInputConfirmType] = useState('password');

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [ requestResetPassword ,{
        status,
    }] = useResetPasswordUserMutation()
    const onClickEye = () =>{
        setCurrentImage(currentImage === btnPass ? (btnPassVisib): (btnPass));
        setInputType(inputType === 'text' ? 'password' : 'text');
    }
    const onClickConfirmEye = () =>{
        setCurrentConfirmImage(currentConfirmImage === btnPass ? (btnPassVisib): (btnPass));
        setInputConfirmType(inputConfirmType === 'text' ? 'password' : 'text');
    }

    const onSubmit = async (data) => {
        setDisabledButton(true)
        await requestResetPassword({token, password: data['password']})
    }
    const handleClose = () => {
        setIsPopupOpen(false);
    };
    useEffect(()=>{
        if(status==='fulfilled'){
            setIsPopupOpen(true);
            setMessage('Пароль успешно изменён!');
        }
    },[status])
    return (
        <section class="container-reset-password">
            <form className="form-container" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
                {isPopupOpen && <Popup isOpen={isPopupOpen} message={message} disabledButton={setDisabledButton} onClose={handleClose} urlNavigate='/logIn' />}
                <h2>Изменение пароля</h2>
                <div className='form-container-brim'>
                    <div className='block-password password'>
                        <label for="password">Новый пароль</label>
                        <input {...register("password")} className='js-input-password' value={password} onChange={(e) => setPassword(e.target.value)} type={inputType}  id="password" name="password" />
                        <img onClick={onClickEye} className='btn__pass js-btn-password' src={currentImage} alt='' file='none'/>
                        {errors.password && <p className='form-validation' style={{ color: 'red' }}>{errors.password.message}</p>}
                    </div>
                    <div className='block-confirm-password password'>
                        <label for="confirmation_password}">Повторите новый пароль</label>
                        <input {...register("confirmation_password")} className='js-input-confirm-password'  value={confirmation_password} onChange={(e) => setConfirmPassword(e.target.value)} type={inputConfirmType} id="confirm-password" />
                        <img onClick={onClickConfirmEye} className='btn__pass js-btn-password' src={currentConfirmImage} alt='' fill='none'/>
                        {errors.confirmation_password && <p className='form-validation' style={{ color: 'red' }}>{errors.confirmation_password.message}</p>}
                    </div>

                    <button disabled={disabledButton} className='submit-form' type="submit">Изменить пароль</button>
                </div>
            </form>
        </section>
    );
}

export default FormResetPassword;