// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // 1) Cada vez que cambie la ruta, checamos si está logueado
  useEffect(() => {
    const token = localStorage.getItem('reserva');
    setIsLoggedIn(!!token);

    // Si existe token, leemos también el userName (aunque la suscripción del otro useEffect ya lo cubre)
    const storedName = localStorage.getItem('navbarUserName') || '';
    setUserName(storedName);
  }, [location]);

  // 2) Al montar, inicializamos nombre y foto, y nos suscribimos al evento
  useEffect(() => {
    const storedName = localStorage.getItem("navbarUserName") || "Usuario";
    const storedPic  = localStorage.getItem("navbarProfilePicture") || null;
    setUserName(storedName);
    setProfilePicture(storedPic);

    // Cuando alguien dispare 'userProfileChanged', volvemos a leer del localStorage:
    const onChange = () => {
      const newName = localStorage.getItem("navbarUserName") || "Usuario";
      const newPic  = localStorage.getItem("navbarProfilePicture") || null;
      setUserName(newName);
      setProfilePicture(newPic);
    };
    window.addEventListener("userProfileChanged", onChange);

    return () => {
      window.removeEventListener("userProfileChanged", onChange);
    };
  }, []);

  // 3) Permitir cerrar con Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // 4) Función de navegación
  const navigateTo = (path) => {
    closeMenu();
    navigate(path.startsWith('/') ? path : `/${path}`);
  };

  // 5) Logout
  const handleLogout = () => {
    localStorage.removeItem('reserva');
    localStorage.removeItem('clientId');
    localStorage.removeItem('navbarUserName');
    localStorage.removeItem('navbarProfilePicture');
    setIsLoggedIn(false);
    setUserName('');
    setProfilePicture(null);
    closeMenu();
    navigate('/');
  };

  return (
    <>
      <header className="nav">
        <nav className="navContainer">
          <section className="navbar_left">
            <button
              onClick={toggleMenu}
              className="menu-button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <img src="/assets/images/dropdown_menu.png" alt="Ícono de menú"/>
            </button>

            <Link to="/" className="logo">
              <img src="/assets/images/Arena Yeyian Logo.png" alt="Logo Arena Yeyian"/>
            </Link>
          </section>

          <section className="navbar_center">
            <img src="/assets/images/Chivas Logo.png" alt="Logo de Chivas" />
            <div className="separador"></div>
            <img src="/assets/images/Yeyian Logo.png" alt="Logo Yeyian" />
          </section>

          <section className="navbar_right">
            <Link to="/reservation" className="reservation-link">
              <span className="reservationText">¡Reserva Ya Tu Horario!</span>
            </Link>
          </section>
        </nav>
      </header>

      {/* Overlay semitransparente */}
      <div className={`overlay ${menuOpen ? 'show' : ''}`} onClick={closeMenu}></div>

      {/* Sidebar lateral */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={closeMenu} aria-label="Cerrar menú">
          &times;
        </button>

        {!isLoggedIn ? (
          /*  Si NO está autenticado, muestro el link "/login" */
          <Link
            to="/login"
            className="sidebar-auth-link"
            onClick={() => navigateTo('login')}
          >
            Iniciar sesión / Registrarse
          </Link>
        ) : (
          /* Si SÍ está autenticado, muestro la foto/nombre */
          <div className="sidebar-user-container">
            <Link to="/Profile" onClick={closeMenu} className="sidebar-user-link">
              <div className="profile-avatar-wrapper">
                {profilePicture ? (
                  <img
                    src={`http://localhost:3000/${profilePicture}`}
                    alt="Foto de perfil"
                    className="sidebar-user-icon"
                  />
                ) : (
                  <img
                    src="/assets/images/usuario_sin_foto.jpg"
                    alt="Usuario"
                    className="sidebar-user-icon"
                  />
                )}
              </div>
              <span className="sidebar-user-name">{userName}</span>
            </Link>
          </div>
        )}

        <nav className="sidebar-nav">
          <Link to="/" onClick={() => navigateTo('home')}>Inicio</Link>
          <Link to="/news" onClick={() => navigateTo('news')}>Noticias</Link>
          <Link to="/rules" onClick={() => navigateTo('rules')}>Reglamento</Link>
          <Link to="/tour" onClick={() => navigateTo('tour')}>Tour Virtual</Link>
          <Link to="/pricing" onClick={() => navigateTo('cotization')}>Precios</Link>
        </nav>

        {isLoggedIn && (
          <button
            className="sidebar-logout-button"
            onClick={handleLogout}
          >
            Cerrar sesion
          </button>
        )}
      </aside>
    </>
  );
};

export default Navbar;
