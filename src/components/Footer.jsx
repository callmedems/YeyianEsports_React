import React from "react";
import "../../src/assets/css/styles.css";

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="footerContainer">
        <section className="footer_left">
          <p>Horario de Atención: 9am-9pm.</p>
        </section>
        <section className="footer_center">
          <a href="#"><img src="/src/assets/images/facebook_logo.png" alt="Facebook" /></a>
          <a href="#"><img src="/src/assets/images/instagram_logo.png" alt="Instagram" /></a>
          <a href="#"><img src="/src/assets/images//x_logo.png" alt="X" /></a>
          <a href="#"><img src="/src/assets/images/twitch_logo.png" alt="Twitch" /></a>
          <a href="#"><img src="/src/assets/images/youtube_logoDOS.png" alt="YouTube" /></a>
        </section>
        <section className="footer_right">
          <p>+52 XXX XXX XXXX</p>
        </section>
      </nav>
    </footer>
  );
};

export default Footer;
