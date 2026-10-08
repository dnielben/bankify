import { useEffect, useState } from 'react';
import { IconArrowRight, IconCurrencyDollar } from '@tabler/icons-react';
import { toast } from 'sonner';
import Modal from '../common/Modal';
import AccountSummaryCard from './AccountSummaryCard';

// ─── Claves de localStorage ────────────────────────────────────────────────────
const TRANSFERS_KEY = 'bankify-transfers';

const getTransfers = () => {
    try {
        const stored = localStorage.getItem(TRANSFERS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveTransfer = (transfer) => {
    try {
        const transfers = getTransfers();
        transfers.unshift(transfer); // más reciente primero
        localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers));
    } catch { /* noop */ }
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(value);

const accountInfo = (numeroCuenta) => `Cuenta corriente · **** ${numeroCuenta.slice(-4)}`;

// ─── Componente ───────────────────────────────────────────────────────────────
export const TransferModal = ({ isOpen, onClose, onTransferComplete }) => {
    const [accounts, setAccounts]       = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount]           = useState('');
    const [message, setMessage]         = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const origin = accounts.find((account) => account.numeroCuenta === '1001');
    const recipients = accounts.filter((account) => account.numeroCuenta !== '1001');
    const recipient = recipients.find((account) => account.numeroCuenta === recipientId) ?? recipients[0];

    useEffect(() => {
        if (!isOpen) return;

        const loadAccounts = async () => {
            try {
                const response = await fetch('/api/cuentas');
                if (!response.ok) throw new Error('No fue posible consultar las cuentas.');

                const data = await response.json();
                setAccounts(data);
                setRecipientId((currentRecipientId) =>
                    data.some((account) => account.numeroCuenta === currentRecipientId)
                        ? currentRecipientId
                        : data.find((account) => account.numeroCuenta !== '1001')?.numeroCuenta ?? ''
                );
            } catch (error) {
                toast.error(error.message);
            }
        };

        loadAccounts();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const amountValue = Number(amount);
        if (!origin || !recipient) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/transferencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cuentaOrigen: origin.numeroCuenta,
                    cuentaDestino: recipient.numeroCuenta,
                    monto: amountValue,
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'No fue posible realizar la transferencia.');
            }

            const transaction = await response.json();
            saveTransfer({
                id: transaction.id || `TX-${Date.now()}`,
                recipient: recipient.titular,
                message: message || '—',
                date: new Date().toISOString().split('T')[0],
                amount: amountValue,
            });
            onTransferComplete?.();

            setAmount('');
            setMessage('');
            onClose?.();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="modal-title">Nueva Transferencia</h2>
            <p className="modal-subtitle">Mueve tus fondos a otra cuenta de forma segura</p>

            <div className="modal-accounts">
                <AccountSummaryCard
                    label="CUENTA ORIGEN"
                    name={origin?.titular ?? 'Cargando...'}
                    accountInfo={origin ? accountInfo(origin.numeroCuenta) : 'Cuenta corriente'}
                    balance={origin?.saldo ?? 0}
                />
                <span className="modal-arrow">
                    <IconArrowRight size={16} />
                </span>
                {recipient && (
                    <AccountSummaryCard
                        label="CUENTA DESTINO"
                        name={recipient.titular}
                        accountInfo={accountInfo(recipient.numeroCuenta)}
                        balance={recipient.saldo}
                    />
                )}
            </div>

            <div className="modal-balance-banner">
                <span className="modal-balance-label">Saldo disponible en tu cuenta</span>
                <span className="modal-balance-value">{formatCurrency(origin?.saldo ?? 0)}</span>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-field">
                    <label htmlFor="recipient">Destinatario*</label>
                    <select
                        id="recipient"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        required
                    >
                        {recipients.map((account) => (
                            <option key={account.numeroCuenta} value={account.numeroCuenta}>
                                {account.titular} – **** {account.numeroCuenta.slice(-4)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="modal-field">
                    <label htmlFor="amount">Monto a Transferir*</label>
                    <div className="modal-field-input-wrapper">
                        <IconCurrencyDollar size={18} className="modal-field-icon" />
                        <input
                            id="amount"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="modal-field">
                    <label htmlFor="message">Mensaje (Opcional)</label>
                    <textarea
                        id="message"
                        placeholder="Ej: Compra traje formal"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                    />
                </div>

                <button type="submit" className="modal-submit" disabled={isSubmitting || !origin || !recipient}>
                    {isSubmitting ? 'Procesando...' : 'Confirmar Transferencia'} <IconArrowRight size={16} />
                </button>
            </form>
        </Modal>
    );
};

export default TransferModal;
