import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import iconClose from '../../../../../img/icons/cross.svg';
import { Popup } from '../../../popups/popup';
import { useAddDocumentationMutation } from '../../../../store/services/docks';


export const AddDocumentation = ({ docName, onClose }) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [message, setMessage] = useState('');
    const [flag, setFlag] = useState(false);
    const [requestAddDocumentation,{
        error, 
        status
    }] = useAddDocumentationMutation()

    const handleClose = () => {
        onClose(false);
        reset({
            files: null,
        });
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('file', data.files[0]);
        await  requestAddDocumentation({formData, docName})
        
    };
    useEffect(()=>{
        if(status==='fulfilled'){
            setFlag(true);
            setMessage('Файл успешно добавлен в базу данных!');
        }
        if(error?.data?.detail==="File has an unsupported extension"){
            console.log(error)
        }
    }, [status, error] )
    return (
        <form className="form-container-upload" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
            {flag && <Popup isOpen={true} setFlag={setFlag} message={message} onClose={handleClose} useNavigate={'./work_documentation'}/>}
            <div className='container-close'>
                <h2>Добавление данных в документацию</h2>
                <a className='link-close' onClick={handleClose}>
                    <img src={iconClose} alt="Close" />
                </a>
            </div>
            <div className='upload-file'>
                <input
                    {...register("files")} type="file" accept=".txt" id="files" name="files" required
                />
            </div>
            <button className="btn-add" type='submit'>Сохранить</button>
        </form>
    );
};