// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../index.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const token = localStorage.getItem('reserva')
    setIsLoggedIn(!!token)
    setUserName(localStorage.getItem('reservaUserName') || '')
    setProfilePicture(localStorage.getItem('navbarProfilePicture') || null)
  }, [location])

  useEffect(() => {
    const storedName = localStorage.getItem('reservaUserName') || 'Usuario'
    const storedPic = localStorage.getItem('navbarProfilePicture') || null
    const token = localStorage.getItem('reserva')
    setIsLoggedIn(!!token)
    setUserName(storedName)
    setProfilePicture(storedPic)

    const onChange = () => {
      setUserName(localStorage.getItem('reservaUserName') || 'Usuario')
      setProfilePicture(localStorage.getItem('navbarProfilePicture') || null)
    }
    window.addEventListener('userProfileChanged', onChange)
    return () => window.removeEventListener('userProfileChanged', onChange)
  }, [])

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const handleLogout = () => {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      fetch('http://localhost:3000/api/track/session-end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        keepalive: true
      })
    }
    localStorage.removeItem('reserva')
    localStorage.removeItem('clientId')
    localStorage.removeItem('reservaUserName')
    localStorage.removeItem('navbarProfilePicture')
    localStorage.removeItem('sessionId')
    setIsLoggedIn(false)
    setUserName('')
    setProfilePicture(null)
    closeMenu()
    navigate('/')
  }

  const navigateTo = path => {
    closeMenu()
    navigate(path.startsWith('/') ? path : `/${path}`)
  }

  return (
    <>
      <header className="nav">
        <nav className="navContainer">
          <section className="navbar_left">
            <button onClick={toggleMenu} className="menu-button">
              <img src="/assets/images/dropdown_menu.png" alt="Ícono de menú" />
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
      <div
        className={`overlay ${menuOpen ? 'show' : ''}`}
        onClick={closeMenu}
      ></div>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={closeMenu}>
          &times;
        </button>
        {!isLoggedIn ? (
          <Link
            to="/login"
            className="sidebar-auth-link"
            onClick={() => navigateTo('login')}
          >
            Iniciar sesión / Registrarse
          </Link>
        ) : (
          <div className="sidebar-user-container">
            <Link
              to="/Profile"
              onClick={closeMenu}
              className="sidebar-user-link"
            >
              <div className="profile-avatar-wrapper">
                <img
                  src={
                    profilePicture
                      ? `http://localhost:3000/${profilePicture}`
                      : '/assets/images/usuario_sin_foto.jpg'
                  }
                  alt="Foto de perfil"
                  className="sidebar-user-icon"
                />
              </div>
              <span className="sidebar-user-name">{userName}</span>
            </Link>
          </div>
        )}
        <nav className="sidebar-nav">
          <Link to="/" onClick={() => navigateTo('home')}>
            Inicio
          </Link>
          <Link to="/news" onClick={() => navigateTo('news')}>
            Noticias
          </Link>
          <Link to="/rules" onClick={() => navigateTo('rules')}>
            Reglamento
          </Link>
          <Link to="/MeetUs" onClick={() => navigateTo('MeetUs')}>
            Conócenos
          </Link>
          <Link to="/cotization" onClick={() => navigateTo('cotization')}>
            Precios
          </Link>
        </nav>
        {isLoggedIn && (
          <button className="sidebar-logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </aside>
    </>
  )
}

export default Navbar
