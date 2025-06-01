import './App.css';
import './css/styles.css';
import Reviews from './Reviews';

export default function App() {
  return (
    <>
      <header className="nav">
        <nav className="navContainer">
          <section className="navbar_left">
            <div className="dropdown">
              <button className="dropbtn">
                <img src="assets/images/dropdown_menu.png" alt="Menú" />
              </button>
              <div id="menuDropdown" className="dropdown-content">
                <a href="#news">Noticias</a>
                <a href="#rules">Reglamento</a>
                <a href="#tour">Tour Virtual</a>
                <a href="#cotizacion">Precios</a>
              </div>
            </div>
            <a href="#" className="logo">
              <img src="assets/images/Arena Yeyian Logo.png" alt="Logo Arena Yeyian" />
            </a>
          </section>
          <section className="navbar_center">
            <img src="assets/images/Chivas Logo.png" alt="Logo de Chivas" />
            <div className="separador"></div>
            <img src="assets/images/Yeyian Logo.png" alt="Logo Arena Yeyian" />
          </section>
          <section className="navbar_right">
            <a href="#reservation">
              <span className="reservationText">¡Reserva Ya Tu Horario!</span>
              <span className="reservationShortText">¡Reserva Ya!</span>
            </a>
          </section>
        </nav>
      </header>

      <main className="mainContainer">
        <section className="arenaPresentation">
          <div className="titleContainer">
            <h1>ARENA YEYIAN</h1>
            <h2>LEVEL UP YOUR GAMING</h2>
          </div>
          <div>
            <img src="assets/images/fortnite_characters.png" className="centerImage" alt="Fortnite" />
          </div>
        </section>

        <section className="gamesContainer">
          <header>
            <h1>Explora nuestros videojuegos</h1>
          </header>
          <div className="carousel">
            <i className="bi bi-arrow-left-circle controllers"></i>
            <div className="card" id="game1">
              <img src="assets/images/godofwar.jpeg" alt="Juego 1" />
              <div className="gameInfo">
                <h3>God of War</h3>
                <p>Eres un dios, ¿ahora qué sigue?</p>
              </div>
            </div>
            <div className="card" id="game2">
              <img src="assets/images/thelastofus.jpeg" alt="Juego 2" />
              <div className="gameInfo">
                <h3>The Last of Us</h3>
                <p>Zombies + venganza = depresión.</p>
              </div>
            </div>
            <div className="card" id="game3">
              <img src="assets/images/cod.jpeg" alt="Juego 3" />
              <div className="gameInfo">
                <h3>Call of Duty</h3>
                <p>Un clásico para disparar.</p>
              </div>
            </div>
            <i className="bi bi-arrow-right-circle controllers"></i>
          </div>
        </section>
        <section className="reviewsContainer">
          <Reviews/>
        </section>
      </main>
        
      <footer className="footer">
        <nav className="footerContainer">
          <section className="footer_left">
            <p>Horario de Atención: 9am-9pm.</p>
          </section>
          <section className="footer_center">
            {['facebook', 'instagram', 'x', 'twitch', 'youtube_logoDOS'].map((name) => (
              <a href="#" key={name}>
                <img src={`assets/images/${name}_logo.png`} alt={name} />
              </a>
            ))}
          </section>
          <section className="footer_right">
            <p>+52 XXX XXX XXXX</p>
          </section>
        </nav>
      </footer>

      <div id="modalBlack" className="modalBlack hideModalBlack">
        <div className="modal-content" id="modalContent">
          <h2>Comparte tu experiencia</h2>
          <h4>¿Cómo nos calificarías?</h4>
          <div className="starsGrade" id="starG"></div>
          <textarea className="comment" id="comment" placeholder="Escribe tu opinión"></textarea>
          <div className="btnInModal">
            <button type="button" className="btnCancel">Cancelar</button>
            <button type="button" className="btnAccept">Aceptar</button>
          </div>
        </div>
      </div>
    </>
  );
}