import './../../assets/css/admin/SummaryGallery.css';

const STATUS_STYLES = {
    pendiente: 'summary-badge-pending',
    completado: 'summary-badge-done',
};

export const SummaryGallery = ({ items = [] }) => {
    return (
        <div className="summary-gallery">
            {items.map((item) => (
                <button
                    type="button"
                    key={item.id}
                    className="summary-card"
                >
                    <span className="summary-card-team">{item.team}</span>
                    <h3>{item.title}</h3>
                    <span className={`summary-badge ${STATUS_STYLES[item.status] ?? 'summary-badge-pending'}`}>
                        <span className="summary-badge-dot" /> {item.statusLabel ?? 'Pendiente'}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default SummaryGallery;