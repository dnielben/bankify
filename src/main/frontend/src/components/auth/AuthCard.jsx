import React from 'react';
import logoBankify from '../../assets/img/Logo.png';

export const AuthCard = ({ title, subtitle, children }) => {
    return (
        <div className="login-card">
            <img src={logoBankify} alt="Logo Bankify" className="login-logo" />
            <h2>{title}</h2>
            <p className="login-subtitle">{subtitle}</p>
            {children}
        </div>
    );
};

export default AuthCard;