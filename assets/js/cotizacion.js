// Obtener datos de la reserva desde local storage
const reserva = JSON.parse(localStorage.getItem("reserva")) || {};
const tipoReserva = reserva.tipoReserva || "Individual";

// Precios simulados según tipo de reserva 
// PRECIOS SIMULADOS, PREGUNTAR PARA LA COTIZACIÓN
const precios = {
  Individual: 1500,
  Corporativo: 8000,
  Streamer: 5000,
  Educativo: 4500,
  Escolar: 4000,
};

// Asignar precio basado en el tipo de reserva
const precio = precios[tipoReserva] || 1500;
reserva.cotizacion = precio;

// Actualizar local storage con la cotización
localStorage.setItem("reserva", JSON.stringify(reserva));

// Mensajes de marketing acorde al tipo de reserva
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

// Configurar contenido dinámico
const configurarCotizacion = () => {
  const marketingData =
    marketingMessages[tipoReserva] || marketingMessages["Individual"];

  // Formatear fecha y hora
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

  // Actualizar mensajes con el nuevo formato
  document.querySelector("h1").textContent = marketingData.title;
  document.getElementById("marketing-message").innerHTML = `
        ${marketingData.message}<br><br>
        <span style="font-size: 0.9em; color: #aaaaaa;">
            Este es el precio para la renta de la arena el ${fechaFormateada} a las ${horaFormateada} ${periodo}
        </span>
    `;

  document.getElementById("cotizacion-precio").innerHTML = `
        <span style="font-size: 0.8em; display: block; margin-bottom: 5px;">
            Cotización para reserva ${tipoReserva.toLowerCase()}
        </span>
        $${precio.toLocaleString("es-MX")} MXN
    `;

  // Actualizar características específicas
  const featuresContainer = document.querySelector(".features-grid");
  if (featuresContainer) {
    featuresContainer.innerHTML = "";

    marketingData.features.forEach((feature, index) => {
      const icons = [
        "fa-gamepad",
        "fa-users",
        "fa-trophy",
        "fa-chalkboard-teacher",
        "fa-video",
      ];
      const [titulo, descripcion] = feature.split(" - ");

      featuresContainer.innerHTML += `
                <div class="feature-card">
                    <div class="feature-icon"><i class="fas ${
                      icons[index]
                    }"></i></div>
                    <h3>${titulo}</h3>
                    <p>${descripcion || feature}</p>
                </div>
            `;
    });
  }
};

// Configurar botón de pago
document.getElementById("pago-button").addEventListener("click", function () {
  window.location.href = "pago.html";
});

// Inicializar
document.addEventListener("DOMContentLoaded", configurarCotizacion);
