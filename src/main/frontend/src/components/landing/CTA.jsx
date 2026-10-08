import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../../assets/css/landing/CTA.css';

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-box">
          
          <h2>Únete a la nueva forma de hacer banca.</h2>
          <p>
            Abre tu cuenta Bankify hoy y descubre por qué miles de colombianos 
            ya confían en nosotros.
          </p>
          
          <button className="bankify-btn-white" onClick={() => navigate('/auth/register')}>
            Abrir cuenta gratis &rarr;
          </button>

        </div>
      </div>
    </section>
  );
};

export default CTA;