import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { InputField } from '../../components/auth/InputField';
import { isBugFixed } from '../../utils/authUtils';

import "./../../assets/css/auth/RegisterView.css"
import "./../../assets/css/auth/LoginView.css"

export const RegisterView = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        const currentUsers = JSON.parse(localStorage.getItem('bankify_users') || '[]');

        const emailExists = currentUsers.some((u) => u.email === email);
        if (emailExists) {
            setError('Este correo electrónico ya está registrado.');
            return;
        }

        const newUser = {
            email,
            password,
            role: 'client',
            fullName: email.split('@')[0] 
        };

        currentUsers.push(newUser);
        localStorage.setItem('bankify_users', JSON.stringify(currentUsers));

        console.log('Register success:', newUser);

        if (!isBugFixed()) {
            navigate('/auth/login');
        } else {
            localStorage.setItem('bankify_current_user', JSON.stringify(newUser));
            navigate('/app/dashboard');
        }
    };

    return (
        <>
            <div className="register-page">
                <AuthCard title="Crea tu cuenta" subtitle="Completa tu información para unirte al sistema">
                    <form className="register-form" onSubmit={handleSubmit}>

                        {/* Contenedor visual para mostrar el error si existe */}
                        {error && (
                            <div className="error-banner">
                                {error}
                            </div>
                        )}

                        <InputField
                            label="Correo Electrónico"
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            iconLeft={IconMail}
                            required
                        />

                        <InputField
                            label="Contraseña"
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            iconLeft={IconLock}
                            iconRight={showPassword ? IconEyeOff : IconEye}
                            onIconRightClick={() => setShowPassword(!showPassword)}
                            required
                        />

                        <button type="submit" className="bankify-btn-submit">
                            Crear mi cuenta
                        </button>
                    </form>
                </AuthCard>
            </div>
        </>
    );
};

export default RegisterView;