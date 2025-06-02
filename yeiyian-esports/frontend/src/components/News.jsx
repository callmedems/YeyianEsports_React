import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../css/styles.css";

const News = ({ navigateTo }) => (

  <div className="newsBody">
    {/* HEADER */}
    <header className="nav">
      <nav className="navContainer">
        <section className="navbar_left">
          <div className="dropdown">
            <button className="dropbtn">
              <img src="/assets/images/dropdown_menu.png" alt="Menú" />
            </button>
            <div id="menuDropdown" className="dropdown-content">
              <a href="#" onClick={() => navigateTo && navigateTo("news")}>Noticias</a>
              <a href="#" onClick={() => navigateTo && navigateTo("rules")}>Reglamento</a>
              <a href="#" onClick={() => navigateTo && navigateTo("tour")}>Tour Virtual</a>
              <a href="#" onClick={() => navigateTo && navigateTo("cotizacion")}>Precios</a>
            </div>
          </div>
          <Link to="/" className="logo">
            <img src="/assets/images/Arena Yeyian Logo.png" alt="Logo Arena Yeyian" />
          </Link>
        </section>
        <section className="navbar_center">
          <img src="/assets/images/Chivas Logo.png" alt="Logo de Chivas" />
          <div className="separador"></div>
          <img src="/assets/images/Yeyian Logo.png" alt="Logo Arena Yeyian" />
        </section>
        <section className="navbar_right">
          <a href="#" onClick={() => navigateTo && navigateTo("reservation")}>
            <span className="reservationText">¡Reserva Ya Tu Horario!</span>
            <span className="reservationShortText">¡Reserva Ya!</span>
          </a>
        </section>
      </nav>
    </header>

    {/* CONTENIDO PRINCIPAL */}
    <main className="newsMainContainer">
      <h1 className="mainTitle">Noticias Recientes</h1>

      <section className="newsGrid">
        <article className="newsCard">
          <h2 className="newsTitle">Ganador Gamer de la Arena 2025</h2>
          <p className="newsDescription">
            Este año inscríbete en uno de nuestros días disponibles y supera el record de más kills en CoD para ganar una firma oficial del Chicharito.
          </p>
          <button className="newsButton">Leer más</button>
        </article>

        <article className="newsCard">
          <h2 className="newsTitle">Nuevas consola PS5 en la arena</h2>
          <p className="newsDescription">
            ¡Prepárate porque tenemos nuevo equipo de parte de PlayStation para que te diviertas como nunca!
          </p>
          <button className="newsButton">Leer más</button>
        </article>

        {/* Puedes seguir agregando más artículos similares */}
      </section>
    </main>

    {/* FOOTER */}
    <footer className="footer">
      <nav className="footerContainer">
        <section className="footer_left">
          <p>Horario de Atención: 9am-9pm.</p>
        </section>
        <section className="footer_center">
          <a
            href="https://facebook.com/arenaYeyian"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/assets/images/facebook_logo.png" alt="Facebook" />
          </a>
          <a
            href="https://instagram.com/arenaYeyian"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/assets/images/instagram_logo.png" alt="Instagram" />
          </a>
          <a
            href="https://x.com/arenaYeyian"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/assets/images/x_logo.png" alt="X" />
          </a>
          <a
            href="https://twitch.tv/arenaYeyian"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/assets/images/twitch_logo.png" alt="Twitch" />
          </a>
          <a
            href="https://youtube.com/arenaYeyian"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/assets/images/youtube_logoDOS.png" alt="YouTube" />
          </a>
        </section>
        <section className="footer_right">
          <p>+52 XXX XXX XXXX</p>
        </section>
      </nav>
    </footer>
  </div>
);

export default News;
