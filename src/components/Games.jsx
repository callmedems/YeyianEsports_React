import React, { useState } from 'react';
import './Games.css';

const games = [
  {
    id: 1,
    img: 'images/godofwar.jpeg',
    title: 'God of War',
    desc: 'Eres un dios, ¿ahora qué sigue?',
  },
  {
    id: 2,
    img: 'images/thelastofus.jpeg',
    title: 'The Last of Us',
    desc: 'Zombies + Venganza = Depresión.',
  },
  {
    id: 3,
    img: 'images/cod.jpeg',
    title: 'Call of Duty',
    desc: 'Un clásico para disparar.',
  },
];

function GamesSection() {
  const [current, setCurrent] = useState(0);

  const prevGame = () => {
    setCurrent((prev) => (prev === 0 ? games.length - 1 : prev - 1));
  };

  const nextGame = () => {
    setCurrent((prev) => (prev === games.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="gamesContainer">
      <header>
        <h1>Explora nuestros videojuegos</h1>
      </header>
      <div className="carousel">
        <i
          className="bi bi-arrow-left-circle controllers"
          onClick={prevGame}
          style={{ cursor: 'pointer' }}
        ></i>
        <div className="card" id={`game${games[current].id}`}>
          <img src={games[current].img} alt={games[current].title} />
          <div className="gameInfo">
            <h3>{games[current].title}</h3>
            <p>{games[current].desc}</p>
          </div>
        </div>
        <i
          className="bi bi-arrow-right-circle controllers"
          onClick={nextGame}
          style={{ cursor: 'pointer' }}
        ></i>
      </div>
    </section>
  );
}

export default GamesSection;