// ----- Footer.jsx ----- //
import React from 'react';
import '../index.css';

const Footer = () => (
  <footer className="footer">
    <nav className="footerContainer">
      <section className="footer_left">
        <p>Horario de Atención: 9am-9pm.</p>
      </section>
      <section className="footer_center">
        <a href="https://www.facebook.com/Chivasesports" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/facebook_logo.png" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/chivasesports?igsh=MWFvdGt6ZHQ0bHEybA==" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/instagram_logo.png" alt="Instagram" />
        </a>
        <a href="https://x.com/esportschivas?s=11&t=YoR7Z5t67pN4UuwEaGgIzg" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/x_logo.png" alt="X" />
        </a>
        <a href="https://twitch.tv/chivas" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/twitch_logo.png" alt="Twitch" />
        </a>
        <a href="https://youtube.com/@chivas?si=p2yX56jb8_To_b71.tv/chivas" target="_blank" rel="noopener noreferrer">
          <img src="/assets/images/youtube_logo.png" alt="Youtube" />
        </a>
      </section>
      <section className="footer_right">
        <p>+52 (XXX) XXX XXXX</p>
      </section>
    </nav>
  </footer>
);

export default Footer;
