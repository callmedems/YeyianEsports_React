import './Navbar.css'
import {Link} from 'react-router-dom'; //añadimos link de routerdom para navegar al registro sin que recargue


function Navbar() {
  return (
    <header className="nav">
      <nav className="navContainer">
        <section className="navbar_left">
          <div className="dropdown">
            <button className="dropbtn">
              <img src="/images/dropdown_menu.png" alt="Menú" />
            </button>
            <div className="dropdown-content">
              <a href="#">Noticias</a>
              <a href="#">Reglamento</a>
              <a href="#">Tour Virtual</a>
              <a href="#">Precios</a>
            </div>
          </div>
          <a href="#" className="logo">
            <img src="/images/Arena Yeyian Logo.png" alt="Logo Arena Yeyian" />
          </a>
        </section>
        <section className="navbar_center">
          <img src="/images/Chivas Logo.png" alt="Logo de Chivas" />
          <div className="separador"></div>
          <img src="/images/Yeyian Logo.png" alt="Logo Arena Yeyian" />
        </section>
        <section className="navbar_right">
            <div className="auth-buttons">
              <Link to="/login" className="nav-button login-button">Iniciar sesión / Registrarse</Link>
              </div>

          <a href="#" className="reservation-link">
            <span className="reservationText">¡RESERVA YA TU HORARIO!</span>
            <span className="reservationShortText">¡Reserva Ya!</span>
          </a>
        </section>
      </nav>
    </header>
  )
}

export default Navbar