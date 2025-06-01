import './js/reviews.js';
import './css/reviews.css';

export default function Reviews() {
  return (
    <section className="reviews">
          <div className="reviewsContainer">
            <header>
              <h1>Gameplays reales, opiniones reales</h1>
            </header>
            <div className="carousel">
              <i className="bi bi-arrow-left-circle controllers"></i>
              {[1, 2, 3].map((id) => (
                <div className="card" key={id} id={`card${id}`}>
                  <div className="personalInfo">
                    <div className="profilePicture">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="personReview">
                      <h3 className="nameOp"></h3>
                      <p className="additionDate"></p>
                    </div>
                  </div>
                  <div className="stars" id={`star${['ONE', 'TWO', 'THREE'][id - 1]}`}></div>
                  <div className="reviewGiven">
                    <p id={`review${id}`}></p>
                  </div>
                </div>
              ))}
              <i className="bi bi-arrow-right-circle controllers"></i>
            </div>
            <div className="btnAddReview">
              <button type="button" className="btnReview" onClick = {modalReview}>
                Califícanos
              </button>
            </div>
          </div>
        </section>


  );

}