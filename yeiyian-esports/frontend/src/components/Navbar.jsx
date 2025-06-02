// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/styles.css';
import '../css/Navbar.css';
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = e => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const navigate = useNavigate();
  const navigateTo = page => navigate(`/${page}`);

  return (
    <header className="nav">
      <nav className="navContainer">
        <section className="navbar_left">
          <div className="dropdown">
            <button
              onClick={toggleDropdown}
              className="dropbtn"
              ref={buttonRef}
            >
              <img src="/assets/images/dropdown_menu.png" alt="Menú" />
            </button>
            <div
              id="menuDropdown"
              ref={dropdownRef}
              className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}
            >
              <Link to="/news">Noticias</Link>
              <Link to="/rules">Reglamento</Link>
              <Link to="/tour">Tour Virtual</Link>
              <Link to="/cotization">Precios</Link>
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
          <div className="auth-buttons">
              <Link to="/login" className="login-button">Iniciar sesión</Link> 
              {/* añadi un boton pot separado para enclarecer el flujo con la db pero funciona igual si dejen solo el de login */}
              <Link to="/register" className="register-button">Registrarse</Link> 
              </div>

        <Link to="/reservation" className="reservation-link">
          <span className="reservationText">¡Reserva Ya Tu Horario!</span>
          <span className="reservationShortText">¡Reserva Ya!</span>
        </Link>
        </section>
      </nav>
    </header>
  );
};


export default Navbar;
