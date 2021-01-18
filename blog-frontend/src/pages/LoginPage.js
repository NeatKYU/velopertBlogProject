import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate.js';
//import AuthForm from '../components/auth/AuthForm.js';
import LoginForm from '../containers/auth/LoginForm';

const LoginPage = () => {
    return (
        <AuthTemplate>
            <LoginForm/>
        </AuthTemplate>
    )
}

export default LoginPage;