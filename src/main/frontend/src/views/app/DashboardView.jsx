import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowsRightLeft, IconClipboardList, IconClipboardPlus, IconSend } from '@tabler/icons-react';
import ActionCard from '../../components/app/ActionCard';
import CreditModal from "../../components/app/Creditmodal";
import TransferModal from "../../components/app/TransferModal";
import { getCurrentUser } from '../../utils/authUtils';
import './../../assets/css/app/DashboardView.css';

export const DashboardView = () => {
    const [modalForm, setModalForm] = useState(null);
    const navigate = useNavigate();
    const user = getCurrentUser();
    const userName = user ? user.fullName : 'Invitado';

    const actions = [
        {
            icon: IconClipboardList,
            title: 'Mis Créditos',
            description: 'Consulta tus solicitudes activas',
            onClick: () => navigate('/app/credits'),
        },
        {
            icon: IconArrowsRightLeft,
            title: 'Mis Transacciones',
            description: 'Revisa el historial de movimientos',
            onClick: () => navigate('/app/transferences'),
        },
        {
            icon: IconClipboardPlus,
            title: 'Nuevo Crédito',
            description: 'Solicita un nuevo crédito',
            onClick: () => setModalForm("credit"),
        },
        {
            icon: IconSend,
            title: 'Nueva Transferencia',
            description: 'Envía dinero a otra cuenta',
            onClick: () => setModalForm("transfer"),
        },
    ];

    return (
        <div className="dashboard-view">
            <h1 className="dashboard-greeting">{userName}, ¿Qué quieres hacer hoy?</h1>
            <div className="dashboard-actions-grid">
                {actions.map((action) => (
                    <ActionCard key={action.title} {...action} />
                ))}
            </div>
            {modalForm === "credit" &&
                <CreditModal
                    isOpen={true}
                    onClose={() => setModalForm("")}
                />
            }
            {modalForm === "transfer" &&
                <TransferModal
                    isOpen={true}
                    onClose={() => setModalForm("")}
                />
            }
        </div>
    );
};

export default DashboardView;
