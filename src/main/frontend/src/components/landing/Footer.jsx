import React from 'react';
import logoBankify from '../../assets/img/Logo.webp';
import './../../assets/css/landing/Footer.css';

export const Footer = () => {
    return (
        <footer className="bankify-footer">

            <div className="footer-top">
                <img src={logoBankify} alt="Logo Bankify" className="footer-logo" />
                <p className="footer-slogan">Banca moderna para ti, segura y sin complicaciones.</p>
            </div>

            <hr className="footer-divider" />

            <div className="footer-bottom">
                <span>&copy; 2025 Bankify. Todos los derechos reservados.</span>
                <span>Bankify &mdash; Banca moderna para todos.</span>
            </div>

        </footer>
    );
};

export default Footer;