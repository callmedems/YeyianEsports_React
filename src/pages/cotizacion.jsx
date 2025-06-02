import React, { useEffect, useState } from "react";
import "../assets/css/styles.css";
import "../assets/css/cotizacion.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cotizacion = () => {
  
  const reserva = JSON.parse(localStorage.getItem("reserva")) || {};
  const tipoReserva = reserva.tipoReserva || "Individual";

  const precios = {
    Individual: 1500,
    Corporativo: 8000,
    Streamer: 5000,
    Educativo: 4500,
    Escolar: 4000,
  };
  const precio = precios[tipoReserva] || precios.Individual;
  reserva.cotizacion = precio;
  localStorage.setItem("reserva", JSON.stringify(reserva));

  
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

  const [titulo, setTitulo] = useState("");
  const [marketingHTML, setMarketingHTML] = useState("");
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    
    const marketingData =
      marketingMessages[tipoReserva] || marketingMessages.Individual;

    
    const fechaObj = new Date(reserva.fecha);
    const opcionesFecha = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const fechaFormateada = fechaObj.toLocaleDateString("es-MX", opcionesFecha);
    const [horas, minutos] = reserva.hora.split(":");
    const horaFormateada = `${horas}:${minutos}`;
    const periodo = parseInt(horas) >= 12 ? "p.m." : "a.m.";

    setTitulo(marketingData.title);

 
    const mensajeCompleto = `
      ${marketingData.message}<br /><br />
      <span style="font-size: 0.9em; color: #aaaaaa;">
        Este es el precio para la renta de la arena el ${fechaFormateada} a las ${horaFormateada} ${periodo}
      </span>
    `;
    setMarketingHTML(mensajeCompleto);

    const listaFeatures = marketingData.features.map((featureStr, index) => {
      const icons = [
        "fa-gamepad",
        "fa-users",
        "fa-trophy",
        "fa-chalkboard-teacher",
        "fa-video",
      ];
      const [tituloFeat, descripcionFeat] = featureStr.split(" - ");
      return {
        icon: icons[index] || "fa-star",
        titulo: tituloFeat,
        descripcion: descripcionFeat || featureStr,
      };
    });
    setFeatures(listaFeatures);
  }, [reserva.fecha, reserva.hora, tipoReserva]);

  const irAPago = () => {
    window.location.href = "/pago";
  };

  return (
    <>
      {}
      <Navbar />

      {}
      <div style={{ marginTop: "80px" }}>
        <div className="cotizacion-container">
          <div className="cotizacion-info">
            {}
            <h1>{titulo}</h1>

            {}
            <div className="price-display">
              <span style={{ fontSize: "0.8em", display: "block", marginBottom: "5px" }}>
                Cotización para reserva {tipoReserva.toLowerCase()}
              </span>
              ${precio.toLocaleString("es-MX")} MXN
            </div>

            {}
            <div
              className="marketing-highlight"
              dangerouslySetInnerHTML={{ __html: marketingHTML }}
            ></div>

            {}
            <div className="arena-showcase">
              <img
                src="src/assets/images/arena-1.jpg"
                alt="Arena Yeyian"
                className="arena-image"
              />
              <img
                src="src/assets/images/arena-2.jpg"
                alt="Equipamiento gaming"
                className="arena-image"
              />
              <img
                src="src/assets/images/arena-3.jpg"
                alt="Torneo en arena"
                className="arena-image"
              />
            </div>

            <h2>Lo que incluye tu experiencia:</h2>

            {}
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

            {}
            <button id="pago-button" onClick={irAPago}>
              Continuar al pago
            </button>

            <p className="reviews-cta">
              ¿Quieres saber más?{" "}
              <a href="/reviews">Lee las experiencias de otros clientes</a>
            </p>
          </div>
        </div>
      </div>

      {}
      <div style={{ marginBottom: "80px" }} />

      {}
      <Footer />
    </>
  );
};

export default Cotizacion;
