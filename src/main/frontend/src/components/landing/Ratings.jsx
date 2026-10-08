import React from 'react';
import { IconStarFilled } from '@tabler/icons-react';
import "./../../assets/css/landing/Ratings.css"

export const Ratings = () => {
  const testimonials = [
    {
      initials: 'VQ',
      name: 'Valentina Quintero',
      location: 'Medellín, Colombia',
      text: '"Abrí mi cuenta desde el celular y a los 10 minutos ya estaba recibiendo mi primer pago. Súper fácil."'
    },
    {
      initials: 'AS',
      name: 'Andrés Suárez',
      location: 'Bogotá, Colombia',
      text: '"Las transferencias son instantáneas y nunca me han cobrado de más."'
    },
    {
      initials: 'MC',
      name: 'Mariana Castaño',
      location: 'Cali, Colombia',
      text: '"Pedí un crédito para mi emprendimiento y la respuesta fue rapidísima. La app es muy clara."'
    }
  ];

  return (
    <section className="ratings-section">
      <div className="ratings-container">
        
        <div className="ratings-header">
          <h2>Lo que dicen nuestros clientes</h2>
          <p>Historias reales de personas que ya cambiaron su forma de manejar el dinero.</p>
        </div>

        <div className="ratings-grid">
          {testimonials.map((item, index) => (
            <div className="rating-card" key={index}>
              <div>
                <div className="stars-container">
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled key={i} size={20} />
                  ))}
                </div>
                <p className="rating-comment">{item.text}</p>
              </div>
              
              <div>
                <hr className="divider" />
                <div className="user-info">
                  <div className="avatar-circle">{item.initials}</div>
                  <div className="user-text">
                    <span className="user-name">{item.name}</span>
                    <span className="user-location">{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Ratings;