import React from 'react'
import { motion } from 'framer-motion'
import '../css/MeetUs.css'

const MeetUs = () => {
  return (
    <div className="meetus-container">
      <section className="snap-section section-welcome">
        <video className="bg-video" src="/assets/videos/promo_arena.MP4" autoPlay loop muted playsInline />
        <div className="overlay" />
        <motion.div className="content-wrapper-welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <motion.h1 className="title" initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 1 }}>
            Bienvenido a Arena Yeyian
          </motion.h1>
          <motion.p className="subtitle" initial={{ y: 50 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            El primer espacio gamer de Latinoamérica dentro de un estadio: <strong>Estadio Akron</strong>.
          </motion.p>
        </motion.div>
      </section>

      <section className="snap-section section-features">
        <motion.div className="features-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <motion.div className="feature-card" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <motion.img src="/assets/images/pc_setup.jpg" alt="PCs" className="feature-image" initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} transition={{ duration: 0.6 }} />
            <motion.h3 className="feature-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              PCs de última generación
            </motion.h3>
            <motion.p className="feature-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              Equipadas con hardware de alto rendimiento para gaming competitivo y streaming.
            </motion.p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <motion.img src="/assets/images/console.jpg" alt="Consolas" className="feature-image" initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} transition={{ duration: 0.6 }} />
            <motion.h3 className="feature-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              Consolas y Switch
            </motion.h3>
            <motion.p className="feature-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              PlayStation 5, Xbox Series X y Nintendo Switch disponibles para torneos casuales en el lounge gamer.
            </motion.p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <motion.img src="/assets/images/led_ambience.jpg" alt="LED" className="feature-image" initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} transition={{ duration: 0.6 }} />
            <motion.h3 className="feature-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              Ambiente LED personalizable
            </motion.h3>
            <motion.p className="feature-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              Luces ambientales RGB, sonido envolvente y área con sofás para que vivas la experiencia gamer al máximo.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      <section className="snap-section section-chivas">
        <div className="chivas-inner">
          <motion.div className="chivas-text" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <h2>Somos Chivas Esports</h2>
            <p>Pertenecemos a <strong>Club Deportivo Guadalajara</strong>, y somos el tercer equipo más importante de la liga de Valorant en Latinoamérica. Nuestra misión: unir a la comunidad gamer tapatía y brindar un espacio digno para entrenar, competir y crear contenido.</p>
            <p>En Arena Yeyian no solo encontrarás un lugar para jugar: también ofrecemos eventos exclusivos, lanzamientos de productos y torneos oficiales donde podrás medir tus habilidades.</p>
          </motion.div>
          <motion.div className="chivas-image-wrapper" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <img src="/assets/images/chivas_esports.jpg" alt="Chivas Esports" className="chivas-image" />
          </motion.div>
        </div>
      </section>

      <section className="snap-section section-summary">
        <video className="bg-video" src="/assets/videos/promo_arena.MP4" autoPlay loop muted playsInline />
        <div className="overlay" />
        <div className="summary-container">
          <div className="card card-zonas">
            <h3 className="card-title">Zonas de Juego Exclusivas</h3>
            <ul className="card-list">
              <li>• Gaming PC: Precisión y velocidad para eSports</li>
              <li>• Zona Mobile: Conectividad y comodidad para títulos móviles</li>
              <li>• Zona Consolas: Experiencia optimizada para tus partidas</li>
            </ul>
            <p className="card-note">¡Tu nuevo lugar te espera!</p>
          </div>

          <div className="card card-eventos">
            <h3 className="card-title">Eventos Especiales y Sorpresas</h3>
            <p className="card-text">• Torneos oficiales.<br/>• Meet &amp; Greets con streamers y pro-players.<br/>• Lanzamientos de juegos y activaciones exclusivas.</p>
            <p className="card-note">Más que un espacio de juego, un punto de encuentro para vivir experiencias únicas.</p>
          </div>

          <div className="card card-era">
            <h3 className="card-title">Nueva Era Gamer en Guadalajara</h3>
            <p className="card-text">• Primer espacio gamer dentro de un estadio de fútbol en México.<br/>• Plataforma innovadora para la comunidad de eSports.<br/>• Punto de encuentro oficial para gamers de todo el país.</p>
            <p className="card-note">Innovación desde el inicio</p>
          </div>
        </div>
      </section>

      <section className="snap-section section-cta">
        <video className="bg-video" src="/assets/videos/promo_arena.MP4" autoPlay loop muted playsInline />
        <div className="overlay" />
        <motion.div className="content-wrapper-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <motion.h2 className="cta-title" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}>
            ¿Qué esperas para vivir la experiencia?
          </motion.h2>
          <motion.p className="cta-desc">Reserva ahora y únete a la revolución gamer en el Estadio Akron.</motion.p>
          <motion.button className="cta-button" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} onClick={() => (window.location.href = '/reservation')}>
            Reserva tu espacio
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}

export default MeetUs
