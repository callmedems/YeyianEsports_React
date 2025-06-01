// Obtener datos de la reserva
const reserva = JSON.parse(localStorage.getItem("reserva")) || {};

// Función de depuración para verificar datos
function debugReserva() {
  console.log("Datos de reserva en localStorage:", reserva);
  if (!reserva || Object.keys(reserva).length === 0) {
    console.error("No se encontraron datos de reserva en localStorage");
    window.location.href = "reservation.html";
  }
}

// Mostrar datos de reserva en la página
function mostrarDatosReserva() {
  // Actualizar información de reserva
  document.querySelector(".resumen-header h3").textContent =
    reserva.tipoReserva || "Individual";
  document.querySelector(".precio-resumen").textContent = `$${(
    reserva.cotizacion || 1500
  ).toLocaleString("es-MX")} MXN`;

  // Mostrar nombre
  const nombreElement = document.querySelector(
    ".resumen-details .detail-item:nth-child(1) span"
  );
  if (nombreElement) nombreElement.textContent = reserva.nombre || "";

  // Formatear y mostrar fecha y hora
  if (reserva.fecha) {
    const fechaObj = new Date(reserva.fecha);
    const opcionesFecha = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const fechaFormateada = fechaObj.toLocaleDateString("es-MX", opcionesFecha);
    document.getElementById("fecha-formateada").textContent = fechaFormateada;
  }

  if (reserva.hora) {
    const [horas, minutos] = reserva.hora.split(":");
    const periodo = parseInt(horas) >= 12 ? "p.m." : "a.m.";
    document.getElementById(
      "hora-formateada"
    ).textContent = `${horas}:${minutos} ${periodo}`;
  }
}

// Configurar Stripe
// CONTIENE API, CONTENIDO SENSIBLE
function configurarStripe() {
  const stripe = Stripe(
    "pk_test_51RJhFw2HfMSQSL5i8QnDnjVAutROW6U3LcR7HWpbxxlFOjCpp8eVO8iZ2oHTzcpkrPeJrtcOffE0TVmC8hjVJiI300PSLDTtm3"
  );
  const elements = stripe.elements();

  // Estilos comunes para elementos de Stripe
  const baseStyle = {
    color: "#ffffff",
    fontFamily: '"Poppins", sans-serif',
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4",
    },
  };

  // Crear elementos de tarjeta separados
  const cardNumber = elements.create("cardNumber", {
    style: {
      base: baseStyle,
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  });
  cardNumber.mount("#card-number");

  const cardExpiry = elements.create("cardExpiry", {
    style: {
      base: baseStyle,
    },
  });
  cardExpiry.mount("#card-expiry");

  const cardCvc = elements.create("cardCvc", {
    style: {
      base: baseStyle,
    },
  });
  cardCvc.mount("#card-cvc");

  // Manejar pago con tarjeta
  document
    .getElementById("pagar-tarjeta")
    .addEventListener("click", async () => {
      const cardName = document.getElementById("card-name").value;

      if (!cardName) {
        alert("Por favor ingresa el nombre que aparece en la tarjeta");
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          name: cardName,
          email: reserva.correo || "",
        },
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Pago exitoso! Redirigiendo...");
        localStorage.setItem("pagoConfirmado", "true");
        setTimeout(() => {
          window.location.href = "confirmation.html";
        }, 1500);
      }
    });
}

// Configurar PayPal
function configurarPayPal() {
  paypal
    .Buttons({
      style: {
        color: "blue",
        shape: "pill",
        label: "pay",
        height: 40,
      },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: (reserva.cotizacion / 100).toFixed(2),
              },
              description: `Reserva Arena Yeyian - ${reserva.tipoReserva}`,
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert("Pago completado por " + details.payer.name.given_name);
          localStorage.setItem("pagoConfirmado", "true");
          window.location.href = "confirmacion.html";
        });
      },
      onError: function (err) {
        alert("Error en el pago con PayPal: " + err);
      },
    })
    .render("#paypal-button-container");
}

// Inicializar mapa con verificación de carga
function initMap() {
  if (!document.getElementById("mapa-arena")) {
    console.error("Elemento del mapa no encontrado");
    return;
  }

  // Verificar si la API de Google Maps está cargada
  if (typeof google === "undefined" || typeof google.maps === "undefined") {
    console.error("Google Maps API no está cargada");
    return;
  }

  const arenaLocation = { lat: 20.6817814, lng: -103.4652204 };

  try {
    const map = new google.maps.Map(document.getElementById("mapa-arena"), {
      zoom: 16,
      center: arenaLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [
            { saturation: 36 },
            { color: "#8a2be2" },
            { lightness: 40 },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [
            { visibility: "on" },
            { color: "#000000" },
            { lightness: 16 },
          ],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [{ color: "#2d1b6e" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#1e1b38" }],
        },
      ],
    });

    new google.maps.Marker({
      position: arenaLocation,
      map: map,
      title: "Arena Yeyian",
      icon: {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238a2be2'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    console.log("Mapa inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar el mapa:", error);
    document.getElementById("mapa-arena").innerHTML =
      '<p style="color:white; text-align:center; padding:20px;">Error al cargar el mapa. Por favor recarga la página.</p>';
  }
}

function configurarSelectoresPago() {
  document.querySelectorAll(".metodo-option").forEach((option) => {
    option.addEventListener("click", () => {
      document
        .querySelectorAll(".metodo-option")
        .forEach((opt) => opt.classList.remove("active"));
      document
        .querySelectorAll(".metodo-form")
        .forEach((form) => form.classList.remove("active"));

      option.classList.add("active");
      document
        .getElementById(`${option.dataset.metodo}-form`)
        .classList.add("active");
    });
  });
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  debugReserva();
  mostrarDatosReserva();
  configurarStripe();
  configurarPayPal();
  configurarSelectoresPago();

  // Asignar la función initMap al objeto window para que sea accesible globalmente
  window.initMap = initMap;

  // Verificar si la API de Google Maps ya está cargada
  if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
    initMap();
  } else {
    console.log("Esperando a que cargue Google Maps API...");
  }
});

// Función para manejar posibles errores de carga de la API
window.gm_authFailure = function () {
  console.error("Error de autenticación con Google Maps API");
  document.getElementById("mapa-arena").innerHTML =
    '<p style="color:white; text-align:center; padding:20px;">Error al cargar el mapa. Verifica tu conexión a internet.</p>';
};
