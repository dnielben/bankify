import React from 'react';
import './../../assets/css/landing/Metrics.css';

export const Metrics = () => {
  return (
    <section className="metrics-section">
      <div className="metrics-container">
        <div className="metrics-box">
          
          <div className="metric-item">
            <span className="metric-number">+50.000</span>
            <p className="metric-text">clientes satisfechos en Colombia</p>
          </div>

          <div className="metric-item">
            <span className="metric-number">+10 años</span>
            <p className="metric-text">de experiencia en banca digital</p>
          </div>

          <div className="metric-item">
            <span className="metric-number">99,9%</span>
            <p className="metric-text">de disponibilidad de la plataforma</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Metrics;