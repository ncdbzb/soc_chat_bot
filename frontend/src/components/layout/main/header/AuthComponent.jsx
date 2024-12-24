import React from 'react'
import { Link } from 'react-router-dom';
const AuthComponent = () => {
  return (
    <div className='auth-container'>
        <Link to="/logIn" className="btn-signUp button-header">Войти</Link>
        <p> | </p>
        <Link to="/signUp" className="btn-signIp button-header">Регистрация</Link>
    </div>
  )
}

export default AuthComponent
