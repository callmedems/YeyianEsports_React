// src/pages/Pago.jsx

import React, { useEffect, useRef } from "react";
import "../css/payment.css";
import "../css/styles.css";

const Payment = () => {
  // Aquí leemos del localStorage la reserva completa que guardamos
  // justo después de crearla en ReservationForm.jsx
  const reserva = JSON.parse(localStorage.getItem("reserva")) || {};

  const cardNumberRef = useRef(null);
  const cardExpiryRef = useRef(null);
  const cardCvcRef = useRef(null);
  const paypalButtonContainerRef = useRef(null);
  const mapaArenaRef = useRef(null);

  // Formatea una fecha "YYYY-MM-DD" a "lunes, 1 de junio de 2025"
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fechaObj = new Date(fechaStr);
    const opcionesFecha = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return fechaObj.toLocaleDateString("es-MX", opcionesFecha);
  };

  // Formatea "HH:MM:SS" a "HH:MM a.m." o "p.m."
  const formatearHora = (horaStr) => {
    if (!horaStr) return "";
    const [horas, minutos] = horaStr.split(":");
    let horaNum = Number(horas);
    const periodo = horaNum >= 12 ? "p.m." : "a.m.";
    if (horaNum > 12) horaNum -= 12;
    if (horaNum === 0) horaNum = 12; // para las 00:MM, queremos "12:MM a.m."
    return `${horaNum}:${minutos} ${periodo}`;
  };

  // Inicializa el mapa de Google Maps
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

  useEffect(() => {
    // Si no hay datos de reserva en localStorage, redirigimos a Home tras 500 ms
    if (!reserva || Object.keys(reserva).length === 0) {
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }

    configurarStripe();
    configurarPayPal();
    configurarSelectoresPago();

    if (window.google && window.google.maps) {
      window.initMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Configuración de Stripe Elements
  const configurarStripe = () => {
    if (!window.Stripe) {
      console.error("Stripe.js no está cargado");
      return;
    }
    const stripe = window.Stripe(
      "pk_test_51RJhFw2HfMSQSL5i8QnDnjVAutROW6U3LcR7HWpbxxlFOjCpp8eVO8iZ2oHTzcpkrPeJrtcOffE0TVmC8hjVJiI300PSLDTtm3"
    );
    const elements = stripe.elements();

    const baseStyle = {
      color: "#ffffff",
      fontFamily: '"Poppins", sans-serif',
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    };

    const cardNumber = elements.create("cardNumber", {
      style: {
        base: baseStyle,
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    });
    cardNumber.mount(cardNumberRef.current);

    const cardExpiry = elements.create("cardExpiry", {
      style: { base: baseStyle },
    });
    cardExpiry.mount(cardExpiryRef.current);

    const cardCvc = elements.create("cardCvc", {
      style: { base: baseStyle },
    });
    cardCvc.mount(cardCvcRef.current);

    // Al presionar “Pagar” con tarjeta
    const pagarBtn = document.getElementById("pagar-tarjeta");
    if (pagarBtn) {
      pagarBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const cardNameInput = document.getElementById("card-name");
        const cardName = cardNameInput ? cardNameInput.value.trim() : "";

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
          alert("Pago exitoso! Redirigiendo a confirmación...");
          localStorage.setItem("pagoConfirmado", "true");
          setTimeout(() => {
            window.location.href = "/confirmation";
          }, 1500);
        }
      });
    }
  };

  // Configuración de botones de PayPal
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
        createOrder: function (data, actions) {
          // Para PayPal, PayPal espera el monto en formato decimal (ej. 15.00)
          // Nosotros almacenamos totalPrice como entero (p. ej. 1500 MXN), 
          // así que lo dividimos entre 100.
          const valor = (reserva.totalPrice / 100).toFixed(2);
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: valor, // ej. "15.00"
                },
                description: `Reserva Arena Yeyian - ${reserva.tipoReservaTexto}`,
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            alert("Pago completado por " + details.payer.name.given_name);
            localStorage.setItem("pagoConfirmado", "true");
            window.location.href = "/confirmation";
          });
        },
        onError: function (err) {
          alert("Error en el pago con PayPal: " + err);
        },
      })
      .render(paypalButtonContainerRef.current);
  };

  // Alterna entre formulario de tarjeta y PayPal
  const configurarSelectoresPago = () => {
    const options = document.querySelectorAll(".metodo-option");
    const forms = document.querySelectorAll(".metodo-form");

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

  return (
    <>
      <div className="pago-page">
        <div style={{ marginTop: "80px" }}>
          <div className="pago-container">
            {/* ====== Resumen de compra ====== */}
            <div className="pago-info animate__animated animate__fadeIn">
              <div className="resumen-compra">
                <h2>
                  <i className="fas fa-ticket-alt"></i> Tu Reserva en Arena Yeyian
                </h2>
                <div className="resumen-card">
                  <div className="resumen-header">
                    {/* Mostramos el texto del tipo de reserva (p.ej. “Individual”) */}
                    <h3>{reserva.tipoReservaTexto || "Individual"}</h3>
                    <span className="precio-resumen">
                      $
                      {(reserva.totalPrice || 1500).toLocaleString("es-MX")} MXN
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

              {/* ====== Selección de método de pago ====== */}
              <div className="metodos-pago">
                <h2>
                  <i className="fas fa-wallet"></i> Selecciona tu método de pago
                </h2>

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

                {/* ====== Formulario de Tarjeta ====== */}
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
                  <button id="pagar-tarjeta" className="pago-btn">
                    <i className="fas fa-lock"></i> Pagar
                  </button>
                </div>

                {/* ====== Formulario de PayPal ====== */}
                <div className="metodo-form" id="paypal-form">
                  <div
                    id="paypal-button-container"
                    ref={paypalButtonContainerRef}
                  ></div>
                </div>
              </div>
            </div>

            {/* ====== Panel de ubicación ====== */}
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
    </>
  );
};

export default Payment;
