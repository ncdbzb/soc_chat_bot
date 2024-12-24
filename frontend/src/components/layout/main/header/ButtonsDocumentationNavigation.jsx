import React, { useRef } from 'react'

const ButtonsDocumentationNavigation = ({setFlag}) => {
    const btnQuestionRef = useRef(null);
    const btnTestRef = useRef(null);

    const handleButtonClick = (event, isQuestion) => {
        event.preventDefault();
        if (isQuestion) {
            btnTestRef.current.classList.remove('btn-add');
            btnQuestionRef.current.classList.toggle('btn-add');
            setFlag(true);
        } else {
            btnQuestionRef.current.classList.remove('btn-add');
            btnTestRef.current.classList.toggle('btn-add');
            setFlag(false);
        }
    };
  return (
    <>
        <button className="btn-question button button-header" onClick={(e) => handleButtonClick(e, true)} ref={btnQuestionRef}>
            Задать вопрос
        </button>
        <button className="btn-test button button-header btn-add" onClick={(e) => handleButtonClick(e, false)} ref={btnTestRef}>
            Пройти тест
        </button>
    </>
  )
}

export default ButtonsDocumentationNavigation
