import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../workDocumentation/workDocumentation/workDocumentation.css';
import { UserComments } from '../userComments/UserComments';
import { useCheckTrueAnswerMutation, useGenerateTestMutation } from '../../store/services/test';
import { Spinner } from '../thirdPartyLayout/Spinner';

const FormRequestsTest = (props) => {
    const [questionData, setQuestionData] = useState(JSON.parse(localStorage.getItem('storageTest') || null));
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [id, setId] = useState(localStorage.getItem('idRequest') ||'');
    const [result, setResult] = useState('');
    const [answerServer, setAnswerServer] = useState(localStorage.getItem('rightAnswer') || '');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [flagAnswer, setFlagAnswer] = useState(true);
    const [ requestGenerateTest,{
        data: dataGenerateTest,
        status: statusGenerateTest,
        error: errorGenerateTest
    }] = useGenerateTestMutation();

    const [requestCheckTrueAnswer,{
        data: dataTrueAnswer,
        status: statusTrueAnswer,
        error: errorTrueAnswer
    }] = useCheckTrueAnswerMutation()
    const { handleSubmit } = useForm();
    const onSubmitTest = async () => {
        setServerError('');
        setLoading(true);
        requestGenerateTest({docName: props.docName})
    };

    const handleAnswerSelection = async (answer) => {
        setSelectedAnswer(answer);
        setServerError('');
        if(flagAnswer) await requestCheckTrueAnswer({id, answer})
    };
    useEffect(() => {
        if(statusGenerateTest==='fulfilled'){
            localStorage.removeItem('rightAnswer'); 
            localStorage.setItem('storageTest',JSON.stringify(dataGenerateTest.result))
            localStorage.setItem('idRequest',JSON.stringify(dataGenerateTest.request_id))
            setQuestionData(dataGenerateTest.result);
            setId(dataGenerateTest.request_id);
            setResult(dataGenerateTest.result);
            setSelectedAnswer('');
            setAnswerServer('');
            setLoading(false);
            setFlagAnswer(true);
        } 
        if(errorGenerateTest?.status===401){
            setServerError('Пожалуйста, авторизируйтесь!')
        }
        if(errorGenerateTest?.status===502){
            setServerError('Произошла ошибка при генерации теста, попробуйте заново');
        }
        if(errorGenerateTest){
            setLoading(false);
        }
    }, [statusGenerateTest, errorGenerateTest, dataGenerateTest] )

    useEffect(()=>{
        if(statusTrueAnswer==='fulfilled'){
            setAnswerServer(dataTrueAnswer.right_answer);
            localStorage.setItem('rightAnswer', dataTrueAnswer.right_answer)
            setFlagAnswer(false)
        }
        if(errorTrueAnswer){
            const detailError = errorTrueAnswer.data?.detail
            setServerError(detailError);
        }
    },[statusTrueAnswer, errorTrueAnswer, dataTrueAnswer])
    
    return (
        <section className='container-work-documentation'>
            <form className='form-container-test block-form-request' onSubmit={handleSubmit(onSubmitTest)}>
                <h2>Тесты на основе документации <span>{props.docName}</span></h2>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <button className='btn-add button-test' type="submit" disabled={loading}>
                    Сгенерировать тест
                </button>
                {loading && <Spinner />}
                {questionData && (
                    <div className='question-container'>
                        <h3>{questionData.question}</h3>
                        <ul className='test-list'>
                            {['1 option', '2 option', '3 option', '4 option'].map((optionKey, index) => (
                                <li
                                    key={index}
                                    className={`test-list-item ${
                                        answerServer === questionData[optionKey] ? 'answer-right' :
                                        selectedAnswer === questionData[optionKey] ? 'answer-wrong' : ''
                                    }`}
                                    onClick={() => handleAnswerSelection(questionData[optionKey])}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {questionData[optionKey]}
                                </li>
                            ))}
                        </ul>
                        <UserComments request_id={id} result={result} />
                    </div>
                )}
                <p className='disclaimer'> Наш цифровой помощник находится на стадии опытного экземпляра, и нам очень важна ваша помощь в его улучшении. 
                    Если вы заметили некорректные формулировки, фактические ошибки или другие недочеты в вопросах или ответах, пожалуйста, оставьте аргументированную обратную связь, нажав на кнопку лайка или дизлайка.
                    Ваши отзывы помогут нам сделать нашего помощника лучше и полезнее. Спасибо за участие!
                </p>
            </form>
        </section>
    );
};

export default FormRequestsTest;

