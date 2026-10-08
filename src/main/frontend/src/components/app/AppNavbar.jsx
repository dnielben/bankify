import { NavLink, useNavigate } from 'react-router-dom';
import { IconUserCircle } from '@tabler/icons-react';
import logoBankify from '../../assets/img/Logo.webp';
import './../../assets/css/app/AppNavbar.css';

// TODO: reemplazar por datos reales del usuario autenticado cuando exista auth/contexto global
const MOCK_USER = {
    name: 'Elián Ibarra',
};

const NAV_LINKS = [
    { to: '/app/dashboard', label: 'Página Principal' },
    { to: '/app/credits', label: 'Créditos' },
    { to: '/app/transferences', label: 'Transferencias' },
];

export const AppNavbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="app-navbar">
            <div className="app-navbar-container">

                <div className="app-navbar-logo" onClick={() => navigate('/app/dashboard')}>
                    <img src={logoBankify} alt="Logo Bankify" />
                </div>

                <div className="app-navbar-links">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `app-navbar-link${isActive ? ' app-navbar-link-active' : ''}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* TODO: convertir en dropdown funcional (perfil / cerrar sesión) */}
                <div className="app-navbar-user">
                    <IconUserCircle size={28} stroke={1.5} />
                    <span className="app-navbar-user-name">{MOCK_USER.name}</span>
                </div>

            </div>
        </nav>
    );
};

export default AppNavbar;
