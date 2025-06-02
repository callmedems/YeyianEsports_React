import React, { useState, useEffect, useRef } from "react";
import "intl-tel-input/build/css/intlTelInput.css";
import intlTelInput from "intl-tel-input";

const ReservationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    reservationType: "Individual",
    date: "",
    time: "",
    contactMethod: "whatsapp",
    phoneNumber: "",
    emailContact: "",
  });
  const [errors, setErrors] = useState({});
  const phoneInputRef = useRef(null);
  const itiInstance = useRef(null);
  const carouselImages = [
    "/assets/images/carousel1.jpg",
    "/assets/images/carousel2.jpg",
    "/assets/images/carousel3.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  // Inicializa el intl-tel-input en el input de teléfono
  useEffect(() => {
    if (phoneInputRef.current) {
      itiInstance.current = intlTelInput(phoneInputRef.current, {
        initialCountry: "mx",
        preferredCountries: ["mx", "us"],
        separateDialCode: true,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
    }
    return () => {
      if (itiInstance.current) {
        itiInstance.current.destroy();
      }
    };
  }, []);

  // Lógica para el carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Por favor ingresa tu nombre";
    }
    if (!formData.email.trim()) {
      errs.email = "Por favor ingresa tu correo";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errs.email = "Correo inválido";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.reservationType) {
      errs.reservationType = "Selecciona un tipo de reserva";
    }
    if (!formData.date) {
      errs.date = "Selecciona una fecha";
    }
    if (!formData.time) {
      errs.time = "Selecciona una hora";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (formData.contactMethod === "whatsapp") {
      const phoneNumber = itiInstance.current
        ? itiInstance.current.getNumber()
        : "";
      if (!itiInstance.current.isValidNumber()) {
        errs.phoneNumber = "Número telefónico inválido";
      } else {
        setFormData((prev) => ({ ...prev, phoneNumber }));
      }
    }
    if (formData.contactMethod === "email" && !formData.emailContact.trim()) {
      errs.emailContact = "Por favor ingresa tu correo";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors({});
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    console.log("Datos enviados:", formData);
    // Aquí iría la lógica real de envío al servidor
    alert("¡Reservación enviada con éxito!");
  };

  // Determina el estado de "abierto" o "cerrado" según hora local y día
  const [isOpen, setIsOpen] = useState(false);
  const [closeTimeText, setCloseTimeText] = useState("");

  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = domingo, 6 = sábado
    const hour = now.getHours();
    let open = false;
    let closeText = "";

    if (day >= 1 && day <= 5) {
      // Lunes a viernes: abre de 10:00 a 22:00
      if (hour >= 10 && hour < 22) {
        open = true;
        closeText = `hasta las 22:00`;
      } else if (hour < 10) {
        closeText = `abre hoy a las 10:00`;
      } else {
        closeText = `mañana a las 10:00`;
      }
    } else {
      // Sábado y domingo: abre de 12:00 a 00:00
      if (hour >= 12 && hour < 24) {
        open = true;
        closeText = `hasta la medianoche`;
      } else if (hour < 12) {
        closeText = `abre hoy a las 12:00`;
      } else {
        closeText = `mañana a las 12:00`;
      }
    }

    setIsOpen(open);
    setCloseTimeText(closeText);
  }, []);

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <div className="reservation-wrapper">
          <form
            id="reservation-form"
            className="reservation-form"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Paso 1 */}
            <div className={`step ${step === 1 ? "active" : ""}`} id="step-1">
              <h1>Reserva tu Experiencia Gamer</h1>
              <p className="form-instructions">
                Por favor rellena este formulario para poder completar tu
                reservación.
              </p>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                {errors.fullName && (
                  <div className="error-tooltip">
                    <i className="error-tooltip-icon">⚠</i>
                    {errors.fullName}
                  </div>
                )}
              </div>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <div className="error-tooltip">
                    <i className="error-tooltip-icon">⚠</i>
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  className="prev-btn"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  ← Cancelar
                </button>
                <button type="button" onClick={handleNext}>
                  SIGUIENTE
                </button>
              </div>
            </div>

            {/* Paso 2 */}
            <div className={`step ${step === 2 ? "active" : ""}`} id="step-2">
              <h1>Tipo de Reserva</h1>
              <p className="form-instructions">
                Seleccione el tipo de reserva.
              </p>
              <div className="input-container">
                <select
                  value={formData.reservationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reservationType: e.target.value,
                    })
                  }
                >
                  <option value="Individual">Individual</option>
                  <option value="Streamer">Streamer</option>
                  <option value="Corporativo">Corporativo</option>
                </select>
                {errors.reservationType && (
                  <div className="error-tooltip">
                    <i className="error-tooltip-icon">⚠</i>
                    {errors.reservationType}
                  </div>
                )}
              </div>
              <div className="input-container">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                {errors.date && (
                  <div className="error-tooltip">
                    <i className="error-tooltip-icon">⚠</i>
                    {errors.date}
                  </div>
                )}
              </div>
              <div className="input-container">
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
                {errors.time && (
                  <div className="error-tooltip">
                    <i className="error-tooltip-icon">⚠</i>
                    {errors.time}
                  </div>
                )}
              </div>
              <div className="form-buttons">
                <button type="button" className="prev-btn" onClick={handleBack}>
                  ← Anterior
                </button>
                <button type="button" onClick={handleNext}>
                  SIGUIENTE
                </button>
              </div>
            </div>

            {/* Paso 3 */}
            <div className={`step ${step === 3 ? "active" : ""}`} id="step-3">
              <h1>Contacto</h1>
              <div className="contact-options">
                <div className="contact-option">
                  <input
                    type="radio"
                    id="whatsapp"
                    name="contactMethod"
                    value="whatsapp"
                    checked={formData.contactMethod === "whatsapp"}
                    onChange={(e) =>
                      setFormData({ ...formData, contactMethod: "whatsapp" })
                    }
                  />
                  <label htmlFor="whatsapp">
                    <i className="fa fa-whatsapp"></i> WhatsApp
                  </label>
                </div>
                <div
                  className="phone-input-container"
                  style={{
                    display:
                      formData.contactMethod === "whatsapp" ? "flex" : "none",
                  }}
                >
                  <div className="country-select">
                    <select
                      onChange={() => {}}
                      disabled
                      style={{ cursor: "pointer" }}
                    ></select>
                  </div>
                  <input
                    type="tel"
                    placeholder="Tu número de WhatsApp"
                    ref={phoneInputRef}
                  />
                  {errors.phoneNumber && (
                    <div className="error-tooltip">
                      <i className="error-tooltip-icon">⚠</i>
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>

                <div className="contact-option">
                  <input
                    type="radio"
                    id="emailContact"
                    name="contactMethod"
                    value="email"
                    checked={formData.contactMethod === "email"}
                    onChange={(e) =>
                      setFormData({ ...formData, contactMethod: "email" })
                    }
                  />
                  <label htmlFor="emailContact">
                    <i className="fa fa-envelope"></i> Correo electrónico
                  </label>
                </div>
                <input
                  type="email"
                  className="contact-input"
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.emailContact}
                  style={{
                    display:
                      formData.contactMethod === "email" ? "block" : "none",
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, emailContact: e.target.value })
                  }
                />
                {errors.emailContact && (
                  <div className="error-tooltip">
                    <i className="error-tooltip-icon">⚠</i>
                    {errors.emailContact}
                  </div>
                )}
              </div>

              <div className="form-buttons">
                <button type="button" className="prev-btn" onClick={handleBack}>
                  ← Anterior
                </button>
                <button type="button" onClick={handleNext}>
                  CONTINUAR
                </button>
              </div>
            </div>
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
                <i className="fa fa-gamepad"></i> Estaciones de alta potencia
              </li>
              <li>
                <i className="fa fa-trophy"></i> Torneos semanales y premios
              </li>
              <li>
                <i className="fa fa-users"></i> Quedadas y streaming en vivo
              </li>
              <li>
                <i className="fa fa-coffee"></i> Zona de bebidas y snacks gamer
              </li>
            </ul>
            <div className="carousel">
              {carouselImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Imagen carrusel ${index + 1}`}
                  className={index === currentImage ? "active" : ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="discord-panel">
        <i className="fab fa-discord"></i>
        <span>
          Síguenos en Discord para estar al tanto de todas las novedades
        </span>
      </div>

      <div className="visit-panel">
        <div className="visit-left">
          <p className="visit-caption">¡Ven a visitarnos!</p>
          <p className="visit-status">
            Estamos{" "}
            <span className={isOpen ? "status open" : "status closed"}>
              {isOpen ? "abiertos" : "cerrados"}
            </span>
          </p>
          <p className="visit-subtext">
            {isOpen ? `Abierto ${closeTimeText}` : `Abierto ${closeTimeText}`}
          </p>
          <div className="visit-info">
            <p>
              <i className="fa fa-phone"></i> +52 33 1234 5678
            </p>
            <p>
              <i className="fa fa-map-marker-alt"></i> Cto. J.V.C. 2800, El
              Bajío, 45014 Zapopan, Jalisco.
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
