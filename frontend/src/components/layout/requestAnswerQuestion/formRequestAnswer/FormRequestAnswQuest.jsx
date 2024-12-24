import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import './formRequestAnswQuest.css';
import icomSubmitQuest from '../../../../img/icons/Icon-color.svg';
import { UserComments } from '../../userComments/UserComments';
import { useAnswerToQuestionMutation } from '../../../store/services/answerToQuestion';
import { Spinner } from '../../thirdPartyLayout/Spinner';

const FormRequestAnswQuest = ({ docName }) => {
    const formRef = useRef(null);
    const answersListRef = useRef(null); // Reference for the answers list
    const idUser = useSelector(state => state.updateUser.id) || null; 
    const [massivAnswer, setMassivAnswer] = useState(JSON.parse(localStorage.getItem(`${idUser}-${docName}`)) || []);
    const [id, setId] = useState('');
    const [result, setResult] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);
    const [serverError, setServerError] = useState('');
    const { register, reset, handleSubmit } = useForm();
    const [requestAnswerToQuestion, {
        data,
        status,
        error
    }] = useAnswerToQuestionMutation()
    const addItem = (newItem) => {
        setMassivAnswer((prevItems) => [...prevItems, newItem]);
    };

    const handleCancel = () => {
        reset({
            question: '',
        });
        setQuestion('');
    };
    const formatAnswer = (answer) => {
        if (answer.includes('\n\n')) {
            const steps = answer.split('\n').map((step, index) => {
                return <p key={index}>{step}</p>;
            });
            return <div className="formatted-answer">{steps}</div>;
        }
        return <p>{answer}</p>;
    };

    const onSubmitTest = async () => {
        setServerError('');
        setLoading(true); // Показываем спиннер
        await requestAnswerToQuestion({docName, question})
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(onSubmitTest)();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '22px'; // Сброс высоты для вычисления
            let newHeight = textareaRef.current.scrollHeight - 20;

            if (newHeight > 450) {
                textareaRef.current.style.height = '450px';
                textareaRef.current.style.overflowY = 'auto'; // Добавляем вертикальный скролл
            } else {
                textareaRef.current.style.height = `${newHeight}px`;
                textareaRef.current.style.overflowY = 'hidden'; // Убираем вертикальный скролл
            }
        }
    }, [question]);

    useEffect(()=>{
        if(status==='fulfilled'){
            const result = data['result']
            handleCancel();
            setLoading(false);
            addItem(result); // Получение данных из ответа
            setId(data['request_id']);
            setResult(result);
        }
        if(error){
            setLoading(false);
            if (error.data?.status === 401) {
                setServerError('Пожалуйста, авторизируйтесь!');
            } 
            else if(error){
                setServerError('Произошла ошибка при ответе на вопрос, попробуйте заново');
            }
        }
    },[data, error, status])

    useEffect(() => {
            localStorage.setItem(`${idUser}-${docName}`, JSON.stringify(massivAnswer));
            if (answersListRef.current) {
                answersListRef.current.scrollTop = answersListRef.current.scrollHeight;
            }
    }, [massivAnswer, docName]); // Зависимость от massivAnswer и docName

    return (
        <section className='container-work-documentation'>
            <form className='form-container-question block-form-request' ref={formRef} action="#" method="POST" onSubmit={handleSubmit(onSubmitTest)}>
                <h2>Ответы на основе документации <span>{docName}</span></h2>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <div className="answers-list" ref={answersListRef}>
                    
                    {massivAnswer.map((item, index) => (
                        <>
                            <div className="questions-container">
                                {localStorage.setItem('itemQuestion', item.question)}
                                <p>{localStorage.getItem('itemQuestion')}</p>
                            </div>
                            <div className="answer-container">
                                {formatAnswer(item.answer)}
                                <UserComments request_id={id} result={result} />
                            </div>
                        </>
                    ))}
                </div>
                <div className='block-input'>
                    <textarea
                        {...register("question")}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        ref={textareaRef}
                        id="question"
                        placeholder='Ваш вопрос'
                        name="question"
                        required
                        onKeyDown={handleKeyDown} // Добавляем обработчик события onKeyDown
                    />
                    <button type='submit' disabled={loading} style={{ display: loading ? 'none' : 'block' }}>
                        <img src={icomSubmitQuest} className='iconSubmitQuest' alt='' />
                    </button>
                    {loading && <Spinner />}
                </div>
                <p className='disclaimer'> Наш цифровой помощник находится на стадии опытного экземпляра, и нам очень важна ваша помощь в его улучшении. 
                    Если вы заметили некорректные формулировки, фактические ошибки или другие недочеты в вопросах или ответах, пожалуйста, оставьте аргументированную обратную связь, нажав на кнопку лайка или дизлайка.
                    Ваши отзывы помогут нам сделать нашего помощника лучше и полезнее. Спасибо за участие!
                </p>
            </form>
        </section>
    );
};

export default FormRequestAnswQuest;
