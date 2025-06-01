import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Games from './components/Games'
import Reviews from './components/Reviews'

function App() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Navbar />

      <main className="mainContainer">
        {/* Arena Presentation */}
        <section className="arenaPresentation">
          <div className="titleContainer">
            <h1>ARENA YEYIAN</h1>
            <h2>LEVEL UP YOUR GAMING</h2>
          </div>
          <div>
            <img src="images/fortnite_characters.png" className="centerImage" alt="Fortnite Characters" />
          </div>
        </section>

        <Games />

        <Reviews onAddReview={() => setShowModal(true)} />
      </main>

      <Footer />

      {/* MODAL, esto nomas es placeholder */}
      {showModal && (
        <div className="modalBlack">
          <div className="modal-content">
            <h2>Comparte tu experiencia</h2>
            <h4>¿Cómo nos calificarías?</h4>
            <div className="starsGrade">{'⭐️⭐️⭐️⭐️⭐️'}</div>
            <textarea className="comment" placeholder="Escribe tu opinión"></textarea>
            <div className="btnInModal">
              <button type="button" className="btnCancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button type="button" className="btnAccept" onClick={() => setShowModal(false)}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App