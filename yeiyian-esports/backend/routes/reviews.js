// backend/routes/reviews.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // GET /api/reviews
  router.get('/', async (req, res) => {
    try {
      const reviews = await knex('review')
        .join('client', 'review.clientId', '=', 'client.clientId')
        .select('client.userName', 'review.commentAdded', 'review.givenStars', 'review.additionDate');

      const formatted = reviews.map(r => ({
        name: r.userName,
        commentAdded: r.commentAdded,
        givenStars: r.givenStars,
        timeAgo: new Date(r.additionDate).toLocaleDateString()
      }));

      res.json(formatted); //Bien
    } catch (err) {
      console.error(' Error GET /reviews:', err);
      res.status(500).json({ error: 'No se pudieron obtener reviews' });
    }
  });

  // POST /api/reviews
  router.post('/', async (req, res) => {
    try {
      const { commentAdded, givenStars, clientId } = req.body;

      // Validación básica
      if (!commentAdded || !givenStars || !clientId) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      await knex('review').insert({
        commentAdded,
        givenStars,
        clientId,
        additionDate: new Date() // usa el mismo nombre que la tabla
      });

      res.status(201).json({ message: 'Reseña guardada con éxito' });
    } catch (err) {
      console.error('Error POST /reviews:', err);
      res.status(500).json({ error: 'No se pudo guardar la reseña' });
    }
  });

  return router;
};




/*
function fillReviewCard() {
  fetch('/reviews.json')
    .then(response => response.json())
    .then(jsonReviews => {
      for (let i = 0; i < 3; i++) {
        const card = document.getElementById(`card${i + 1}`);

        const name = card.querySelector('.nameOp');
        const timeAgo = card.querySelector('.additionDate');
        const comment = card.querySelector('.reviewGiven'); 
        const starsContainer = card.querySelector('.stars');

        const review = jsonReviews[i];

        name.innerHTML = review.name;
        timeAgo.innerHTML = review.timeAgo;
        comment.innerHTML = review.comment;

        
        starsContainer.innerHTML = '';

        for (let j = 0; j < review.stars; j++) {
          const star = document.createElement('i');
          star.className = 'bi bi-star-fill';
          starsContainer.appendChild(star);
        }
      }
    });
}


let rating=0;
function modalReview() {
document.getElementById("modalBlack").classList.remove("hideModalBlack");
const modal = document.getElementById('modalContent');
modal.innerHTML = originalModalContent;

document.querySelector('.btnCancel').addEventListener('click', closeModal);
document.querySelector('.btnAccept').addEventListener('click', addReview);

const starsGrade = document.getElementById('starG');
rating=0;
for (let i = 0; i < 5; i++) {
  const star = document.createElement('i');
  star.className = 'bi bi-star';
  
  star.addEventListener('click', ()=> {
    const allStars = starsGrade.querySelectorAll('i');
    allStars.forEach((st, index) => {
      st.className = index <= i ? 'bi bi-star-fill' : 'bi bi-star';
    });

    rating = i+1;
    
  });
  starsGrade.appendChild(star);
}
}
function addReview() {
const comment = document.getElementById('comment');
const commentValue = comment ? comment.value : '';
const modal = document.getElementById('modalContent');

modal.innerHTML = '';
const message = document.createElement('h2');
message.className='thanksMessage';
message.innerHTML=`Gracias por tu opinión Carlos López. Se ha guardado  tu comentario y tu <br>calificación de ${rating} estrellas`;

const closeBtn =  document.createElement('button');
closeBtn.className="btnCancel";
closeBtn.textContent = 'Cerrar';
closeBtn.addEventListener('click',()=>{document.getElementById("modalBlack").classList.add("hideModalBlack")})


modal.appendChild(message)
modal.appendChild(closeBtn)


}

function closeModal() {
document.getElementById("modalBlack").classList.add("hideModalBlack");
//se deben borrar todos los elementos aagregados al modal para que cuando se vuelva a abrir se resetie todo

// Limpia estrellas
const starsGrade = document.getElementById('starG');
starsGrade.innerHTML = '';

// Limpia el campo de texto
const commentInput = document.querySelector('.comment');
if (commentInput) commentInput.value = '';
}


fillReviewCard();
const originalModalContent = document.getElementById('modalContent').innerHTML;*/