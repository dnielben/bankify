import './../../assets/css/app/ActionCard.css';

/**
 * Tarjeta de acceso rápido usada en el Dashboard (grid 2x2: Mis Créditos,
 * Mis Transacciones, Nuevo Crédito, Nueva Transferencia).
 *
 * @param {React.ComponentType} icon - Componente de ícono (de @tabler/icons-react).
 * @param {string} title
 * @param {string} description
 * @param {() => void} onClick
 */
export const ActionCard = ({ icon: Icon, title, description, onClick }) => {
    return (
        <button type="button" className="action-card" onClick={onClick}>
            <span className="action-card-icon">
                <Icon size={28} stroke={1.8} />
            </span>
            <span className="action-card-title">{title}</span>
            <span className="action-card-description">{description}</span>
        </button>
    );
};

export default ActionCard;
