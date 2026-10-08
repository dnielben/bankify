import React from 'react';
import { IconBolt, IconCreditCard, IconShieldCheck } from '@tabler/icons-react'; // 1. Importamos de Tabler
import './../../assets/css/landing/Feat.css';

export const Feat = () => {
    return (
        <section className="feats-section">
            <div className="feats-container">

                <div className="feats-header">
                    <h2>Diseñado para tu vida financiera</h2>
                    <p>Todo lo que necesitas para mover, ahorrar y hacer crecer tu dinero, en una sola app.</p>
                </div>

                <div className="feats-grid">

                    <div className="feat-card">
                        <div className="feat-icon-box">
                            <IconBolt size={32} stroke={2} className="feat-tabler-icon" />
                        </div>
                        <h3>Transferencias instantáneas</h3>
                        <p>Envía dinero a cualquier banco del país en segundos, sin costos ocultos ni filas.</p>
                    </div>

                    <div className="feat-card">
                        <div className="feat-icon-box">
                            <IconCreditCard size={32} stroke={2} className="feat-tabler-icon" />
                        </div>
                        <h3>Créditos flexibles</h3>
                        <p>Planes de crédito a tu medida con tasas claras y cuotas que se ajustan a tu bolsillo.</p>
                    </div>

                    <div className="feat-card">
                        <div className="feat-icon-box">
                            <IconShieldCheck size={32} stroke={2} className="feat-tabler-icon" />
                        </div>
                        <h3>Seguridad garantizada</h3>
                        <p>Tu información y tu dinero están protegidos con cifrado bancario y autenticación avanzada.</p>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default Feat;