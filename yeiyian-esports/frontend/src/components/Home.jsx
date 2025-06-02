// Home.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../css/styles.css';
import Reviews from './Reviews';

const Home = () => {
  /*** === DROPDOWN === ***/
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

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

  const navigateTo = page => {
    window.location.href = `${page}.html`;
  };



  return (
    <>
      
      {/* === MAIN === */}
      <main className="mainContainer">
        {/* Sección de presentación */}
        <section className="arenaPresentation">
          <div className="titleContainer">
            <h1>ARENA YEYIAN</h1>
            <h2>LEVEL UP YOUR GAMING</h2>
          </div>
          <div>
            <img
              src="assets/images/fortnite_characters.png"
              className="centerImage"
              alt="Fortnite Characters"
            />
          </div>
        </section>
        <Reviews/>
        {/* SECCIÓN DE JUEGOS */}
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

       
      </main>
    </>
  );
};

export default Home;
