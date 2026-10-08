import { useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import './../../assets/css/common/Modal.css';

/**
 * Modal genérico reutilizable.
 *
 * Pensado para servir de base a cualquier modal de la app (transferencias,
 * créditos, confirmaciones, etc.), no solo al de "Nueva Transferencia".
 *
 * @param {boolean} isOpen - Controla si el modal se renderiza.
 * @param {() => void} onClose - Se llama al cerrar (click en overlay, botón X o tecla Escape).
 * @param {React.ReactNode} children - Contenido del modal.
 * @param {string} [maxWidth] - Ancho máximo del modal (CSS value). Por defecto 485px (medida del diseño).
 */
export const Modal = ({ isOpen, onClose, children, maxWidth = '485px' }) => {
    // Cierra el modal con la tecla Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        // Solo cierra si el click fue directamente sobre el overlay, no sobre el contenido
        if (e.target === e.currentTarget) onClose?.();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" style={{ maxWidth }}>
                <button
                    type="button"
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    <IconX size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
