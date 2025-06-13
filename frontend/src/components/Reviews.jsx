import React, { useState, useRef, useEffect } from 'react';
import '../css/reviews.css';
//import StatusBanner from './StatusBanner';


export default function Reviews() {
  //const [showStatusBanner, setshowStatusBanner] = useState(false);


  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/reviews')
      .then(response => response.ok ? response.json() : [])
      .then(
        data => {
            setReviews(data)
            //Gives functionality to carrousel buttons
            const swiper = new Swiper('.slider-wrapper', {
               
                loop: true,
                grabCursor:true,
                simulateTouch:true,
                spaceBetween: 30,

                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true
                },

                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },

                //responsive carrousel
                breakpoints:{
                    0:{
                        slidesPerView:1
                    },
                    620:{
                        slidesPerView:2
                    },
                    1024:{
                        slidesPerView:3
                    }
                }
            });

        })
      .catch(err => console.error('Error al cargar reviews:', err));
  }, []);

  
  const submitReview = () => {
    if (!comment.trim() || rating === 0) {
      /*{showStatusBanner && (
      <StatusBanner
  type="error"
  title="Error al guardar reseña"
  description="Debes escribir un comentario y dar una calificación"
  buttonText="Intentar de nuevo"
  onClose={() => setShowBanner(false)}
/>)}*/

     alert('Debes escribir un comentario y dar una calificación.');
      return;
    }

    fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentAdded: comment.trim(),
        givenStars: rating,
        clientId: localStorage.getItem('clientId')
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
          <h1>Opiniones reales, experiencias inolvidables</h1>
        </header>

        <div className="carousel swiper">

          <div className="slider-wrapper">
            <div className="swiper-wrapper"> 
                {reviews.map((r, index) => (
                  
                    <div className="card swiper-slide" key={index}>
                        <div className="personalInfo">
                            <div className="profilePicture">
                            {r.profilePicture== null ? (<i className="bi bi-person-circle"></i>) : (<img className="imgProfile" src={"http://localhost:3000/"+r.profilePicture}></img>)}
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
            </div>
            <div className="swiper-pagination"></div>  
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>

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