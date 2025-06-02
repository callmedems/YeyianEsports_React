import { useEffect, useState } from 'react';
import '../css/reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Cargar reseñas
  useEffect(() => {
    fetch('http://localhost:3000/api/reviews')
      .then(response => {
        if(response.ok){
          return  response.json()
        }
        throw new Error('Request Failed!');
      }, networkError=> console.log(networkError.message))
      .then(data => setReviews(data))
      .catch(err => console.error('Error al cargar reviews:', err));
  }, []);

  // Navegación del carrusel
  const handlePrev = () => {
    setStartIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(prev + 1, reviews.length - 3));
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + 3);

  // Manejar envío de nueva reseña
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
      .then(res => {
        if (!res.ok) throw new Error('Error al enviar reseña');
        return res.json();
      })
      .then(() => {
        alert('¡Gracias por tu reseña!');
        setComment('');
        setRating(0);
        setShowModal(false);
        // Recargar reseñas
        fetch('http://localhost:3000/api/reviews')
          .then(res => res.ok ? res.json() : [])
          .then(data => setReviews(data));
      })
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

      {/* Modal */}
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
