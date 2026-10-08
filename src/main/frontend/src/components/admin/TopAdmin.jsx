import { IconRefresh } from '@tabler/icons-react';
import CustomButton from '../../components/common/CustomButton';
import './../../assets/css/admin/TopAdmin.css';

export const TopAdmin = ({ onReset }) => {
    return (
        <div className="top-admin">
            <div className="top-admin-info">
                <span className="top-admin-breadcrumb">Panel Administrador</span>
                <h1>Panel de Control del Sistema</h1>
                <p>Administra y supervisa los módulos del sistema bancario.</p>
            </div>

            <CustomButton variant="outline" onClick={onReset}>
                <IconRefresh size={16} stroke={2.2} /> Reiniciar módulos
            </CustomButton>
        </div>
    );
};

export default TopAdmin;