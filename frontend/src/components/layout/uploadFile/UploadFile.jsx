import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import './uploadFile.css';
import { Popup } from '../../layout/popups/popup';
import { useUploadFileMutation } from '../../store/services/docks';
import { Spinner } from '../thirdPartyLayout/Spinner';
const FormTest = () => {
    const [dockName, setDockName] = useState('');
    const [dockDescription, setDockDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState('');
    const {
        register,
        reset,
        handleSubmit,
        formState: { isSubmitSuccessful }
    } = useForm();
    
    const [uploadFile, {
        error, isLoading, status
    }] = useUploadFileMutation()
    const onSubmitDock = async (data) => {
        setServerError('')
        const formDatas = new FormData();
        formDatas.append('file', data.files[0]);
        setLoading(true); // Показываем spinner
        await uploadFile({formDatas, dockName, dockDescription})
    };
    useEffect(() => {
        if (!isLoading) {
            setLoading(false); // Останавливаем индикатор загрузки
        }
        if(error && (error.status===500 || error.status===502)){
            setServerError('Произошла ошибка при загрузке документации, попробуйте занового!');
        }
        if(error && error.status===401){
            setServerError('Чтобы добавить файл, пожалуйста, авторизуйтесь');
        }
        if (error && error.data.detail ==='Document with this name already exists') {
            setServerError('Файл с данным названием уже загружен, измените его!');
        }
        if (error && error.data.detail ==='Filename can only contain alphanumeric characters, underscores, or hyphens (-).') {
            setServerError('Файл не должен содержать кириллицу!');
        }
        if(status==='fulfilled'){
            setIsPopupOpen(true);
            setMessage('Файл успешно добавлен в базу данных!');
        }
    }, [isLoading, error, status]);

    const handleCancel = () => {
        reset({
            dockName: '',
            dockDescription: '',
            files: null
        });
        setDockName('');
        setDockDescription('');
        document.getElementById('files').value = '';
    };

    const handleClose = () => {
        setIsPopupOpen(false);
    };
    
    return (
        <section className='container-upload'>
            <form className='form-container-upload' action="#" method="POST" onSubmit={handleSubmit(onSubmitDock)}>
                <h2>Добавление документации</h2>
                {isPopupOpen && <Popup isOpen={isPopupOpen} message={message} onClose={handleClose} urlNavigate={'../work_documentation'}/>}
                <div className='upload-name'>
                    <label htmlFor="dockName">Название</label>
                    <input
                       {...register("dockName")} type="text" value={dockName} onChange={(e) => setDockName(e.target.value)} id="dock_name" name="dock_name" required />
                </div>
                <div className='upload-description'>
                    <label htmlFor="dockDescription">Описание</label>
                    <textarea
                        {...register("dockDescription")} type="text" value={dockDescription} onChange={(e) => setDockDescription(e.target.value)} id="dock_description" name="dock_description" required
                    />
                </div>
                <div className='upload-file'>
                    <input
                        {...register("files")} type="file" accept=".txt,.zip" id="files" name="files" required
                    />
                </div>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <div className='container-button'>
                    <button type="submit" className="btn-add button">
                        Отправить
                    </button>
                    <button type="button" className="button" onClick={handleCancel}>
                        Очистить
                    </button>
                    {loading && <Spinner />}
                </div>
            </form>
        </section>
    );
};

export default FormTest;
