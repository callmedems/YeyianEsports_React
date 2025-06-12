// src/components/Footer.jsx
import React from 'react';
import '../css/footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footerContainer">
      <div className="footer_left">
        <p>Horario de Atención: <strong>09:00 – 21:00</strong></p>
      </div>
      <div className="footer_center">
        <a href="https://www.facebook.com/Chivasesports" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/facebook_logo.png" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/chivasesports" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/instagram_logo.png" alt="Instagram" />
        </a>
        <a href="https://x.com/esportschivas" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/x_logo.png" alt="X" />
        </a>
        <a href="https://twitch.tv/chivas" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/twitch_logo.png" alt="Twitch" />
        </a>
        <a href="https://youtube.com/@chivas" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/youtube_logo.png" alt="YouTube" />
        </a>
      </div>
      <div className="footer_right">
        <p>Contacto: <a href="tel:+523312345678">+52 (33) 1234-5678</a></p>
      </div>
    </div>

    <div className="footer_bottom">
      <p>© 2025 Arena Yeyian. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
