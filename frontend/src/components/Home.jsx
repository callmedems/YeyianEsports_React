// Home.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../css/styles.css';

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/reviews')
      .then(response => response.ok ? response.json() : [])
      .then(data => setReviews(data))
      .catch(err => console.error('Error al cargar reviews:', err));
  }, []);

  const handlePrev = () => setStartIndex(prev => Math.max(prev - 1, 0));
  const handleNext = () => setStartIndex(prev => Math.min(prev + 1, reviews.length - 3));
  const visibleReviews = reviews.slice(startIndex, startIndex + 3);

  const submitReview = () => {
    if (!comment.trim() || rating === 0) {
      alert('Debes escribir un comentario y dar una calificación.');
      return;
    }

    fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentAdded: comment.trim(),
        givenStars: rating,
        clientId: 1
      })
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        alert('¡Gracias por tu reseña!');
        setComment('');
        setRating(0);
        setShowModal(false);
        return fetch('http://localhost:3000/api/reviews');
      })
      .then(res => res.ok ? res.json() : [])
      .then(data => setReviews(data))
      .catch(err => {
        console.error(err);
        alert('No se pudo enviar tu reseña.');
      });
  };

  return (
    <section className="reviews">
      <div className="reviewsContainer">
        <header>
          <h1>Gameplays reales, opiniones reales</h1>
        </header>

        <div className="carousel">
          <i className="bi bi-arrow-left-circle controllers" onClick={handlePrev}></i>
          {visibleReviews.map((r, index) => (
            <div className="card" key={index}>
              <div className="personalInfo">
                <div className="profilePicture">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="personReview">
                  <h3 className="nameOp">{r.name}</h3>
                  <p className="additionDate">{r.timeAgo}</p>
                </div>
              </div>
              <div className="stars">
                {[...Array(r.givenStars)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))}
              </div>
              <div className="reviewGiven">
                <p>{r.commentAdded}</p>
              </div>
            </div>
          ))}
          <i className="bi bi-arrow-right-circle controllers" onClick={handleNext}></i>
        </div>

        <div className="btnAddReview">
          <button type="button" className="btnReview" onClick={() => setShowModal(true)}>
            Califícanos
          </button>
        </div>
      </div>

      {showModal && (
        <div id="modalBlack" className="modalBlack">
          <div id="modalContent" className="modal-content">
            <h2>Comparte tu experiencia</h2>
            <h4>¿Cómo nos calificarías?</h4>
            <div className="starsGrade" id="starG">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={i < rating ? 'bi bi-star-fill' : 'bi bi-star'}
                  onClick={() => setRating(i + 1)}
                  style={{ cursor: 'pointer' }}
                ></i>
              ))}
            </div>
            <textarea
              className="comment"
              placeholder="Escribe tu opinión"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="btnInModal">
              <button type="button" className="btnCancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="button" className="btnAccept" onClick={submitReview}>Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const Home = () => {
  const setDropdownOpen = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [coverOpacity, setCoverOpacity] = useState(1);

   useEffect(() => {
    // Función que actualiza la opacidad en función del scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;         // píxeles que llevamos “bajados” en la ventana
      const fadeStart = 200;                    // scrollY en el que la opacidad empieza a bajar
      const fadeEnd = 850;                    // scrollY en el que la opacidad llega a 0 (ajusta a tu gusto)
      
      let newOpacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
      if (newOpacity < 0) newOpacity = 0;
      if (newOpacity > 1) newOpacity = 1;
      
      setCoverOpacity(newOpacity);
    };

    // Al montar, agregamos el listener de scroll
    window.addEventListener('scroll', handleScroll);

    // Limpiamos el listener al desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        <section className="arenaPresentation" style={{ opacity: coverOpacity }}>
          <div className="titleContainer">
            <h1>ARENA YEYIAN</h1>
            <h2>LEVEL UP YOUR GAMING</h2>
          </div>
          <img src="assets/images/fortnite_characters.png" className="centerImage" alt="Fortnite Characters"/>
        </section>
        <ReviewsSection/>
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
