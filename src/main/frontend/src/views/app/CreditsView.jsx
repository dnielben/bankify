import { useCallback, useEffect, useState } from "react";
import { IconClipboardText, IconClipboardPlus, IconSearch } from "@tabler/icons-react"
import CustomButton from "../../components/common/CustomButton"
import SortDropdown from "../../components/app/SortDropdown";
import DataTable from "../../components/app/DataTable";
import CreditModal from "../../components/app/Creditmodal";
import './../../assets/css/app/TopView.css';

// ─── Constantes ────────────────────────────────────────────────────────────────
const CREDITS_KEY = 'bankify-credits';

const SORT_OPTIONS = [
    { value: 'date-desc',   label: 'Más reciente'         },
    { value: 'date-asc',    label: 'Más antiguo'          },
    { value: 'amount-desc', label: 'Monto: mayor a menor' },
    { value: 'amount-asc',  label: 'Monto: menor a mayor' },
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

const STATUS_CONFIG = {
    'pending': { label: 'En Revisión', className: 'credit-status--pending'  },
    'approved':    { label: 'Aprobado',    className: 'credit-status--approved' },
    'denied':   { label: 'Rechazado',   className: 'credit-status--rejected' },
};

const COLUMNS = [
    { key: 'id',      label: 'ID'        },
    { key: 'purpose', label: 'Propósito' },
    { key: 'date',    label: 'Fecha'     },
    { key: 'amount',  label: 'Monto',    render: (row) => formatCurrency(row.amount)  },
    { key: 'incomes', label: 'Ingresos', render: (row) => formatCurrency(row.incomes) },
    {
        key: 'status',
        label: 'Estado',
        render: (row) => {
            const config = STATUS_CONFIG[row.status] ?? { label: row.status, className: 'credit-status--pending' };
            return (
                <span className={`credit-status ${config.className}`}>
                    {config.label}
                </span>
            );
        }
    },
];

// ─── Helpers de localStorage ──────────────────────────────────────────────────
const loadCredits = () => {
    try {
        const stored = localStorage.getItem(CREDITS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// ─── Componente ───────────────────────────────────────────────────────────────
const CreditsView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch]           = useState('');
    const [sortBy, setSortBy]           = useState('date-desc');
    const [credits, setCredits]         = useState(loadCredits);

    const handleCreditComplete = useCallback(() => {
        setCredits(loadCredits());
    }, []);

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === CREDITS_KEY) setCredits(loadCredits());
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const filteredRows = sortRows(
        credits.filter((row) =>
            row.purpose.toLowerCase().includes(search.toLowerCase()) ||
            row.amount.toString().includes(search)
        ),
        sortBy
    );

    return (
        <div className="top-view">
            <div className="top-header">
                <div className="top-title-group">
                    <span className="top-title-icon">
                        <IconClipboardText size={24} stroke={2.2} />
                    </span>
                    <div>
                        <h1>Mis Créditos</h1>
                        <p>Revisa tu historial de solicitudes activas</p>
                    </div>
                </div>

                <CustomButton variant="solid" onClick={() => setIsModalOpen(true)}>
                    <span className="top-btn-content">
                        <IconClipboardPlus size={18} stroke={2.2} /> Nuevo Crédito
                    </span>
                </CustomButton>
            </div>

            <div className="top-toolbar">
                <div className="top-search">
                    <IconSearch size={18} className="top-search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar crédito por propósito o monto"
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
                emptyMessage="No tienes créditos solicitados."
            />

            <CreditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreditComplete={handleCreditComplete}
            />
        </div>
    );
};

export default CreditsView;