// App.jsx
import React, { useState, useEffect, useRef } from 'react';
//import 'bootstrap-icons/font/bootstrap-icons.css'; // Para los íconos bi

const App = () => {
  // Estado para el dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropbtnRef = useRef(null);

  // Estado para las reviews
  const [reviews, setReviews] = useState([]);

  // Estado para el modal de calificación
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [commentValue, setCommentValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // === Cargar reviews desde /reviews.json ===
  useEffect(() => {
    const fillReviewCard = async () => {
      try {
        const response = await fetch('/reviews.json');
        const jsonReviews = await response.json();
        setReviews(jsonReviews.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    fillReviewCard();
  }, []);

  // === Toggle dropdown ===
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // === Cerrar dropdown al hacer clic fuera ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropbtnRef.current &&
        !dropbtnRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // === Navegación ===
  const navigateTo = (page) => {
    window.location.href = `${page}.html`;
  };

  // === Abrir modal ===
  const openModal = () => {
    setRating(0);
    setCommentValue('');
    setSubmitted(false);
    setModalOpen(true);
  };

  // === Cerrar modal ===
  const closeModal = () => {
    setModalOpen(false);
    setRating(0);
    setCommentValue('');
    setSubmitted(false);
  };

  // === Click en estrella ===
  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  // === Aceptar review ===
  const handleAddReview = () => {
    // Aquí podrías enviar commentValue y rating a un backend, si quisieras.
    setSubmitted(true);
  };

  return (
    <>
      {/* ===== DROPDOWN ===== */}
      <div className="dropdown">
        <button
          className="dropbtn"
          onClick={toggleDropdown}
          ref={dropbtnRef}
        >
          <img src="assets/images/dropdown_menu.png" alt="Menú" />
        </button>
        <div
          id="menuDropdown"
          className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}
          ref={dropdownRef}
        >
          <a onClick={() => navigateTo('news')}>Noticias</a>
          <a onClick={() => navigateTo('rules')}>Reglamento</a>
          <a onClick={() => navigateTo('tour')}>Tour Virtual</a>
          <a onClick={() => navigateTo('cotizacion')}>Precios</a>
        </div>
      </div>

      {/* ===== SECCIÓN DE REVIEWS ===== */}
      <div className="carousel">
        {reviews.map((review, idx) => (
          <div className="card" id={`card${idx + 1}`} key={idx}>
            <div className="personalInfo">
              <div className="profilePicture">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="personReview">
                <h3 className="nameOp">{review.name}</h3>
                <p className="additionDate">{review.timeAgo}</p>
              </div>
            </div>
            <div className="stars">
              {Array.from({ length: review.stars }).map((_, j) => (
                <i className="bi bi-star-fill" key={j}></i>
              ))}
            </div>
            <div className="reviewGiven">
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="btnAddReview">
        <button
          type="button"
          className="btnReview"
          onClick={openModal}
        >
          Califícanos
        </button>
      </div>

      {/* ===== MODAL DE CALIFICACIÓN ===== */}
      {modalOpen && (
        <div id="modalBlack" className="modalBlack">
          <div className="modal-content" id="modalContent">
            {!submitted ? (
              <>
                <h2>Comparte tu experiencia</h2>
                <h4>¿Cómo nos calificarías?</h4>
                <div className="starsGrade" id="starG">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={i < rating ? 'bi bi-star-fill' : 'bi bi-star'}
                      onClick={() => handleStarClick(i)}
                    ></i>
                  ))}
                </div>
                <textarea
                  className="comment"
                  id="comment"
                  placeholder="Escribe tu opinión"
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                ></textarea>
                <div className="btnInModal">
                  <button
                    className="btnCancel"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btnAccept"
                    onClick={handleAddReview}
                  >
                    Aceptar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="thanksMessage">
                  Gracias por tu opinión. Se ha guardado tu comentario y tu{' '}
                  <br />
                  calificación de {rating} estrellas
                </h2>
                <button
                  className="btnCancel"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
