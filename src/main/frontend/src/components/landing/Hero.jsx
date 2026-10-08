import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../common/CustomButton';
import heroImg from '../../assets/img/hero.png';
import './../../assets/css/landing/Hero.css';

export const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-section">
            <div className="hero-container">

                <div className="hero-content">
                    <h1>
                        Tu dinero, siempre <span className="text-highlight">seguro</span> y a tu alcance.
                    </h1>
                    <p>
                        Bankify es la banca moderna pensada para ti: abre tu cuenta en minutos,
                        transfiere sin filas y accede a créditos diseñados a tu medida.
                    </p>
                    <div className="hero-buttons">
                        <CustomButton variant="solid" onClick={() => navigate('/auth/register')}>
                            Abrir cuenta &rarr;
                        </CustomButton>
                        <CustomButton variant="neutral-outline" onClick={() => console.log('Saber más')}>
                            Conocer más
                        </CustomButton>
                    </div>
                </div>

                <div className="hero-image-container">
                    <img src={heroImg} alt="Ilustración Bankify" className="hero-image" />
                </div>

            </div>
        </section>
    );
};

export default Hero;