import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation} from 'react-router-dom';
import arrow from '../../../../img/icons/arrow_drop_down.svg';
import { useLazyLogOutQuery } from '../../../store/services/auth';
const PersonalAccountList = () => {
    const location = useLocation();
    const userData = useSelector(state => state.updateUser) || null;
    const arrowClickRef = useRef(null);
    const visibilityListRef = useRef(null);
    const [trigger, {
        isLoading: isLogOutLodiang,
        error: isLogOutError
    }] = useLazyLogOutQuery();
    const clickArrowLk = () => {
        if (arrowClickRef.current && visibilityListRef.current) {
          arrowClickRef.current.classList.toggle('click-arrow');
          visibilityListRef.current.classList.toggle('active');
        } else {
          console.error('Elements not found');
        }
      };
      const handleClickLogOut = () =>{
        trigger();
        if(!isLogOutError && !isLogOutLodiang){
          localStorage.clear();     
          location.reload();
        } 
    }   
    return (
        <div className='container-lk'>
            <div className="btn-user-lk" onClick={clickArrowLk}>
            <div className='user-FIO'>
                <p>{userData.surname}</p>
                <p>{userData.name}</p>
            </div>
            <img className='btn-arrow' src={arrow} alt='' ref={arrowClickRef} />
            </div>
            <div className='nav-lk' ref={visibilityListRef}>
            <Link to="/person_account" className="btn-signUp button-header">Личные данные</Link>
            <Link to="/work_documentation" className="btn-signUp button-header">Документация</Link>
            <Link className="btn-logOut button-header" onClick={handleClickLogOut}>Выйти</Link>
            </div>
        </div>
    )
}

export default PersonalAccountList
