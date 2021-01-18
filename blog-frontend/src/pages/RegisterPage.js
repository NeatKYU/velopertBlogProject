import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate.js';
//import AuthForm from '../components/auth/AuthForm.js';
import RegisterForm from '../containers/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <AuthTemplate>
            <RegisterForm/>
        </AuthTemplate>
    )
}

export default RegisterPage;