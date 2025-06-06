// cotizacion.js

// 1) Obtener datos de la reserva guardados en localStorage
const reserva = JSON.parse(localStorage.getItem("reserva")) || {};
const tipoReserva = reserva.tipoReserva || "Individual";

// 2) Precios simulados según tipo de reserva
const precios = {
  Individual: 1500,
  Corporativo: 8000,
  Streamer: 5000,
  Educativo: 4500,
  Escolar: 4000,
};

// 3) Calcular precio y actualizar localStorage
const precio = precios[tipoReserva] || 1500;
reserva.cotizacion = precio;
localStorage.setItem("reserva", JSON.stringify(reserva));

// 4) Datos de marketing (sin cambios)
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

// 5) Función para configurar la página de cotización
const configurarCotizacion = () => {
  const marketingData =
    marketingMessages[tipoReserva] || marketingMessages["Individual"];

  // Formatear fecha y hora para mostrar
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

  // Actualizar título y mensaje de marketing
  document.querySelector("h1").textContent = marketingData.title;
  document.getElementById("marketing-message").innerHTML = `
    ${marketingData.message}<br><br>
    <span style="font-size: 0.9em; color: #aaaaaa;">
      Cotización para la renta el ${fechaFormateada} a las ${horaFormateada} ${periodo}
    </span>
  `;

  // Mostrar el precio calculado
  document.getElementById("cotizacion-precio").innerHTML = `
    <span style="font-size: 0.8em; display: block; margin-bottom: 5px;">
      Cotización para reserva ${tipoReserva.toLowerCase()}
    </span>
    $${precio.toLocaleString("es-MX")} MXN
  `;

  // Mostrar las "features" específicas
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
          <div class="feature-icon"><i class="fas ${icons[index]}"></i></div>
          <h3>${titulo}</h3>
          <p>${descripcion || feature}</p>
        </div>
      `;
    });
  }
};

// 6) Al hacer click en “Pagar”, primero creamos la reserva en el backend
document.getElementById("pago-button").addEventListener("click", async function () {
  // 6.1) Leer clientId desde localStorage (asumimos que el usuario ya está autenticado)
  const clientId = localStorage.getItem("clientId");
  if (!clientId) {
    alert("Debes iniciar sesión para reservar.");
    return;
  }

  // 6.2) Armar el body para el servidor
  const bodyData = {
    clientId: parseInt(clientId, 10),
    reservationDate: reserva.fecha,         // ej. "2025-06-15"
    reservationTime: reserva.hora,         // ej. "14:00"
    reservationTypeId: getTypeId(tipoReserva),
    totalPrice: precio                      // asumimos que el back guarda totalPrice también
  };

  try {
    // 6.3) Llamar a POST /api/reservation para crear la reserva como "pendiente"
    const response = await fetch("http://localhost:3000/api/reservation", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(bodyData)
    });
    const data = await response.json();

    if (data.error) {
      alert("Error al crear la reserva: " + data.error);
      return;
    }
    if (!data.reservationId) {
      alert("No obtuvimos reservationId del servidor.");
      return;
    }

    // 6.4) Guardar el reservationId para el paso de pago
    localStorage.setItem("pendingReservationId", data.reservationId);

    // 6.5) Redirigir al usuario a la página de pago (pago.html)
    window.location.href = "pago.html";
  } catch (err) {
    console.error("Error en la petición al crear reserva:", err);
    alert("Ocurrió un problema de red al intentar crear la reserva.");
  }
});

// 7) Función auxiliar para obtener el ID numérico del tipo de reserva
//    (porque en tu tabla `reservationcosts` cada tipo tiene un ID numérico)
function getTypeId(tipoTexto) {
  // Ajusta estos valores a como tengas definidos los IDs en tu tabla reservationcosts
  switch (tipoTexto) {
    case "Individual":
      return 1;
    case "Corporativo":
      return 2;
    case "Streamer":
      return 3;
    case "Educativo":
      return 4;
    case "Escolar":
      return 5;
    default:
      return 1;
  }
}

// 8) Inicialización cuando el DOM cargue
document.addEventListener("DOMContentLoaded", configurarCotizacion);
