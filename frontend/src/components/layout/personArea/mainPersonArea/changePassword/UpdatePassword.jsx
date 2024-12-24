import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import btnPass from '../../../../../img/icons/password/Visibility=True.svg';
import btnPassVisib from '../../../../../img/icons/password/Visibility=False.svg';
import { confirmPasswordValidator } from '../../../../validation/password';
import { passwordValidator } from '../../../../validation/password';
import { useResetPasswordMutation } from '../../../../store/services/users';

const passwordSchema = yup.object().shape({
    old_password: passwordValidator,
    password: passwordValidator,
    confirmation_password: confirmPasswordValidator,
  });

const UpdatePassword = ({setIsEditing, setFlag, setMessage}) => {
    const [old_password, setCurrentPassword] = useState('');
    const [confirmation_password, setConfirmPassword] = useState('');
    const [currentImage, setCurrentImage] = useState(btnPass);
    const [inputType, setInputType] = useState('password');
    const [currentCurrentImage, setCurrentCurrentImage] = useState(btnPass);
    const [inputCurrentType, setInputCurrentType] = useState('password');
    const [currentConfirmImage, setCurrentConfirmImage] = useState(btnPass);
    const [inputConfirmType, setInputConfirmType] = useState('password');
    const [serverErrorPassword, setServerErrorPassword] = useState('');
    const [password, setPassword] = useState('');
    const [userResetDataPassword, {
        error: errorPassword, status: statusPassword
    }] = useResetPasswordMutation()
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors }
      } = useForm({
        resolver: yupResolver(passwordSchema),
      });
    
    const onClickEye = () => {
        setCurrentImage(currentImage === btnPass ? btnPassVisib : btnPass);
        setInputType(inputType === 'text' ? 'password' : 'text');
    };

    const onClickConfirmEye = () => {
        setCurrentConfirmImage(currentConfirmImage === btnPass ? btnPassVisib : btnPass);
        setInputConfirmType(inputConfirmType === 'text' ? 'password' : 'text');
    };

    const onClickCurrentEye = () => {
        setCurrentCurrentImage(currentCurrentImage === btnPass ? btnPassVisib : btnPass);
        setInputCurrentType(inputCurrentType === 'text' ? 'password' : 'text');
    };
    const handleCancelPassword = () => {
        resetPassword({
            old_password: '',
            password: '',
            confirmation_password: '',
        });
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
        setIsEditing(false);
        setServerErrorPassword('');
    };
    const onSubmitPassword = async (data) => {
        await userResetDataPassword({data}); 
        if (errorPassword) {
            setServerErrorPassword(errorPassword);
        }
    };
    useEffect(()=>{
        if(statusPassword==='fulfilled'){
            setIsEditing(false);
            setFlag(true);
            setMessage('Пароль успешно изменён')
        }
        if(errorPassword && errorPassword.status===400){
            setServerErrorPassword('Введён неверный пароль')
        }
    }, [statusPassword])
    return (
        <form className="form-container edit-form password-form" onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className='container-edit-info'>
                <h3>Изменение пароля</h3>
            </div>
            <div className='block-current-password password'>
                <label htmlFor="old_password">Текущий пароль</label>
                <input {...registerPassword("old_password")} className='js-input-current-password' value={old_password} onChange={(e) => {setServerErrorPassword(''); setCurrentPassword(e.target.value)}} type={inputCurrentType} id="current-password" name="old_password" />
                <img onClick={onClickCurrentEye} className='btn__pass js-btn-password' src={currentCurrentImage} alt='' />
                {passwordErrors.old_password && <p className='form-validation' style={{ color: 'red' }}>{passwordErrors.old_password.message}</p>}
                {serverErrorPassword && <p className='form-validation' style={{ color: 'red' }}>{serverErrorPassword}</p>}
            </div>
            <div className='block-password password'>
                <label htmlFor="password">Новый пароль</label>
                <input {...registerPassword("password")} className='js-input-password' value={password} onChange={(e) => setPassword(e.target.value)} type={inputType} id="password" name="password" />
                <img onClick={onClickEye} className='btn__pass js-btn-password' src={currentImage} alt='' />
                {passwordErrors.password && <p className='form-validation' style={{ color: 'red' }}>{passwordErrors.password.message}</p>}
            </div>
            <div className='block-confirm-password password'>
                <label htmlFor="confirmation_password">Повторите новый пароль</label>
                <input {...registerPassword("confirmation_password")} className='js-input-confirm-password' value={confirmation_password} onChange={(e) => setConfirmPassword(e.target.value)} type={inputConfirmType} id="confirm-password" name='confirmation_password' />
                <img onClick={onClickConfirmEye} className='btn__pass js-btn-password' src={currentConfirmImage} alt='' />
                {passwordErrors.confirmation_password && <p className='form-validation' style={{ color: 'red' }}>{passwordErrors.confirmation_password.message}</p>}
            </div>
            <div className='container-button'>
                <button type="submit" className="btn-add">Отправить</button>
                <button type="button" className="button" onClick={handleCancelPassword}>Отменить</button>
            </div>
        </form>
    )
}

export default UpdatePassword;
