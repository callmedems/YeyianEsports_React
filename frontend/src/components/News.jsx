import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../css/styles.css";

const News = ({ navigateTo }) => (

  <div className="newsBody">
    {/* CONTENIDO PRINCIPAL */}
    <main className="newsMainContainer">
      <h1 className="mainTitle">Noticias Recientes</h1>

      <section className="newsGrid">
        <article className="newsCard">
          <h2 className="newsTitle">Ganador Gamer de la Arena 2025</h2>
          <p className="newsDescription">
            Este año inscríbete en uno de nuestros días disponibles y supera el record de más kills en CoD para ganar una firma oficial del Chicharito.
          </p>
          <button className="newsButton">Leer más</button>
        </article>

        <article className="newsCard">
          <h2 className="newsTitle">Nuevas consola PS5 en la arena</h2>
          <p className="newsDescription">
            ¡Prepárate porque tenemos nuevo equipo de parte de PlayStation para que te diviertas como nunca!
          </p>
          <button className="newsButton">Leer más</button>
        </article>

        {/* Puedes seguir agregando más artículos similares */}
      </section>
    </main>

  </div>
);

export default News;
