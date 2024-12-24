import React from 'react';
import { useNavigate } from 'react-router-dom';
import './workDocumentation.css';
import SeachForDocumentation from '../../seachForDocumentation/SeachForDocumentation';
import iconAdd from '../../../../img/icons/Add.svg';

const WorkDocumentation = () => {
    const navigate = useNavigate();
    const handleUploadClick = () => {
        navigate('/upload_file');
    };

    return (
        <section className='container-documentation'>
            <h2>Мои документации</h2>
            <div className='block-all-documentation'>
                <div className='container-documentation-btn'>
                    <a className='btn-download btn-add' onClick={handleUploadClick}>
                        <img src={iconAdd} alt=''/>
                        Загрузить
                    </a>
                    <a className='container-list-btn'>
                        Загруженные
                    </a>
                </div>
                <div className='list-documentation'>
                    <SeachForDocumentation />
                </div>
            </div>
        </section>
    );
};

export default WorkDocumentation;