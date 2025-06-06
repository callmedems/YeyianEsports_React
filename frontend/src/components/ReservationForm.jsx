// ----- ReservationForm.jsx ----- //

import React, { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "intl-tel-input/build/css/intlTelInput.css";
import intlTelInput from "intl-tel-input";
import "../css/reservationForm.css";

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const fechaRef = useRef(null);
  const whatsappRef = useRef(null);
  const itiRef = useRef(null);
  const [contactMethod, setContactMethod] = useState(null);
  const [emailInput, setEmailInput] = useState("");

  const slides = ["/assets/images/slide1.jpg", "/assets/images/slide2.jpg", "/assets/images/slide3.jpg"];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fechaRef.current) {
      flatpickr(fechaRef.current, {
        minDate: "today",
        disable: [
          function (date) {
            const fechasOcupadas = ["2025-05-01", "2025-05-05"];
            return fechasOcupadas.includes(date.toISOString().split("T")[0]);
          },
        ],
        onChange: function (selectedDates) {
          const mensaje = document.getElementById("mensaje");
          if (selectedDates.length) {
            mensaje.innerText = "¡Fecha disponible!";
            mensaje.style.color = "green";
          } else {
            mensaje.innerText = "Selecciona una fecha válida.";
            mensaje.style.color = "red";
          }
        },
      });
    }
  }, []);

  useEffect(() => {
    if (whatsappRef.current) {
      itiRef.current = intlTelInput(whatsappRef.current, {
        preferredCountries: ["mx", "us"],
        separateDialCode: true,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.9/js/utils.js",
      });
    }
  }, []);

  const validatePhoneNumber = () => {
    if (!itiRef.current || !whatsappRef.current) return false;
    const rawNumber = whatsappRef.current.value.replace(/\D/g, "");
    return rawNumber.length >= 7;
  };

  const showErrorTooltip = (field, message) => {
    const container = field.parentNode;
    container.style.position = "relative";

    let tooltip = container.querySelector(".error-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.classList.add("error-tooltip");
      tooltip.innerHTML = `<span class="error-tooltip-icon">⚠️</span>${message}`;
      container.appendChild(tooltip);
    }
    tooltip.style.display = "block";
  };

  const clearErrorTooltip = (field) => {
    const container = field.parentNode;
    const tooltip = container.querySelector(".error-tooltip");
    if (tooltip) tooltip.style.display = "none";
  };

  const validateStep = (step) => {
    let isValid = true;

    if (step === 1) {
      const nombre = document.getElementById("nombre");
      const correo = document.getElementById("correo");
      const validarFormatoCorreo = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

      if (!nombre.value.trim()) {
        isValid = false;
        showErrorTooltip(nombre, "Por favor ingresa tu nombre");
      } else {
        clearErrorTooltip(nombre);
      }

      if (!correo.value.trim()) {
        isValid = false;
        showErrorTooltip(correo, "Por favor ingresa tu correo");
      } else if (!validarFormatoCorreo(correo.value)) {
        isValid = false;
        showErrorTooltip(correo, "Formato de correo inválido");
      } else {
        clearErrorTooltip(correo);
      }
    } else if (step === 2) {
      const tipoReserva = document.getElementById("tipoReserva");
      if (!tipoReserva.value) {
        isValid = false;
        showErrorTooltip(tipoReserva, "Por favor selecciona un tipo de reserva");
      } else {
        clearErrorTooltip(tipoReserva);
      }

      const specialBanner = document.getElementById("special-banner");
      if (specialBanner && specialBanner.style.display === "block") {
        if (!contactMethod) {
          isValid = false;
          const mensaje = document.getElementById("mensaje");
          mensaje.innerText = "Selecciona un método de contacto";
          mensaje.style.color = "red";
        } else if (contactMethod === "whatsapp") {
          if (!validatePhoneNumber()) {
            isValid = false;
            showErrorTooltip(whatsappRef.current, "Número telefónico inválido");
          } else {
            clearErrorTooltip(whatsappRef.current);
          }
        } else if (contactMethod === "email") {
          const validarFormatoCorreo = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
          };

          if (!emailInput.trim()) {
            isValid = false;
            const emailElement = document.getElementById("email-input");
            if (emailElement)
              showErrorTooltip(emailElement, "Por favor ingresa tu correo");
          } else if (!validarFormatoCorreo(emailInput)) {
            isValid = false;
            const emailElement = document.getElementById("email-input");
            if (emailElement)
              showErrorTooltip(emailElement, "Formato de correo inválido");
          } else {
            const emailElement = document.getElementById("email-input");
            if (emailElement) clearErrorTooltip(emailElement);
          }
        }
      }
    } else if (step === 3) {
      const fecha = document.getElementById("fecha");
      const hora = document.getElementById("hora");
      if (!fecha.value) {
        isValid = false;
        showErrorTooltip(fecha, "Por favor selecciona una fecha");
      } else {
        clearErrorTooltip(fecha);
      }
      if (!hora.value) {
        isValid = false;
        showErrorTooltip(hora, "Por favor selecciona una hora");
      } else {
        clearErrorTooltip(hora);
      }
    }

    return isValid;
  };

  const nextStep = (step) => {
    if (!validateStep(currentStep)) return;
    document.getElementById(`step-${currentStep}`).classList.remove("active");
    document.getElementById(`step-${step}`).classList.add("active");
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = (step) => {
    document.getElementById(`step-${currentStep}`).classList.remove("active");
    document.getElementById(`step-${step}`).classList.add("active");
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkSpecialReservation = () => {
    // Leemos el valor numérico (string) del select
  const tipoReservaValue = document.getElementById("tipoReserva").value;

  // Creamos un pequeño mapa que nos diga a qué texto corresponde cada ID
  const tiposTexto = {
    "1": "Individual",
    "2": "Corporativo",
    "3": "Streamer",
    "4": "Educativo",
    "5": "Escolar",
  };

  // Obtenemos el texto legible a partir del valor numérico
  const textoTipo = tiposTexto[tipoReservaValue] || "";

  const specialBanner = document.getElementById("special-banner");
  const nextButton    = document.getElementById("next-step-2");

  // Si el texto que obtenemos es “Corporativo” o “Streamer”, mostramos el banner
  if (textoTipo === "Corporativo" || textoTipo === "Streamer") {
    const nombre = document.getElementById("nombre").value || "visitante";
    document.getElementById("banner-nombre").textContent = nombre;
    document.getElementById("banner-tipo").textContent = textoTipo;
    specialBanner.style.display = "block";
    nextButton.style.display   = "none";
  } else {
    specialBanner.style.display = "none";
    nextButton.style.display   = "inline-block";
  }
};

  const showContactInput = (type) => {
    setContactMethod(type);

    // ocultar siempre ambos
    document.querySelectorAll(".phone-input-container, #email-input").forEach((el) => {
      el.style.display = "none";
    });

    if (type === "whatsapp") {
      // Mostramos el contenedor de WhatsApp
      const cont = document.getElementById("whatsapp-container");
      cont.style.display = "flex";

      // Si aún no hemos inicializado el objeto de intlTelInput, lo hacemos aquí
      if (!itiRef.current) {
        itiRef.current = intlTelInput(whatsappRef.current, {
          preferredCountries: ["mx", "us"],
          separateDialCode: true,
          utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.9/js/utils.js",
        });
      } else {
        // si ya existía, sólo lo actualizamos (por si cambia el ancho del container)
        itiRef.current.update();
      }
    }
    else if (type === "email") {
      document.getElementById("email-input").style.display = "block";
    }
  };

  const continueWithSpecialReservation = () => {
    if (!contactMethod) {
      const mensaje = document.getElementById("mensaje");
      mensaje.innerText = "Por favor selecciona un método de contacto";
      mensaje.style.color = "red";
      return;
    }

    if (contactMethod === "whatsapp") {
      if (!validatePhoneNumber()) {
        showErrorTooltip(whatsappRef.current, "Número telefónico inválido");
        return;
      }
    } else if (contactMethod === "email") {
      const validarFormatoCorreo = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

      if (!emailInput.trim()) {
        showErrorTooltip(
          document.getElementById("email-input"),
          "Por favor ingresa tu correo"
        );
        return;
      } else if (!validarFormatoCorreo(emailInput)) {
        showErrorTooltip(
          document.getElementById("email-input"),
          "Formato de correo inválido"
        );
        return;
      }
    }

    document.getElementById("special-banner").style.display = "none";
    nextStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (contactMethod === "whatsapp" && !validatePhoneNumber()) {
      showErrorTooltip(whatsappRef.current, "Número telefónico inválido");
      return;
    }

    // 1) Lee los valores del form:
    const tipoReserva = e.target.tipoReserva.value;     // ej. "1" para Individual
    const fecha = e.target.fecha.value;                 // ej. "2025-06-15"
    const hora = e.target.hora.value;                   // ej. "18:30"
    const reservationTime = hora + ":00";
    const clientId = localStorage.getItem("clientId"); // id del cliente logueado

    console.log('→ clientId a enviar:', clientId, '→ Number(clientId):', Number(clientId));

    const reservationDate = fecha;

    // 2) Calcula el precio
    const preciosPorId = {
      1: 1500,  // Individual
      2: 8000,  // Corporativo
      3: 5000,  // Streamer
      4: 4500,  // Educativo
      5: 4000   // Escolar
    };
    const precio = preciosPorId[ Number(tipoReserva) ] || preciosPorId[1];

    // 4) Arma el objeto EXACTO que tu back-end espera:
    const body = {
      reservationDate: reservationDate, // puede ser "2025-06-15"
      reservationTime: reservationTime,             // puede ser "18:30"
      totalPrice: precio,               // 1500 (o el número que corresponda)
      reservationTypeId: Number(tipoReserva), // conviene que sea int
      clientId: Number(clientId),         // conviene que sea int
      // Si tu tabla exige más campos como `paymentStatus`, `ReservationStatus`, etc.,
      // o si en el back-end ya los pones por defecto, no es necesario mandarlos.
    };

    console.log("ENVÍO →", {
      reservationDate,
      reservationTime,
      totalPrice: precio,
      reservationTypeId: Number(tipoReserva),
      clientId: Number(clientId)
    });


    // 4) Hacemos el fetch al back-end para insertar en la BD:
    fetch("http://localhost:3000/api/reservation", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear la reserva en el servidor");
        return res.json();
      })
      .then((data) => {
        const userName = localStorage.getItem("reservaUserName") || "Desconocido";

        const tiposTexto = {
          1: "Individual",
          2: "Corporativo",
          3: "Streamer",
          4: "Educativo",
          5: "Escolar"
        };
        const textoTipo = tiposTexto[Number(tipoReserva)];
        // data = { message: 'Reserva creada con éxito', reservationId: 123 }
        console.log("→ Reserva guardada con id:", data.reservationId);

        // 4) Solo si te interesa seguir mostrando algo en localStorage
        localStorage.setItem(
          "ultimaReserva",
          JSON.stringify({ 
            reservationId: data.reservationId,
            reservationDate: reservationDate,
            reservationTime: reservationTime,
            hora: hora,
            tipoReservaTexto: textoTipo,
            userName: userName,
            correo: e.target.correo.value,
            totalPrice: precio,
          })
        );

        localStorage.setItem(
          "reserva",
          JSON.stringify({
            userName: document.getElementById("nombre").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            tipoReservaTexto: tipoReserva,
            reservationDate: reservationDate,
            reservationTime: hora + ":00",
            totalPrice: precio
            // (Si el usuario eligió WhatsApp o e-mail extra, agregarlo aquí:)
            // contactMethod: "whatsapp" o "email",
            // contactValue: whatsappNumber o emailExtra,
          })
        );

        // 5) Rediriges a la página de cotización (o de confirmación):
        window.location.href = "/cotization"; 
      })
      .catch((err) => {
        console.error(err);
        // Mostrar un mensaje de error al usuario si falla la llamada al servidor
        const mensaje = document.getElementById("mensaje");
        mensaje.innerText = "Hubo un problema al guardar la reserva. Intenta de nuevo.";
        mensaje.style.color = "red";
      });

  };

  const [isOpen, setIsOpen] = useState(false);
  const [nextOpenText, setNextOpenText] = useState("");

  const computeOpenStatus = () => {
    const now = new Date();
    const day = now.getDay(); 
    const hour = now.getHours();
    const minute = now.getMinutes();

    let openHourStart, openHourEnd;

    if (day >= 1 && day <= 5) {
      // Lunes-Viernes
      openHourStart = 10;
      openHourEnd = 22;
    } else {
      // Sábado-Domingo
      openHourStart = 12;
      openHourEnd = 18;
    }

    const nowInHours = hour + minute / 60;
    if (nowInHours >= openHourStart && nowInHours < openHourEnd) {
      setIsOpen(true);
      setNextOpenText(`Cerrará hoy a las ${openHourEnd}:00`);
    } else {
      setIsOpen(false);
      // calcular próximo horario de apertura
      let nextDay = day;
      let nextOpenHour = openHourStart;

      if (nowInHours >= openHourEnd) {
        // ya pasó la hora de cierre de hoy, salto al siguiente día
        nextDay = (day + 1) % 7;
      }

      if (nextDay === 0 || nextDay === 6) {
        // fin de semana, la apertura es a las 12:00
        nextOpenHour = 12;
      } else {
        // día entre semana, la apertura es a las 10:00
        nextOpenHour = 10;
      }

      const isTomorrow =
        nowInHours >= openHourEnd ||
        (day === 6 && nowInHours < openHourStart) ||
        (day === 0 && nowInHours < openHourStart);

      let labelDay = isTomorrow ? "Mañana" : "Hoy";
      if (nowInHours < openHourStart) {
        labelDay = "Hoy";
      }

      setNextOpenText(`${labelDay} a las ${nextOpenHour}:00`);
    }
  };

  useEffect(() => {
    computeOpenStatus();
    const timer = setInterval(computeOpenStatus, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <div className="reservation-wrapper">
          <form
            id="reservation-form"
            className="reservation-form"
            onSubmit={handleSubmit}
          >
            <div className="step active" id="step-1">
              <h1>Reserva tu Experiencia Gamer</h1>
              <p className="form-instructions">
                Por favor rellena este formulario para poder completar tu
                reservación.
              </p>
              <div className="input-container">
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="input-container">
                <input
                  type="email"
                  name="correo"
                  id="correo"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  className="next-btn"
                  onClick={() => nextStep(2)}
                >
                  <i className="fas fa-arrow-right"></i> Siguiente
                </button>
              </div>
            </div>

            <div className="step" id="step-2">
              <h1>Tipo de Reserva</h1>
              <p className="form-instructions">
                Seleccione el tipo de reserva.
              </p>
              <div className="input-container">
                <select name="tipoReserva" id="tipoReserva" required onChange={checkSpecialReservation}>
                  <option value="">Tipo de reserva</option>
                  <option value="1">Individual</option>
                  <option value="2">Corporativo</option>
                  <option value="3">Streamer</option>
                  <option value="4">Educativo</option>
                  <option value="5">Escolar</option>
                </select>
              </div>

              <div
                className="special-banner"
                id="special-banner"
                style={{ display: "none" }}
              >
                <h3>
                  <i className="fas fa-info-circle"></i> ¡Hola{" "}
                  <strong>
                    <span id="banner-nombre"></span>
                  </strong>
                  !
                </h3>
                <p>
                  Dado que tu evento es{" "}
                  <strong>
                    <span id="banner-tipo"></span>
                  </strong>
                  , sugerimos agendar cita con nuestros administrativos.
                </p>
                <p>
                  Puedes contactarnos a:{" "}
                  <strong>
                    <i className="fas fa-envelope"></i> reservas@arenayeyian.com
                  </strong>
                </p>
                <p>O indícanos tu medio de contacto:</p>

                <div className="contact-options">
                  <div className="contact-option">
                    <input
                      type="radio"
                      id="contact-whatsapp"
                      name="contact-method"
                      value="whatsapp"
                      onClick={() => showContactInput("whatsapp")}
                    />
                    <label htmlFor="contact-whatsapp">
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </label>
                    <div
                      id="whatsapp-container"
                      className="phone-input-container"
                      style={{ display: "none" }}
                    >
                      <input
                        type="tel"
                        id="whatsapp-number"
                        placeholder="Ej. 3312345678"
                        ref={whatsappRef}
                      />
                    </div>
                  </div>

                  <div className="contact-option">
                    <input
                      type="radio"
                      id="contact-email"
                      name="contact-method"
                      value="email"
                      onClick={() => showContactInput("email")}
                    />
                    <label htmlFor="contact-email">
                      <i className="fas fa-envelope"></i> Correo
                      electrónico
                    </label>
                    <input
                      type="email"
                      id="email-input"
                      className="contact-input"
                      placeholder="tucorreo@ejemplo.com"
                      style={{ display: "none" }}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="special-banner-buttons">
                  <button
                    type="button"
                    className="special-banner-btn continue"
                    onClick={continueWithSpecialReservation}
                  >
                    <i className="fas fa-check-circle"></i> Continuar
                  </button>
                  <button
                    type="button"
                    className="special-banner-btn cancel"
                    onClick={() => {
                      document.getElementById("special-banner").style.display =
                        "none";
                      document.getElementById("next-step-2").style.display =
                        "inline-block";
                    }}
                  >
                    <i className="fas fa-times-circle"></i> Cancelar
                  </button>
                </div>
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="prev-btn"
                  onClick={() => prevStep(1)}
                >
                  <i className="fas fa-arrow-left"></i> Volver
                </button>
                <button
                  type="button"
                  className="next-btn"
                  id="next-step-2"
                  onClick={() => nextStep(3)}
                >
                  <i className="fas fa-arrow-right"></i> Siguiente
                </button>
              </div>
            </div>

            <div className="step" id="step-3">
              <h1>Selecciona la Fecha y Hora</h1>
              <p className="form-instructions">
                Seleccione alguna de las fechas disponibles.
              </p>
              <div className="input-container">
                <input
                  type="text"
                  id="fecha"
                  name="fecha"
                  placeholder="Selecciona la fecha"
                  required
                  ref={fechaRef}
                />
              </div>
              <div className="input-container">
                <input type="time" name="hora" id="hora" required />
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  className="prev-btn"
                  onClick={() => prevStep(2)}
                >
                  <i className="fas fa-arrow-left"></i> Volver
                </button>
                <button type="submit" className="next-btn">
                  <i className="fas fa-paper-plane"></i> Finalizar Reserva
                </button>
              </div>
            </div>

            <div id="mensaje" style={{ textAlign: "center", marginTop: "10px" }}></div>
          </form>

          <div className="info-panel">
            <h2>Estás a un paso de la experiencia gamer más épica</h2>
            <p>
              Vive torneos en vivo, estaciones de última generación y eventos
              exclusivos. ¡No te pierdas el ambiente más emocionante de
              Guadalajara!
            </p>

            <ul className="features-list">
              <li>
                <i className="fas fa-gamepad"></i> Estaciones de alta potencia
              </li>
              <li>
                <i className="fas fa-trophy"></i> Torneos semanales y premios
              </li>
              <li>
                <i className="fas fa-users"></i> Quedadas y streaming en vivo
              </li>
            </ul>

            <div className="carousel">
              {slides.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className={index === currentSlide ? "active" : ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="discord-panel">
        <i className="fab fa-discord"></i>
        <span>Síguenos en Discord para estar al tanto de todas las novedades</span>
      </div>

      <div className="visit-panel">
        <div className="visit-left">
          <span className="visit-caption">¡Ven a visitarnos!</span>
          <h2 className="visit-status">
            Estamos{" "}
            <span className={`status ${isOpen ? "open" : "closed"}`}>
              {isOpen ? "abiertos" : "cerrados"}
            </span>
          </h2>
          <p className="visit-subtext">
            {isOpen
              ? `Abierto hasta las ${
                  new Date().getDay() >= 1 && new Date().getDay() <= 5
                    ? "22:00"
                    : "18:00"
                }`
              : `Abrirá ${nextOpenText}`}
          </p>
          <div className="visit-info">
            <p>
              <i className="fas fa-phone"></i> +52 33 1234 5678
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i> Cto. J.V.C. 2800, El Bajío, 45014 Zapopan, Jalisco.
            </p>
          </div>
        </div>

        <div className="visit-right">
          <iframe
            title="Mapa Arena Yeyian"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.7001057861544!2d-103.4626455!3d20.681776400000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428a937898a8eb3%3A0x52ad0db6ee356b88!2sEstadio%20Akron!5e0!3m2!1ses-419!2smx!4v1748820757035!5m2!1ses-419!2smx"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
