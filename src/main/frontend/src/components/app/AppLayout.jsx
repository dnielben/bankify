import { Outlet } from 'react-router-dom';
import './../../assets/css/app/AppLayout.css';

/**
 * Layout compartido por todas las vistas autenticadas (/app/*).
 */
export const AppLayout = () => {
    return (
        <div className="app-layout">
            <main className="app-layout-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
