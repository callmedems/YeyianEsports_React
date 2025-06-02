import React from "react";
import "../../src/assets/css/styles.css"; 
//import "@fortawesome/fontawesome-free/css/all.min.css";

const Navbar = () => {
  return (
    <header className="nav">
      <nav className="navContainer">
        <section className="navbar_left">
          {/* Asegúrate de que las imágenes existan en la carpeta public/assets/images */}
          <a href="/" className="logo">
            <img
              src="/src/assets/images/Arena Yeyian Logo.png"
              alt="Logo Arena Yeyian"
            />
          </a>
        </section>
        <section className="navbar_center">
          <img src="/src/assets/images/Chivas Logo.png" alt="Logo de Chivas" />
          <div className="separador"></div>
          <img src="/src/assets/images/Yeyian Logo.png" alt="Logo Arena Yeyian" />
        </section>
        <section className="navbar_right">
          <a
            href="mailto:soporte@chivasesports.com?subject=Reserva%20nueva&body=Hola,%20quiero%20hacer%20una%20reserva"
          >
            <span className="reservationText">¡Reserva Ya Tu Horario!</span>
            <span className="reservationShortText">¡Reserva Ya!</span>
          </a>
        </section>
      </nav>
    </header>
  );
};

export default Navbar;
