import { IconDownload, IconUpload, IconCircleCheck } from '@tabler/icons-react';
import CustomButton from '../../components/common/CustomButton';
import './../../assets/css/admin/AdminCard.css';

const STATUS_STYLES = {
    pendiente: 'admin-card-badge-pending',
    completado: 'admin-card-badge-done',
};

export const AdminCard = ({
    title,
    team,
    icon: Icon,
    status,
    statusLabel,
    downloadAction,
    uploadSlots = [],
    onFileUpload,
    progress,
}) => {
    const isCardCompleted = status === 'completado';
    const showProgress = progress && progress.total > 1;

    const handleFileChange = (slot) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileUpload?.(slot.id, file);
    };

    return (
        <div className={`admin-card ${isCardCompleted ? 'admin-card-completed' : ''}`}>
            <div className="admin-card-header">
                <div className="admin-card-title-group">
                    <span className="admin-card-icon">
                        {Icon && <Icon size={24} stroke={2.2} />}
                    </span>
                    <div>
                        <h2>{title}</h2>
                        <span className="admin-card-team">{team}</span>
                    </div>
                </div>

                <div className="admin-card-status-group">
                    {showProgress && (
                        <span className="admin-card-progress">
                            {progress.done} de {progress.total}
                        </span>
                    )}
                    <span className={`admin-card-badge ${STATUS_STYLES[status] ?? 'admin-card-badge-pending'}`}>
                        <span className="admin-card-badge-dot" /> {statusLabel}
                    </span>
                </div>
            </div>

            {downloadAction && (
                <div className="admin-card-download">
                    <CustomButton variant="solid" onClick={downloadAction.onClick}>
                        <IconDownload size={15} stroke={2.2} />
                        {downloadAction.label}
                    </CustomButton>
                </div>
            )}

            <div className="admin-card-uploads">
                {uploadSlots.map((slot) => {
                    const isSlotDone = Boolean(slot.fileName);

                    return (
                        <div className="admin-card-upload-block" key={slot.id}>
                            <p className="admin-card-upload-label">{slot.label}</p>
                            <label className={`admin-card-dropzone ${isSlotDone ? 'admin-card-dropzone-done' : ''}`}>
                                {isSlotDone ? (
                                    <IconCircleCheck size={26} stroke={1.8} className="admin-card-dropzone-icon admin-card-dropzone-icon-done" />
                                ) : (
                                    <IconUpload size={26} stroke={1.8} className="admin-card-dropzone-icon" />
                                )}
                                <span>
                                    {isSlotDone
                                        ? slot.fileName
                                        : 'Haz click o arrastra el archivo aquí'}
                                </span>
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange(slot)}
                                />
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminCard;