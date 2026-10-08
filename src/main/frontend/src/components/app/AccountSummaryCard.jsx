import './../../assets/css/app/AccountSummaryCard.css';

/**
 * Mini-tarjeta que resume una cuenta (origen o destino) dentro del
 * modal de transferencia. Formatea el saldo como moneda local (COP).
 *
 * @param {string} label - "CUENTA ORIGEN" | "CUENTA DESTINO"
 * @param {string} name - Nombre del titular
 * @param {string} accountInfo - Ej: "Cuenta Corriente · **** 4821"
 * @param {number} balance
 */
export const AccountSummaryCard = ({ label, name, accountInfo, balance }) => {
    const formattedBalance = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(balance);

    return (
        <div className="account-summary-card">
            <span className="account-summary-label">{label}</span>
            <span className="account-summary-name">{name}</span>
            <span className="account-summary-info">{accountInfo}</span>
            <span className="account-summary-balance">{formattedBalance}</span>
        </div>
    );
};

export default AccountSummaryCard;
