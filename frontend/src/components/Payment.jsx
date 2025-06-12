// src/pages/Payment.jsx

import React, { useEffect, useRef, useState } from "react";
import "../css/payment.css";
import "../css/styles.css";

const Payment = () => {
  // 1) Leemos del localStorage la reserva que se guardó al crearla en ReservationForm.jsx
  const reserva = JSON.parse(localStorage.getItem("reserva")) || {};

  const cardNumberRef = useRef(null);
  const cardExpiryRef = useRef(null);
  const cardCvcRef    = useRef(null);
  const paypalButtonContainerRef = useRef(null);
  const mapaArenaRef  = useRef(null);

  const [stripe, setStripe]           = useState(null);
  const [stripeElements, setElements] = useState(null);
  const [cardNumber, setCardNumber]   = useState(null);
  const [cardExpiry, setCardExpiry]   = useState(null);
  const [cardCvc, setCardCvc]         = useState(null);

  // 2) Formatear “YYYY-MM-DD” → “lunes, 1 de junio de 2025”
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    // descomponer el YYYY-MM-DD
    const [year, month, day] = fechaStr.split("-").map(Number);
    // new Date(año, mesÍndice0, día) → evita desplazamientos de zona
    const fechaObj = new Date(year, month - 1, day);
    const opciones = {
      weekday: "long",
      year:    "numeric",
      month:   "long",
      day:     "numeric",
    };
    return fechaObj.toLocaleDateString("es-MX", opciones);
  };

  // 3) Formatear “HH:MM:SS” → “HH:MM a.m.” o “p.m.”
  const formatearHora = (horaStr) => {
    if (!horaStr) return "";
    const [horas, minutos] = horaStr.split(":");
    let horaNum = Number(horas);
    const periodo = horaNum >= 12 ? "p.m." : "a.m.";
    if (horaNum > 12) horaNum -= 12;
    if (horaNum === 0) horaNum = 12;
    return `${horaNum}:${minutos} ${periodo}`;
  };

  // 4) Inicializar Google Maps al montar
  window.initMap = () => {
    if (!mapaArenaRef.current || !window.google || !window.google.maps) {
      return;
    }
    const arenaLocation = { lat: 20.6817814, lng: -103.4652204 };
    try {
      const map = new window.google.maps.Map(mapaArenaRef.current, {
        zoom: 16,
        center: arenaLocation,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
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
          { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
          { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{ color: "#2d1b6e" }],
          },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#1e1b38" }] },
        ],
      });

      new window.google.maps.Marker({
        position: arenaLocation,
        map: map,
        title: "Arena Yeyian",
        icon: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238a2be2'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      mapaArenaRef.current.innerHTML =
        '<p style="color:white; text-align:center; padding:20px;">Error al cargar el mapa. Por favor recarga la página.</p>';
    }
  };

  // 5) useEffect inicial: redirige si no hay reserva y configura Stripe/PayPal
  useEffect(() => {
    if (!reserva || Object.keys(reserva).length === 0) {
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }

    // 5.1) Cargar Stripe.js y montar Elements
    configurarStripe();

    // 5.2) Cargar PayPal SDK y montar botones
    configurarPayPal();

    // 5.3) Configurar el selector de método de pago
    configurarSelectoresPago();

    // 5.4) Inicializar Google Maps (si la API ya está cargada)
    if (window.google && window.google.maps) {
      window.initMap();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ——————————————————————————————————————————————
  // 6) Función: configurar Stripe Elements
  //    Monta cardNumber, cardExpiry y cardCvc en sus refs
  //    Guarda en estado `stripe`, `elements`, y los elementos individuales
  // ——————————————————————————————————————————————
  const configurarStripe = () => {
    if (!window.Stripe) {
      console.error("Stripe.js no está cargado");
      return;
    }

    // 6.1) Inicializa Stripe con tu clave pública
    const stripeInstance = window.Stripe(
      "pk_test_51RXYlZFjV5Crd3Dk4cvF4ipz6XoQB40CJBlhpwMR6eCtskXqREegrbZ4DtfrIBKeHM3w49sxuzUEUGKu8JbmT3p30034EFhLHg"
    );
    setStripe(stripeInstance);

    // 6.2) Crea elements
    const elementsInstance = stripeInstance.elements();
    setElements(elementsInstance);

    // 6.3) Estilo base
    const baseStyle = {
      color: "#ffffff",
      fontFamily: '"Poppins", sans-serif',
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    };

    // 6.4) Montar cardNumber
    const cardNumberElem = elementsInstance.create("cardNumber", {
      style: {
        base:    baseStyle,
        invalid: { color: "#fa755a", iconColor: "#fa755a" },
      },
    });
    cardNumberElem.mount(cardNumberRef.current);
    setCardNumber(cardNumberElem);

    // 6.5) Montar cardExpiry
    const cardExpiryElem = elementsInstance.create("cardExpiry", {
      style: { base: baseStyle },
    });
    cardExpiryElem.mount(cardExpiryRef.current);
    setCardExpiry(cardExpiryElem);

    // 6.6) Montar cardCvc
    const cardCvcElem = elementsInstance.create("cardCvc", {
      style: { base: baseStyle },
    });
    cardCvcElem.mount(cardCvcRef.current);
    setCardCvc(cardCvcElem);
  };

  // ——————————————————————————————————————————————
  // 7) Función: configurar PayPal Buttons
  // ——————————————————————————————————————————————
  const configurarPayPal = () => {
    if (!window.paypal) {
      console.error("PayPal SDK no está cargado");
      return;
    }
    window.paypal
      .Buttons({
        style: {
          color: "blue",
          shape: "pill",
          label: "pay",
          height: 40,
        },
        createOrder: (data, actions) => {
          // PayPal recibe monto en decimal. Como totalPrice está en entero (ej. 1500),
          // lo convertimos a string con dos decimales (1500 → "15.00").
          const valor = (reserva.totalPrice / 100).toFixed(2);
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: valor,
                },
                description: `Reserva Arena Yeyian - ${reserva.tipoReservaTexto}`,
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          // 7.1) PayPal confirma y captura la orden
          const details = await actions.order.capture();
          console.log("→ PayPal payment succeeded:", details);

          // 7.2) En cuanto PayPal confirma, invocamos confirm-payment en nuestro backend
          const pendingReservationId = JSON.parse(localStorage.getItem("ultimaReserva"))
            .reservationId;
          console.log("→ Invocando confirm-payment (PayPal) para ID =", pendingReservationId);

          try {
            const response = await fetch(
              `http://localhost:3000/api/reservation/${pendingReservationId}/confirm-payment`,
              {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ transactionId: data.orderID }),
              }
            );
            const dataBack = await response.json();
            console.log("→ Respuesta de confirm-payment (PayPal):", dataBack);

            if (dataBack.error) {
              alert("Error al confirmar pago: " + dataBack.error);
              return;
            }
            // Si viene warning, redirigimos igualmente a “Mis Reservas”
            if (dataBack.warning) {
              alert("Pago confirmado, pero no se pudo enviar el correo.");
              window.location.href = "/mis_reservas";
              return;
            }

            // 7.3) Todo salió perfecto: redirigimos a “Mis Reservas”
            window.location.href = "/mis_reservas";
          } catch (err) {
            console.error("Error en confirm-payment (PayPal):", err);
            alert("Ocurrió un error al confirmar el pago. Intenta de nuevo.");
          }
        },
        onError: (err) => {
          console.error("Error en el pago con PayPal:", err);
          alert("Error en el pago con PayPal: " + err);
        },
      })
      .render(paypalButtonContainerRef.current);
  };

  // ——————————————————————————————————————————————
  // 8) Función: alternar entre Stripe y PayPal
  // ——————————————————————————————————————————————
  const configurarSelectoresPago = () => {
    const options = document.querySelectorAll(".metodo-option");
    const forms   = document.querySelectorAll(".metodo-form");

    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((opt) => opt.classList.remove("active"));
        forms.forEach((form) => form.classList.remove("active"));

        option.classList.add("active");
        const metodo = option.getAttribute("data-metodo");
        document.getElementById(`${metodo}-form`).classList.add("active");
      });
    });
  };

  // ——————————————————————————————————————————————
  // 9) handleSubmit para enviar pago con Stripe (al hacer submit del form)
  // ——————————————————————————————————————————————
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !stripeElements || !cardNumber) {
      alert("Stripe no está completamente configurado. Inténtalo de nuevo en unos segundos.");
      return;
    }

    // 9.1) Validar que el usuario realmente agregó su nombre en la tarjeta
    const cardNameInput = document.getElementById("card-name");
    const cardName = cardNameInput ? cardNameInput.value.trim() : "";

    if (!cardName) {
      alert("Por favor ingresa el nombre que aparece en la tarjeta");
      return;
    }

    try {
      // 9.2) Crear un PaymentMethod (solo para verificar que los datos de tarjeta sean válidos)
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          name:  cardName,
          email: reserva.correo || "",
        },
      });

      if (pmError) {
        alert(pmError.message);
        return;
      }

      // 9.3) Llamar a nuestro backend para crear un PaymentIntent
      //       Convertimos reserva.totalPrice (ej. 1500) a centavos: 1500 * 100 = 150000
      //       Stripe espera un número entero en centavos.

      const paymentIntentRes = await fetch(
        "http://localhost:3000/api/stripe/create-payment-intent",
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ amount: reserva.totalPrice * 100 })
        }
      );

      const paymentIntentData = await paymentIntentRes.json();
      // Esto SÍ es un string:
      const clientSecret = paymentIntentData.clientSecret;

      if (!paymentIntentRes.ok || !clientSecret || !clientSecret.includes("_secret_")) {
        alert("No se pudo iniciar el pago. Intenta de nuevo más tarde.");
        return;
      }

      // 9.4) Confirmar el PaymentIntent en Stripe.js
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: {
              name:  cardName,
              email: reserva.correo || "",
            },
          },
        }
      );

      if (confirmError) {
        alert("Error al procesar el pago: " + confirmError.message);
        return;
      }

      // 9.5) Si el pago se completó correctamente
      if (paymentIntent.status === "succeeded") {
        console.log("✔ Pago registrado en Stripe:", paymentIntent);

        // 9.6) Invocar confirm-payment en nuestro backend
        const pendingReservationId = JSON.parse(localStorage.getItem("ultimaReserva"))
          .reservationId;
        console.log("→ Invocando confirm-payment (Stripe) para ID =", pendingReservationId);

        const respConfirm = await fetch(
          `http://localhost:3000/api/reservation/${pendingReservationId}/confirm-payment`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ transactionId: paymentIntent.id }),
          }
        );
        const confirmData = await respConfirm.json();
        console.log("→ Respuesta de confirm-payment (Stripe):", confirmData);

        if (confirmData.error) {
          alert("Error al confirmar pago: " + confirmData.error);
          return;
        }
        if (confirmData.warning) {
          alert("Pago confirmado, pero no se pudo enviar el correo.");
          window.location.href = "Confirmation";
          return;
        }

        window.location.href = "/Confirmation";
      } else {
        console.log("⚠️ PaymentIntent status:", paymentIntent.status);
        alert("El pago no pudo completarse. Intenta con otro método.");
      }
    } catch (err) {
      console.error("Error en handleSubmit (Stripe):", err);
      alert("Ocurrió un error al procesar el pago. Intenta de nuevo más tarde.");
    }
  };

  return (
    <div className="pago-page">
      <div style={{ marginTop: "80px" }}>
        <div className="pago-container">
          {/* =================== */}
          {/* → Resumen de compra */}
          {/* =================== */}
          <div className="pago-info animate__animated animate__fadeIn">
            <div className="resumen-compra">
              <h2>
                <i className="fas fa-ticket-alt"></i> Tu Reserva en Arena Yeyian
              </h2>
              <div className="resumen-card">
                <div className="resumen-header">
                  <h3>{reserva.tipoReservaTexto || "Individual"}</h3>
                  <span className="precio-resumen">
                    ${ (reserva.totalPrice || 1500).toLocaleString("es-MX") } MXN
                  </span>
                </div>
                <div className="resumen-details">
                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <span>{reserva.userName || ""}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar-day"></i>
                    <span>{formatearFecha(reserva.reservationDate)}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{formatearHora(reserva.reservationTime)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================= */}
            {/* → Aquí va el <form> de Stripe */}
            {/* ============================= */}
            <form className="metodos-pago" onSubmit={handleSubmit}>
              <h2>
                <i className="fas fa-wallet"></i> Selecciona tu método de pago
              </h2>

              {/* ============ */}
              {/* → OPCIONES */}
              {/* ============ */}
              <div className="metodos-lista">
                <div className="metodo-option active" data-metodo="tarjeta">
                  <i className="fab fa-cc-stripe"></i>
                  <span>Tarjeta de crédito/débito</span>
                </div>
                <div className="metodo-option" data-metodo="paypal">
                  <i className="fab fa-paypal"></i>
                  <span>PayPal</span>
                </div>
              </div>

              {/* =================== */}
              {/* → FORMULARIO Tarjeta */}
              {/* =================== */}
              <div className="metodo-form active" id="tarjeta-form">
                <div className="form-row">
                  <label htmlFor="card-number">Número de tarjeta</label>
                  <div
                    id="card-number"
                    className="stripe-element"
                    ref={cardNumberRef}
                  ></div>
                </div>
                <div className="form-row two-col">
                  <div>
                    <label htmlFor="card-expiry">Fecha de expiración</label>
                    <div
                      id="card-expiry"
                      className="stripe-element"
                      ref={cardExpiryRef}
                    ></div>
                  </div>
                  <div>
                    <label htmlFor="card-cvc">CVC</label>
                    <div
                      id="card-cvc"
                      className="stripe-element"
                      ref={cardCvcRef}
                    ></div>
                  </div>
                </div>
                <div className="form-row">
                  <label htmlFor="card-name">Nombre en la tarjeta</label>
                  <input
                    type="text"
                    id="card-name"
                    placeholder="Como aparece en la tarjeta"
                  />
                </div>
                <button type="submit" className="pago-btn">
                  <i className="fas fa-lock"></i> Pagar
                </button>
              </div>
            </form>

            {/* ======================= */}
            {/* → FORMULARIO PayPal */}
            {/* ======================= */}
            <div className="metodo-form" id="paypal-form">
              <div
                id="paypal-button-container"
                ref={paypalButtonContainerRef}
              ></div>
            </div>
          </div>

          {/* ====================== */}
          {/* → Panel de ubicación */}
          {/* ====================== */}
          <div className="ubicacion-container animate__animated animate__fadeInRight">
            <h2>
              <i className="fas fa-map-marked-alt"></i> Recuerda dónde nos
              encontramos
            </h2>
            <div id="mapa-arena" ref={mapaArenaRef}></div>
            <div className="direccion">
              <p>
                <i className="fas fa-location-dot"></i> Estadio Akron, Cto. J.V.C.
                2800, El Bajío, Zapopan, Jalisco
              </p>
              <p>
                <i className="fas fa-clock"></i> Horario: 9:00 AM - 9:00 PM
              </p>
              <p>
                <i className="fas fa-phone"></i> Teléfono: +52 33 XXXX XXXX
              </p>
              <p>
                <i className="fas fa-car"></i> Estacionamiento gratuito
                disponible
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
