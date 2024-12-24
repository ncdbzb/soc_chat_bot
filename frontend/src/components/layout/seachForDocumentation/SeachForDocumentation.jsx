import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './seachForDocumentation.css';
import btnEdit from '../../../img/edit.svg';
import FormEditDocumentation from '../workDocumentation/editDocumentation/FormEditDocumentation';
import { AddDocumentation } from '../workDocumentation/editDocumentation/addDocumentation/addDocumentation';
import { useGetDocksQuery, useRemovingDocumentationMutation } from '../../store/services/docks';

const SeachForDocumentation = ({ onClick }) => {
    const userData = useSelector(state => state.updateUser) || null; 
    const [isOpen, setIsOpen] = useState(true);
    const [popupInform, setPopupInform] = useState(''); // Добавленное состояние для попапа
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [fileName, setFileName] = useState();
    const apiUrlFront = process.env.REACT_APP_API_FRONT_URL;
    const [isEditingSave, setIsEditingSave] = useState(false);
    const [addFile, setAddFile] = useState(false);
    const [removingDocumentation, {
        status
    }] = useRemovingDocumentationMutation();
    
    const copyTextToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setPopupInform('Ссылка успешно скопирована в буфер обмена');
            setTimeout(() => {
                setPopupInform(''); // Скрыть попап через 2 секунды
            }, 2000);
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    const clickLink = (item) => {
        copyTextToClipboard(`${apiUrlFront}/request_documentation?documentation=${item['name']}`);
    };

    let userURL = 'my';
    if (userData?.is_superuser) {
        userURL = 'all';
    }
    const {isLoading, error, data: userDataDocumentation} = useGetDocksQuery(userURL)

    const confirmDelete = (doc_name) => {
        setDocToDelete(doc_name);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        await removingDocumentation(docToDelete)
        setShowConfirmation(false);
        setDocToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setDocToDelete(null);
    };
    const handleEditClickSave = (flagWindowEdit, fileName) => {
        setIsEditingSave(flagWindowEdit)
        setFileName(fileName)
    }
    const handleAddClickSave = (flagWindowAdd, fileName) => {
        setFileName(fileName)
        setAddFile(flagWindowAdd)
    }
    useEffect(()=>{
        if(status==='fulfilled'){
            window.location.reload();
        }
    }, [ status ])
    if(isLoading) {
        return <h1>Происходит загрузка добавленной документации</h1>
    }
    else if(!userData){
        return <h1>Авторизуйтесь, чтобы увидеть свою документацию</h1>
    }
    else if(error){
        return <h1>При разгрузке произошла ошибка, перезагрузите страницу</h1>
    }
    return (
        <div className="dropdown-container">
            <div className="dropdown">
                {isOpen && userDataDocumentation.length > 0 ? (
                    <ul className='documentation-list'>
                        {popupInform && <div className='document-popup'>{popupInform}</div>}
                        {userDataDocumentation.map((item, index) => (
                            <li key={index} className='documentation-list-item'>
                                <div className='container-edit-file'>
                                    <h3 className='title'>{item['name']}</h3>
                                    <a onClick={() => handleEditClickSave(true,item['name'] )}>
                                            <img src={btnEdit} alt='Edit' />
                                    </a>
                                </div>                               
                                <p className='description'>{item['description']}</p>
                                <div className='container-button'>
                                    <button className='btn-add' onClick={() => clickLink(item)}>
                                        Получить ссылку
                                    </button>
                                    <button className="button" onClick={() => handleAddClickSave(true,item['name'] )}>Дополнить</button>
                                    <button className="button" onClick={() => confirmDelete(item['name'])}>
                                        Удалить документацию
                                    </button>
                                </div>
                                {(isEditingSave && item['name']===fileName) && (
                                    <FormEditDocumentation docName={item['name']} description={item['description']} onClose={handleEditClickSave}/>
                                    
                                )}
                                {(addFile && item['name']===fileName) && (
                                    <AddDocumentation docName={item['name']} onClose={handleAddClickSave}/>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>Вы не добавили ни одной документации</div>
                )}
            </div>
            {showConfirmation && (
                <div className="confirmation-popup">
                    <div className="confirmation-content">
                        <p>Вы уверены, что хотите удалить эту документацию?</p>
                        <div className='container-button'> 
                            <button className="confirm-button button" onClick={handleDelete}>
                                Да
                            </button>
                            <button className="cancel-button button" onClick={handleCancelDelete}>
                                Отмена
                            </button>
                        </div> 
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeachForDocumentation;