import { useCallback, useEffect, useState } from 'react';
import { IconArrowsRightLeft, IconBrain, IconExternalLink, IconSend, IconSearch } from '@tabler/icons-react';
import CustomButton from '../../components/common/CustomButton';
import DataTable from '../../components/app/DataTable';
import TransferModal from '../../components/app/TransferModal';
import FinancialAnalysisModal from '../../components/app/FinancialAnalysisModal';
import SortDropdown from '../../components/app/SortDropdown';
import './../../assets/css/app/TopView.css';

// ─── Constantes ────────────────────────────────────────────────────────────────
const TRANSFERS_KEY = 'bankify-transfers';
const CREDIT_EVAL_URL = import.meta.env.VITE_CREDIT_EVAL_URL;

const SORT_OPTIONS = [
    { value: 'date-desc',   label: 'Más reciente'           },
    { value: 'date-asc',    label: 'Más antiguo'            },
    { value: 'amount-desc', label: 'Monto: mayor a menor'   },
    { value: 'amount-asc',  label: 'Monto: menor a mayor'   },
];

const sortRows = (rows, sortBy) => {
    const sorted = [...rows];
    switch (sortBy) {
        case 'date-asc':    return sorted.sort((a, b) => a.date.localeCompare(b.date));
        case 'amount-desc': return sorted.sort((a, b) => b.amount - a.amount);
        case 'amount-asc':  return sorted.sort((a, b) => a.amount - b.amount);
        case 'date-desc':
        default:            return sorted.sort((a, b) => b.date.localeCompare(a.date));
    }
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(value);

const COLUMNS = [
    { key: 'id',        label: 'ID'           },
    { key: 'recipient', label: 'Destinatario' },
    { key: 'message',   label: 'Mensaje'      },
    { key: 'date',      label: 'Fecha'        },
    { key: 'amount',    label: 'Monto', render: (row) => formatCurrency(row.amount) },
];

// ─── Helpers de localStorage ──────────────────────────────────────────────────
const loadTransfers = () => {
    try {
        const stored = localStorage.getItem(TRANSFERS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// ─── Componente ───────────────────────────────────────────────────────────────
export const TransferencesView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [search, setSearch]           = useState('');
    const [sortBy, setSortBy]           = useState('date-desc');
    const [transfers, setTransfers]     = useState(loadTransfers);

    // Recarga la lista desde localStorage cada vez que se completa una transferencia
    const handleTransferComplete = useCallback(() => {
        setTransfers(loadTransfers());
    }, []);

    // Sincroniza si otra pestaña modifica localStorage
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === TRANSFERS_KEY) setTransfers(loadTransfers());
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const filteredRows = sortRows(
        transfers.filter((row) =>
            row.recipient.toLowerCase().includes(search.toLowerCase())
        ),
        sortBy
    );

    const handleCreditEval = () => {
        if (CREDIT_EVAL_URL) {
            window.open(CREDIT_EVAL_URL, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="top-view">
            <div className="top-header">
                <div className="top-title-group">
                    <span className="top-title-icon">
                        <IconArrowsRightLeft size={24} stroke={2.2} />
                    </span>
                    <div>
                        <h1>Mis Transacciones</h1>
                        <p>Revisa tu historial de movimientos de la cuenta</p>
                    </div>
                </div>

                <div className="top-actions">
                    <CustomButton variant="outline" onClick={() => setIsAnalysisModalOpen(true)}>
                        <span className="top-btn-content">
                            <IconBrain size={16} stroke={2.2} /> Analizar con IA
                        </span>
                    </CustomButton>
                    <CustomButton variant="solid" onClick={() => setIsModalOpen(true)}>
                        <span className="top-btn-content">
                            <IconSend size={16} stroke={2.2} /> Nueva Transferencia
                        </span>
                    </CustomButton>
                </div>
            </div>

            <div className="top-toolbar">
                <div className="top-search">
                    <IconSearch size={18} className="top-search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar transferencia por destinatario o monto"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="top-sort">
                    <SortDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
                </div>
            </div>

            <DataTable
                columns={COLUMNS}
                rows={filteredRows}
                emptyMessage="No tienes transferencias registradas."
            />

            {/* Botón de evaluación de crédito — URL definida en .env */}
            {CREDIT_EVAL_URL && (
                <div className="top-credit-eval">
                    <button
                        type="button"
                        className="top-credit-eval-btn"
                        onClick={handleCreditEval}
                    >
                        <IconExternalLink size={16} />
                        Evaluar Crédito
                    </button>
                </div>
            )}

            <TransferModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTransferComplete={handleTransferComplete}
            />
            <FinancialAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                transactions={filteredRows}
            />
        </div>
    );
};

export default TransferencesView;
