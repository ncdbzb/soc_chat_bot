import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../personArea/mainPersonArea/informationUser.css';
import { useGetListFeedbackMutation } from '../../store/services/admin';

const ListFeedback = () => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [getListFeedback, {
        status
    }] = useGetListFeedbackMutation()
    const apiUrl = process.env.REACT_APP_API_URL;
    const {
        register,
        reset,
        handleSubmit,
    } = useForm();


    const toggleDropdown = async (flag) => {
        if (!isOpen) {
            await setData(getListFeedback(flag))
        }
        setIsOpen(!isOpen);
    };

    const feedbackViewed = (id) => {
        feedbackViewed(id);
    }
    useEffect(()=>{
        if(status==='fulfilled'){
            
        }
    },[status])

    return (
        <div className="dropdown-container">
            <div>Фитбеки</div>
            <div className="dropdown">
                <div className='btn-feedback-container'>
                    <a onClick={() => (toggleDropdown(true))}>Все фитбеки</a>
                    <a onClick={() => (toggleDropdown(false))}>Не просмотрененные фитбеки</a>
                </div>
                {isOpen && data.length > 0 && (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                {item['value']} {item['user_comment']} <br/>
                                {item['llm_response']}
                                <button feedbackViewed={ () => (feedbackViewed(item['id'])) }>Просмотрено</button>
                            </li>
                        ))}
                    </ul>
                )}
                {isOpen && data.length === 0 && (
                    <div>Нет фитбеков от пользователей</div>
                )}
            </div>
        </div>
    );
}

export default ListFeedback;
