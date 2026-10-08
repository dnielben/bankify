import logoBankify from "../../assets/img/Logo.webp";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import CustomButton from "../common/CustomButton";
import { getCurrentUser } from "../../utils/authUtils";

import "../../assets/css/common/NavBar.css";

export const Navbar = () => {
    const navigate = useNavigate();
    useLocation();
    const user = getCurrentUser();

    const handleLoginRedirect = () => {
        navigate("/auth/login");
    };

    const handleRegisterRedirect = () => {
        navigate("/auth/register");
    };

    const handleLogout = () => {
        localStorage.removeItem('bankify_current_user');
        navigate("/auth/login");
    };

    return (
        <nav className="bankify-navbar">
            <div className="navbar-container">

                {/* Logo original */}
                <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src={logoBankify} alt="Logo Bankify" />
                </div>

                {user && (
                    <div className="navbar-links">
                        <Link to="/app/dashboard" className="navbar-link-item">
                            Página Principal
                        </Link>
                        {user.role === 'client' && (
                            <>
                                <Link to="/app/credits" className="navbar-link-item">
                                    Créditos
                                </Link>
                                <Link to="/app/transferences" className="navbar-link-item">
                                    Transferencias
                                </Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <Link to="/app/admin" className="navbar-link-item">
                                Panel Admin
                            </Link>
                        )}
                    </div>
                )}

                <div className="navbar-actions">
                    {user ? (
                        <div className="navbar-user-profile">
                            <div className="navbar-avatar-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-user-avatar">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <span className="navbar-user-name">
                                {user.fullName}
                            </span>
                            <CustomButton variant="outline" onClick={handleLogout}>
                                Cerrar Sesión
                            </CustomButton>
                        </div>
                    ) : (
                        /* ESTADO PÚBLICO: Botones limpios originales de Juan Pablo */
                        <>
                            <CustomButton variant="outline" onClick={handleLoginRedirect}>
                                Iniciar Sesión
                            </CustomButton>

                            <CustomButton variant="solid" onClick={handleRegisterRedirect}>
                                Registrarse
                            </CustomButton>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;