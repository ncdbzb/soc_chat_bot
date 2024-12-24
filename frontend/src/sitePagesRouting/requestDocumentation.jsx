import React, { useState, useEffect  } from 'react';
import FormRequestAnswQuest from '../components/layout/requestAnswerQuestion/formRequestAnswer/FormRequestAnswQuest';
import FormRequestsTest from '../components/layout/requestTest/FormRequstTest';
import Header from '../components/layout/main/header/Header';
const Request = ( ) => {
  const [flag, setFlag] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const docName = params.get('documentation');
  useEffect(() => {
    return () => {
      localStorage.removeItem('storageTest'); // Удаление конкретного элемента из localStorage idRequest
      localStorage.removeItem('rightAnswer'); 
      localStorage.removeItem('idRequest');
    };
  }, []);
  return (
    <>
      <Header setFlag={setFlag}/>
      {flag ? <FormRequestAnswQuest docName={docName} /> : <FormRequestsTest docName={docName} />}
    </>
  );
};

export default Request;