import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { AuthCard } from '../../components/auth/AuthCard';
import { InputField } from '../../components/auth/InputField';
import { isBugFixed } from '../../utils/authUtils';

import "./../../assets/css/auth/LoginView.css"

export const LoginView = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null); 
        const users = JSON.parse(localStorage.getItem('bankify_users') || '[]');
        
        const userFound = users.find((u) => u.email === email && u.password === password);

        if (!userFound) {
            setError('Credenciales incorrectas.');
            return;
        }

        if (userFound.role === 'client') {
            if (!isBugFixed()) {
                setError('Sistema en mantenimiento temporal. Por favor, intente más tarde o contacte a soporte.');
                return;
            }
        }

        localStorage.setItem('bankify_current_user', JSON.stringify(userFound));

        console.log('Login success:', userFound);

        if (userFound.role === 'admin') {
            navigate('/app/admin'); 
        } else {
            navigate("/app/dashboard");
        }
    };

    return (
        <>
            <div className="login-page">
                <AuthCard title="Accede a tu cuenta" subtitle="Tu banco digital, en cualquier lugar.">
                    <form className="login-form" onSubmit={handleSubmit}>

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
                            Iniciar Sesión
                        </button>
                    </form>
                </AuthCard>
            </div>
        </>
    );
};

export default LoginView;