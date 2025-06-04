// src/pages/Cotizacion.jsx

import React, { useEffect, useState } from "react";
import "../css/styles.css";
import "../css/cotizacion.css";

const Cotizacion = () => {
  // Leemos del localStorage la reserva que guardamos justo después de crearla
  const reserva = JSON.parse(localStorage.getItem("ultimaReserva")) || {};

  // Extraemos cada campo (si no existe, ponemos valores por defecto)
  const tipoReservaTexto = reserva.tipoReservaTexto || "Individual";
  const userName = reserva.userName || "N/A";
  const reservationDate = reserva.reservationDate || "";     // "2025-06-07"
  const reservationTime = reserva.reservationTime || "";     // "16:36:00"
  const totalPrice = reserva.totalPrice || 0;

  // Mensajes de marketing para cada tipo de reserva
  const marketingMessages = {
    Escolar: {
      title: "¡Una experiencia educativa inolvidable!",
      message:
        "Haremos que tus alumnos aprendan mientras se divierten en un entorno gaming profesional. Ideal para clases de tecnología, robótica o eventos escolares.",
      features: [
        "Área segura y supervisada - Espacio controlado para grupos escolares",
        "Contenido educativo adaptable - Programas alineados a planes de estudio",
        "Posibilidad de torneos internos - Competencias sanas entre alumnos",
      ],
    },
    Corporativo: {
      title: "¡Impulsa el trabajo en equipo de forma innovadora!",
      message:
        "Perfecto para team buildings, eventos corporativos o lanzamientos de producto. Mejora la comunicación y colaboración de tu equipo.",
      features: [
        "Espacio para presentaciones - Área equipada para reuniones",
        "Actividades personalizadas - Diseñadas para tus objetivos",
        "Análisis de desempeño en equipo - Reportes post-evento",
      ],
    },
    Streamer: {
      title: "¡Eleva tu contenido al siguiente nivel!",
      message:
        "Graba o transmite desde nuestras instalaciones profesionales con el mejor equipamiento y conexión de fibra óptica.",
      features: [
        "Setup profesional para streaming - Equipo de alta gama listo para transmitir",
        "Backdrops personalizables - Escenarios temáticos para tu marca",
        "Asistencia técnica especializada - Soporte durante tus transmisiones",
      ],
    },
    Educativo: {
      title: "Aprendizaje a través del gaming",
      message:
        "Programas educativos diseñados para enseñar habilidades STEM, trabajo en equipo y pensamiento estratégico.",
      features: [
        "Contenido curricular adaptable - Material para diferentes niveles",
        "Sesiones guiadas por expertos - Instructores certificados",
        "Reportes de progreso - Evaluación del aprendizaje",
      ],
    },
    Individual: {
      title: "¡Vive la experiencia gaming definitiva!",
      message:
        "Disfruta de horas de diversión con el mejor equipamiento en un ambiente diseñado para gamers.",
      features: [
        "Acceso a todos nuestros juegos - Biblioteca con +50 títulos",
        "Sesiones personalizadas - Configuración a tu medida",
        "Participación en torneos - Competencias semanales",
      ],
    },
  };

  // Estados locales para el título, mensaje y lista de características
  const [titulo, setTitulo] = useState("");
  const [marketingHTML, setMarketingHTML] = useState("");
  const [features, setFeatures] = useState([]);

  // En este useEffect calculamos todo lo relacionado con la fecha/hora y el marketing
  useEffect(() => {
    // Obtenemos el objeto de marketing según el tipo de reserva
    const marketingData =
      marketingMessages[tipoReservaTexto] || marketingMessages["Individual"];

    // 1) Formatear la fecha de reserva
    let fechaFormateada = "";
    if (reservationDate) {
      const fechaObj = new Date(reservationDate);
      const opcionesFecha = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      fechaFormateada = fechaObj.toLocaleDateString("es-MX", opcionesFecha);
    }

    // 2) Formatear la hora de reserva
    let horaFormateada = "";
    if (reservationTime) {
      const [hh, mm] = reservationTime.split(":"); // "16:36:00" → ["16","36","00"]
      let horaNum = Number(hh);
      const periodo = horaNum >= 12 ? "p.m." : "a.m.";
      if (horaNum > 12) horaNum -= 12;
      if (horaNum === 0) horaNum = 12;
      horaFormateada = `${horaNum}:${mm} ${periodo}`; // ex. "4:36 p.m."
    }

    // 3) Ajustar el título y mensaje de marketing
    setTitulo(marketingData.title);

    // Aquí construimos el mensaje HTML (usamos dangerouslySetInnerHTML para los <br/>)
    const mensajeCompleto = `
      ${marketingData.message}<br /><br />
      <span style="font-size: 0.9em; color: #aaaaaa;">
        Este es el precio para la renta de la arena el ${fechaFormateada} a las ${horaFormateada}
      </span>
    `;
    setMarketingHTML(mensajeCompleto);

    // 4) Convertir cada feature en un objeto { icon, titulo, descripcion }
    const listaFeatures = marketingData.features.map((featureStr, index) => {
      const icons = [
        "fa-gamepad",
        "fa-users",
        "fa-trophy",
        "fa-chalkboard-teacher",
        "fa-video",
      ];
      // separa el texto en “Título – Descripción”, si existe “–”
      const [tituloFeat, descripcionFeat] = featureStr.split(" - ");
      return {
        icon: icons[index] || "fa-star",
        titulo: tituloFeat || featureStr,
        descripcion: descripcionFeat || featureStr,
      };
    });
    setFeatures(listaFeatures);

    // Dependencias para que se vuelva a ejecutar si cambian estos valores
  }, [reservationDate, reservationTime, tipoReservaTexto]);

  // Al hacer click en “Continuar al pago”, redirigimos a la página de Pago
  const irAPago = () => {
    const ultima = JSON.parse(localStorage.getItem("ultimaReserva")) || {};
    // Supongamos que ya tienes nombre y correo en algún estado o contexto:
    const nombreUsuario = reserva.userName || "";
    const correoUsuario = reserva.correo || "";
    const objetoPago = {
      userName: nombreUsuario,
      correo: correoUsuario,
      tipoReservaTexto: ultima.tipoReservaTexto,
      reservationDate: ultima.reservationDate,
      reservationTime: ultima.reservationTime,
      totalPrice: ultima.totalPrice
    };
    localStorage.setItem("reserva", JSON.stringify(objetoPago));
    window.location.href = "/pago";
  };

  return (
    <div className="cotizacion-page">
      <div style={{ marginTop: "80px" }}>
        <div className="cotizacion-container">
          <div className="cotizacion-info">
            {/* Título principal */}
            <h1>{titulo}</h1>

            {/* Resumen con el precio y tipo de reserva */}
            <div className="price-display">
              <span
                style={{
                  fontSize: "0.8em",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Cotización para reserva:{" "}
                <strong>{tipoReservaTexto.toLowerCase()}</strong>
              </span>
              $
              {totalPrice.toLocaleString("es-MX")} MXN
            </div>

            {/* Mensaje de marketing con HTML */}
            <div
              className="marketing-highlight"
              dangerouslySetInnerHTML={{ __html: marketingHTML }}
            ></div>

            {/* Muestra algunas imágenes de ejemplo */}
            <div className="arena-showcase">
              <img
                src="/assets/images/arena-1.jpg"
                alt="Arena Yeyian"
                className="arena-image"
              />
              <img
                src="/assets/images/arena-2.jpg"
                alt="Equipamiento gaming"
                className="arena-image"
              />
              <img
                src="/assets/images/arena-3.jpg"
                alt="Torneo en arena"
                className="arena-image"
              />
            </div>

            {/* Lista de “Lo que incluye tu experiencia” */}
            <h2>Lo que incluye tu experiencia:</h2>
            <div className="features-grid">
              {features.map((f, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">
                    <i className={`fas ${f.icon}`}></i>
                  </div>
                  <h3>{f.titulo}</h3>
                  <p>{f.descripcion}</p>
                </div>
              ))}
            </div>

            {/* Botón para continuar al pago */}
            <button id="pago-button" onClick={irAPago}>
              Continuar al pago
            </button>

            {/* Enlace a reseñas, si quieres */}
            <p className="reviews-cta">
              ¿Quieres saber más?{" "}
              <a href="/reviews">Lee las experiencias de otros clientes</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cotizacion;
