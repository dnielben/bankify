import { useState } from 'react';
import { IconArrowRight, IconCurrencyDollar, IconUser, IconCheck, IconTargetArrow } from '@tabler/icons-react';
import Modal from '../common/Modal';
import './../../assets/css/common/Modal.css';
import { toast } from "sonner";

import Bus from "./../../assets/img/catpcha/bus.png";
import House from "./../../assets/img/catpcha/house.png";
import Camel from "./../../assets/img/catpcha/camel.png";
import Plane from "./../../assets/img/catpcha/plane.png";
import Car from "./../../assets/img/catpcha/car.png";
import Cat from "./../../assets/img/catpcha/cat.png";
import Bicycle from "./../../assets/img/catpcha/bicycle.png";
import Burger from "./../../assets/img/catpcha/burger.png";

// ─── Constantes ───────────────────────────────────────────────────────────────
const CREDITS_KEY = 'bankify-credits';

const VERIFICATION_IMAGES = [
    { id: 'img-1', src: Bus,     isTransport: true  },
    { id: 'img-2', src: House,   isTransport: false },
    { id: 'img-3', src: Camel,   isTransport: false },
    { id: 'img-4', src: Plane,   isTransport: true  },
    { id: 'img-5', src: Car,     isTransport: true  },
    { id: 'img-6', src: Cat,     isTransport: false },
    { id: 'img-7', src: Bicycle, isTransport: true  },
    { id: 'img-8', src: Burger,  isTransport: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Bug intencional: mientras el admin no corrija el módulo de IA (mod-3),
 * el CAPTCHA acepta cualquier selección, incluso vacía.
 * Una vez corregido, exige seleccionar exactamente los medios de transporte.
 */
const validateCaptcha = (selectedImages) => {
    const isCaptchaFixed = localStorage.getItem('bug_captcha_fixed') === 'true';

    if (!isCaptchaFixed) return true; // bug: siempre pasa

    const correctIds = VERIFICATION_IMAGES
        .filter((img) => img.isTransport)
        .map((img) => img.id);

    return (
        correctIds.length === selectedImages.length &&
        correctIds.every((id) => selectedImages.includes(id))
    );
};

const saveCredit = (credit) => {
    try {
        const stored = localStorage.getItem(CREDITS_KEY);
        const current = stored ? JSON.parse(stored) : [];
        localStorage.setItem(CREDITS_KEY, JSON.stringify([...current, credit]));
        toast.success("Solicitud de crédito registrada.")
    } catch (err) {
        console.error('Error guardando crédito:', err);
    }
};

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── Componente ───────────────────────────────────────────────────────────────
export const CreditModal = ({ isOpen, onClose, onCreditComplete }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        amount:   0,
        incomes:  0,
        purpose:  '',
        status: 'pending'
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [images, setImages] = useState(() => shuffleArray(VERIFICATION_IMAGES));
    const [captchaError, setCaptchaError]     = useState(false);

    const toggleImage = (imageId) => {
        setSelectedImages((prev) =>
            prev.includes(imageId)
                ? prev.filter((id) => id !== imageId)
                : [...prev, imageId]
        );
        setCaptchaError(false);
    };

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleClose = () => {
        setFormData({ fullName: '', amount: 0, incomes: 0, purpose: '' });
        setSelectedImages([]);
        setImages(shuffleArray(VERIFICATION_IMAGES));
        setCaptchaError(false);
        onClose?.();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateCaptcha(selectedImages)) {
            setCaptchaError(true);
            return;
        }

        const newCredit = {
            id:      `CR-${Date.now()}`,
            purpose: formData.purpose,
            date:    new Date().toISOString().split('T')[0],
            amount:  Number(formData.amount),
            incomes: Number(formData.incomes),
            status:  localStorage.getItem('bug_captcha_fixed') === 'true' ? 'pending' : 'denied',
        };

        saveCredit(newCredit);
        onCreditComplete?.(); // notifica a CreditsView para recargar
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <h2 className="modal-title">Nueva Solicitud de Crédito</h2>
            <p className="modal-subtitle">Completa el formulario y verifica que no eres un robot.</p>

            <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-group-2">
                    <div className="modal-field">
                        <label htmlFor="fullName">Nombre Completo*</label>
                        <div className="modal-field-input-wrapper">
                            <IconUser size={18} className="modal-field-icon" />
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Ingresa tu nombre y apellido"
                                value={formData.fullName}
                                onChange={handleChange('fullName')}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-field">
                        <label htmlFor="amount">Monto Solicitado*</label>
                        <div className="modal-field-input-wrapper">
                            <IconCurrencyDollar size={18} className="modal-field-icon" />
                            <input
                                id="amount"
                                type="number"
                                min={0}
                                step={50}
                                placeholder="Ej: 5.000.000"
                                value={formData.amount}
                                onChange={handleChange('amount')}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-group-2">
                    <div className="modal-field">
                        <label htmlFor="incomes">Ingresos Mensuales*</label>
                        <div className="modal-field-input-wrapper">
                            <IconCurrencyDollar size={18} className="modal-field-icon" />
                            <input
                                id="incomes"
                                type="number"
                                step={50}
                                min={0}
                                placeholder="Ej: 2.500.000"
                                value={formData.incomes}
                                onChange={handleChange('incomes')}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-field">
                        <label htmlFor="purpose">Propósito*</label>
                        <div className="modal-field-input-wrapper">
                            <IconTargetArrow size={18} className="modal-field-icon" />
                            <input
                                id="purpose"
                                type="text"
                                placeholder="Ej: Compra de vehículo"
                                value={formData.purpose}
                                onChange={handleChange('purpose')}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="captcha-verification">
                    <div className="captcha-header">
                        <div>
                            <h3>Verificación de seguridad</h3>
                            <p>Selecciona todas las imágenes de medios de transporte</p>
                        </div>
                    </div>

                    <div className="captcha-grid">
                        {images.map((img) => (
                            <button
                                type="button"
                                key={img.id}
                                className={`captcha-tile ${selectedImages.includes(img.id) ? 'captcha-tile-selected' : ''}`}
                                onClick={() => toggleImage(img.id)}
                            >
                                <img src={img.src} alt="" />
                                {selectedImages.includes(img.id) && (
                                    <span className="captcha-tile-check">
                                        <IconCheck size={16} />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {captchaError && (
                        <p className="captcha-error">Selección incorrecta, intenta nuevamente.</p>
                    )}
                </div>

                <button type="submit" className="modal-submit">
                    Enviar Solicitud <IconArrowRight size={16} />
                </button>
            </form>
        </Modal>
    );
};

export default CreditModal;