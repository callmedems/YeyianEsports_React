import './Reviews.css'

function ReviewsSection({ onAddReview }) {
  return (
    <section className="reviews">
      <div className="reviewsContainer">
        <header>
          <h1>Gameplays reales, opiniones reales</h1>
        </header>
        <div className="carousel">
          <i className="bi bi-arrow-left-circle controllers"></i>
          {[1, 2, 3].map((n) => (
            <div className="card" key={n}>
              <div className="personalInfo">
                <div className="profilePicture"><i className="bi bi-person-circle"></i></div>
                <div className="personReview">
                  <h3 className="nameOp">Jugador {n}</h3>
                  <p className="additionDate">2025-06-01</p>
                </div>
              </div>
              <div className="stars">{'⭐'.repeat(n + 2)}</div>
              <div className="reviewGiven">
                <p>¡Increíble experiencia en la Arena Yeyian!</p>
              </div>
            </div>
          ))}
          <i className="bi bi-arrow-right-circle controllers"></i>
        </div>
        <div className="btnAddReview">
          <button type="button" className="btnReview" onClick={onAddReview}>
            Califícanos
          </button>
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection