import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import iconClose from '../../../../img/icons/cross.svg';
import { Popup } from '../../popups/popup';
import { useEditDocumentationMutation } from '../../../store/services/docks';

const schema = yup.object().shape({
  dockName: yup.string().required('Название документа обязательно'),
  dockDescription: yup.string().required('Описание документа обязательно'),
});

const FormEditDocumentation = ({ docName, description, onClose }) => {
  const [message, setMessage] = useState('');
  const [flag, setFlag] = useState(false);
  const [dockName, setDockName] = useState(docName || '');
  const [dockDescription, setDockDescription] = useState(description || '');
  const [requestEditDocumentation, {
    status,
    error
  }] = useEditDocumentationMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    const data = {
      current_name: docName,
      new_name: dockName,
      description: dockDescription,
    };
    await requestEditDocumentation({data})
  };

  const handleCancel = () => {
    setDockName('');
    setDockDescription('');
  };

  const handleClose = () => {
    onClose(false);
    window.location.reload();
  };

  useEffect(()=>{
    if(status==='fulfilled'){
      setFlag(true);
      setMessage('Данные успешно изменены!');
  }
  }, [status])
  return (
    <form className="form-container-upload" onSubmit={handleSubmit(onSubmit)}>
      {flag && <Popup isOpen={true} setFlag={setFlag} message={message} onClose={handleClose} useNavigate={'./work_documentation'}/>}
      <div className="container-close">
        <h2>Изменение документации</h2>
        <a className='link-close' onClick={handleClose}>
          <img src={iconClose} alt="Close" />
        </a>
      </div>
      <div className="upload-title">
        <div className="upload-name">
          <label htmlFor="dockName">Название</label>
          <input
            {...register('dockName')}
            type="text"
            id="dock_name"
            name="dock_name"
            value={dockName}
            onChange={(e) => setDockName(e.target.value)
            
            }
            required />
          {errors.dockName && <p>{errors.dockName.message}</p>}
        </div>
      </div>
      <div className="upload-description">
        <label htmlFor="dockDescription">Описание</label>
        <textarea
          {...register('dockDescription')}
          id="dock_description"
          name="dock_description"
          value={dockDescription}
          onChange={(e) => setDockDescription(e.target.value)}
          required />
        {errors.dockDescription && <p>{errors.dockDescription.message}</p>}
      </div>
      <div className="container-button">
        <button type="submit" className="btn-add button">
          Сохранить
        </button>
        <button type="button" className="button" onClick={handleCancel}>
          Очистить
        </button>
      </div>
    </form>
  );
};

export default FormEditDocumentation;

