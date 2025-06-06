// pago.js

// 1) Obtener datos de la reserva desde localStorage
const reserva = JSON.parse(localStorage.getItem("reserva")) || {};
const pendingReservationId = localStorage.getItem("pendingReservationId");

// 2) Función de depuración
function debugReserva() {
  if (!reserva || Object.keys(reserva).length === 0 || !pendingReservationId) {
    console.error("Faltan datos de reserva o no hay reservationId pendiente");
    window.location.href = "reservation.html"; 
    // REDIRIGIR si no hay datos
  }
}

// 3) Mostrar datos de la reserva en la página
function mostrarDatosReserva() {
  document.querySelector(".resumen-header h3").textContent =
    reserva.tipoReserva || "Individual";
  document.querySelector(".precio-resumen").textContent = `$${(
    reserva.cotizacion || 1500
  ).toLocaleString("es-MX")} MXN`;

  // Nombre
  const nombreElement = document.querySelector(
    ".resumen-details .detail-item:nth-child(1) span"
  );
  if (nombreElement) nombreElement.textContent = reserva.nombre || "";

  // Fecha formateada
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

  // Hora formateada
  if (reserva.hora) {
    const [horas, minutos] = reserva.hora.split(":");
    const periodo = parseInt(horas) >= 12 ? "p.m." : "a.m.";
    document.getElementById(
      "hora-formateada"
    ).textContent = `${horas}:${minutos} ${periodo}`;
  }
}

// 4) Configurar Stripe (tu clave pública ya la tienes)
async function iniciarStripeFlow() {
  try {
    // 4.1) Llamar a nuestro backend para crear el PaymentIntent
    //       Convertimos reserva.cotizacion (que está en pesos) a centavos
    const response = await fetch("http://localhost:3000/api/stripe/create-payment-intent", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        amount:   Math.round(reserva.cotizacion * 100), // convertir a centavos
        currency: "mxn"
      })
    });
    const data = await response.json();

    if (data.error || !data.clientSecret) {
      alert("No se pudo iniciar el pago. Intenta de nuevo más tarde.");
      return;
    }
    const clientSecret = data.clientSecret;
    console.log("clientSecret que recibimos:", data.clientSecret);

    // 4.2) Inicializar Stripe.js con tu clave pública
    const stripe = Stripe("pk_test_51RJhFw2HfMSQSL5i8QnDnjVAutROW6U3LcR7HWpbxxlFOjCpp8eVO8iZ2oHTzcpkrPeJrtcOffE0TVmC8hjVJiI300PSLDTtm3");
    const elements = stripe.elements();
    const style = {
      base: {
        color: "#ffffff",
        fontFamily: '"Poppins", sans-serif',
        fontSize: "16px",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#fa755a", iconColor: "#fa755a" }
    };

    // 4.3) Montar los elementos de tarjeta
    const cardNumber = elements.create("cardNumber", { style });
    cardNumber.mount("#card-number");

    const cardExpiry = elements.create("cardExpiry", { style });
    cardExpiry.mount("#card-expiry");

    const cardCvc = elements.create("cardCvc", { style });
    cardCvc.mount("#card-cvc");

    // 4.4) Manejar el clic en “Pagar con tarjeta”
    document.getElementById("pagar-tarjeta").addEventListener("click", async () => {
      const cardName = document.getElementById("card-name").value;
      if (!cardName) {
        alert("Por favor ingresa el nombre que aparece en la tarjeta");
        return;
      }

      // 4.5) Confirmar el PaymentIntent en Stripe usando el clientSecret
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: {
              name:  cardName,
              email: reserva.correo || ""
            }
          }
        }
      );

      if (stripeError) {
        // Algo salió mal al autenticar o procesar la tarjeta
        alert("Error al procesar el pago: " + stripeError.message);
        return;
      }

      // 4.6) Si llegamos aquí, paymentIntent.status === 'succeeded'
      if (paymentIntent.status === "succeeded") {
        // NUEVO: llamar a nuestro endpoint confirm-payment
        try {
          const respConfirm = await fetch(
            `http://localhost:3000/api/reservation/${pendingReservationId}/confirm-payment`,
            { method:  "POST", headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                transactionId: paymentIntent.id // o paymentIntent.charges.data[0].id
              })
            }
          );
          const confirmData = await respConfirm.json();

          if (confirmData.error) {
            alert("Error al confirmar pago: " + confirmData.error);
            return;
          }
          if (confirmData.warning) {
            alert("Pago confirmado, pero no se pudo enviar el correo.");
            window.location.href = "mis_reservas.html";
            return;
          }

          // Todo salió perfecto: reserva marcada como pagada y correo enviado
          alert("¡Pago confirmado y correo enviado! Gracias por tu reserva.");
          window.location.href = "mis_reservas.html";
        } catch (err) {
          console.error("Error al llamar a confirm-payment:", err);
          alert("Ocurrió un error al confirmar el pago. Intenta de nuevo.");
        }
      } else {
        alert("El pago no pudo completarse. Intenta con otro método.");
      }
    });
  } catch (err) {
    console.error("Error en iniciarStripeFlow():", err);
    alert("No se pudo iniciar el proceso de pago. Intenta de nuevo más tarde.");
  }
}

// 5) Configurar PayPal (similares cambios que en Stripe)
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
        // 5.1) Indicamos el monto a pagar (en este ejemplo, cotización / 100)
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
        // 5.2) Cuando PayPal confirma, capturamos la orden
        return actions.order.capture().then(async function (details) {
          alert("Pago completado por " + details.payer.name.given_name);

          // 5.3) Llamamos a nuestro back para confirmar el pago y enviar correo
          try {
            const response = await fetch(
              `http://localhost:3000/api/reservation/${pendingReservationId}/confirm-payment`,
              {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                  transactionId: data.orderID,
                }),
              }
            );
            const dataBack = await response.json();

            if (dataBack.error) {
              alert("Error al confirmar pago: " + dataBack.error);
              return;
            }
            if (dataBack.warning) {
              alert("Pago confirmado, pero no se pudo enviar el correo.");
              window.location.href = "mis_reservas.html";
              return;
            }

            alert("¡Pago confirmado y correo enviado! Gracias por tu reserva.");
            window.location.href = "mis_reservas.html";
          } catch (err) {
            console.error("Error en confirm-payment (PayPal):", err);
            alert("Ocurrió un error al confirmar el pago. Intenta de nuevo.");
          }
        });
      },
      onError: function (err) {
        alert("Error en el pago con PayPal: " + err);
      },
    })
    .render("#paypal-button-container");
}

const reservationId = localStorage.getItem('pendingReservationId');

const response = await fetch(
  `http://localhost:3000/api/reservation/${reservationId}/confirm-payment`,
  {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      transactionId: paymentIntent.id // o .orderID, según tu pasarela
    })
  }
);
const data = await response.json();

if (data.error) {
  alert("Error al confirmar pago: " + data.error);
  return;
}
if (data.warning) {
  alert("Pago confirmado, pero no se pudo enviar el correo.");
  window.location.href = "mis_reservas.html";
  return;
}

// Si llegamos aquí: data.success === true
alert("¡Pago confirmado y correo enviado! Gracias por tu reserva.");
window.location.href = "mis_reservas.html";

// 6) Inicializar mapa (sin cambios)
function initMap() {
  if (!document.getElementById("mapa-arena")) {
    console.error("Elemento del mapa no encontrado");
    return;
  }
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

// 7) Selector de método de pago (sin cambios)
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

// 8) Inicializar todo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  debugReserva();
  mostrarDatosReserva();
  configurarStripe();
  configurarPayPal();
  configurarSelectoresPago();

  window.initMap = initMap;
  if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
    initMap();
  } else {
    console.log("Esperando a que cargue Google Maps API...");
  }
});

// 9) Manejo de error de Google Maps API
window.gm_authFailure = function () {
  console.error("Error de autenticación con Google Maps API");
  document.getElementById("mapa-arena").innerHTML =
    '<p style="color:white; text-align:center; padding:20px;">Error al cargar el mapa. Verifica tu conexión a internet.</p>';
};
