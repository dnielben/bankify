import { useState } from 'react';
import { IconArrowsRightLeft, IconPlus, IconSearch } from '@tabler/icons-react';
import CustomButton from '../../components/common/CustomButton';
import DataTable from '../../components/app/DataTable';
import TransferModal from '../../components/app/TransferModal';
import SortDropdown from '../../components/app/SortDropdown';
import './../../assets/css/app/TransferencesView.css';

// TODO: reemplazar por datos del backend (ej: useEffect + fetch a /api/transferences)
const MOCK_TRANSFERS = [
    { id: 'TX-001', recipient: 'Laura Ríos', message: '***7733', date: '2026-06-10', amount: 250000 },
    { id: 'TX-002', recipient: 'Laura Ríos', message: '***7733', date: '2026-06-10', amount: 250000 },
    { id: 'TX-003', recipient: 'Laura Ríos', message: '***7733', date: '2026-06-10', amount: 250000 },
    { id: 'TX-004', recipient: 'Laura Ríos', message: '***7733', date: '2026-06-10', amount: 250000 },
    { id: 'TX-005', recipient: 'Laura Ríos', message: '***7733', date: '2026-06-10', amount: 250000 },
];

const SORT_OPTIONS = [
    { value: 'date-desc', label: 'Más reciente' },
    { value: 'date-asc', label: 'Más antiguo' },
    { value: 'amount-desc', label: 'Monto: mayor a menor' },
    { value: 'amount-asc', label: 'Monto: menor a mayor' },
];

const sortRows = (rows, sortBy) => {
    const sorted = [...rows];

    switch (sortBy) {
        case 'date-asc':
            return sorted.sort((a, b) => a.date.localeCompare(b.date));
        case 'amount-desc':
            return sorted.sort((a, b) => b.amount - a.amount);
        case 'amount-asc':
            return sorted.sort((a, b) => a.amount - b.amount);
        case 'date-desc':
        default:
            return sorted.sort((a, b) => b.date.localeCompare(a.date));
    }
};

const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const COLUMNS = [
    { key: 'id', label: 'ID' },
    { key: 'recipient', label: 'Destinatario' },
    { key: 'message', label: 'Mensaje' },
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Monto', render: (row) => formatCurrency(row.amount) },
];

export const TransferencesView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    const filteredRows = sortRows(
        MOCK_TRANSFERS.filter((row) => row.recipient.toLowerCase().includes(search.toLowerCase())),
        sortBy
    );

    return (
        <div className="transferences-view">
            <div className="transferences-header">
                <div className="transferences-title-group">
                    <span className="transferences-title-icon">
                        <IconArrowsRightLeft size={22} stroke={1.8} />
                    </span>
                    <div>
                        <h1>Mis Transacciones</h1>
                        <p>Revisa tu historial de movimientos de la cuenta</p>
                    </div>
                </div>

                <CustomButton variant="solid" onClick={() => setIsModalOpen(true)}>
                    <span className="transferences-btn-content">
                        <IconPlus size={16} /> Nueva Transferencia
                    </span>
                </CustomButton>
            </div>

            <div className="transferences-toolbar">
                <div className="transferences-search">
                    <IconSearch size={18} className="transferences-search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar transferencia por destinatario o monto"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="transferences-sort">
                    <SortDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
                </div>
            </div>

            <DataTable columns={COLUMNS} rows={filteredRows} emptyMessage="No tienes transferencias registradas." />

            <TransferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default TransferencesView;
