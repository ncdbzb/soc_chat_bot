import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './header.css';
import siteLogo from '../../../../img/icons/logo UDV group 1.png';
import { useGetInformationUserQuery } from '../../../store/services/users';
import { updateUser, clearUser } from '../../../features/editUserDataSlice';
import AuthComponent from './AuthComponent';
import PersonalAccountList from './PersonalAccountList';
import ButtonsDocumentationNavigation from './ButtonsDocumentationNavigation';
function Header({setFlag}) {
  const location = useLocation(); // Получение текущего пути
  const dispatch = useDispatch()
  const {data, isLoading: isGetInformationLoading, error: isGetInformationError} = useGetInformationUserQuery()
  const userData = useSelector(state => state.updateUser)
  const lengthUserData = Object.keys(userData).length
  if(!isGetInformationLoading && !isGetInformationError) {
    dispatch(updateUser(data))
  }
  if(isGetInformationError){
    dispatch(clearUser())
  }
  if (isGetInformationLoading) {
    return null;
  }
  return (
    
    <header className="page-header">
      <nav className="main-nav">
        <div className="site-navigation">
          <div className="site-navigation-item">
            <Link to="/" className="nav-udv">
              <img className="icon-logo" src={siteLogo} alt="Иконка логотипа 'UDV|Group'" />
            </Link>
          </div>
          <div className='site-navigation-item'>
            <div className="buttons">
              {location.pathname === '/request_documentation' && (
                <ButtonsDocumentationNavigation setFlag={setFlag}/>
              )}
              {lengthUserData!==0? (
                <PersonalAccountList />
              ) : (
                <AuthComponent />
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;