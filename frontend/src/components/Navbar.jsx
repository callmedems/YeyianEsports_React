// ----- Footer.jsx ----- //
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // <-- importar useLocation
import '../index.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Cada vez que cambie la ruta, leemos localStorage para saber si el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem('reserva');
    setIsLoggedIn(!!token);

    // Si existe token, leemos también el userName
    const storedName = localStorage.getItem('reservaUserName') || '';
    setUserName(storedName);
  }, [location]);

  // 2) Permitir cerrar con Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // 3) Función general para navegar y cerrar el menú
  const navigateTo = (path) => {
    closeMenu();
    navigate(path.startsWith('/') ? path : `/${path}`);
  };

  // 4) Al hacer logout, borramos la clave "reserva" y redirigimos a "/"
  const handleLogout = () => {
    localStorage.removeItem('reserva');
    localStorage.removeItem('reservaUserId');
    localStorage.removeItem('reservaUserName');
    setIsLoggedIn(false);
    setUserName('');
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
              <img
                src="/assets/images/Arena Yeyian Logo.png"
                alt="Logo Arena Yeyian"
              />
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
              <span className="reservationShortText">¡Reserva Ya!</span>
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

        {/* —=== Sección superior del menú lateral ===— */}
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
          /* Si SÍ está autenticado, muestro el icono de usuario */
          <div className="sidebar-user-container">
            {/* Al hacer clic en foto o nombre, navegamos a /profile */}
            <Link to="/profile" onClick={closeMenu} className="sidebar-user-link">
              <img
                src="/assets/images/usuario_sin_foto.jpg"
                alt="Usuario"
                className="sidebar-user-icon"
              />
              <span className="sidebar-user-name">{userName}</span>
            </Link>
          </div>
        )}

        {/* —=== Lista de secciones internas ===— */}
        <nav className="sidebar-nav">
          <Link to="/news" onClick={() => navigateTo('news')}>
            Noticias
          </Link>
          <Link to="/rules" onClick={() => navigateTo('rules')}>
            Reglamento
          </Link>
          <Link to="/tour" onClick={() => navigateTo('tour')}>
            Tour Virtual
          </Link>
          <Link to="/cotization" onClick={() => navigateTo('cotization')}>
            Precios
          </Link>
        </nav>

        {/* —=== Botón “Cerrar sesión” abajo del todo ===— */}
        {isLoggedIn && (
          <button
            className="sidebar-logout-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        )}
      </aside>
    </>
  );
};

export default Navbar;
