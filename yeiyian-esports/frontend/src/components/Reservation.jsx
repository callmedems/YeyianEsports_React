// Reservation.jsx
import React, { useState, useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

const Reservation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    tipoReserva: '',
    fecha: '',
    hora: '',
    contactMethod: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');
  const [showSpecial, setShowSpecial] = useState(false);

  const fechaRef = useRef(null);
  const phoneRef = useRef(null);
  const itiRef = useRef(null);

  // Fechas "ocupadas" simuladas
  const disabledDates = ['2025-05-01', '2025-05-05'];

  // Inicialización de Flatpickr en el input de fecha
  useEffect(() => {
    if (fechaRef.current) {
      flatpickr(fechaRef.current, {
        minDate: 'today',
        disable: [
          function (date) {
            return disabledDates.includes(date.toISOString().split('T')[0]);
          },
        ],
        onChange: function (selectedDates) {
          const fechaSeleccionada = selectedDates[0];
          if (fechaSeleccionada) {
            const isoDate = fechaSeleccionada.toISOString().split('T')[0];
            setFormData((prev) => ({ ...prev, fecha: isoDate }));
            setMessage('¡Fecha disponible!');
            setMessageColor('green');
          } else {
            setFormData((prev) => ({ ...prev, fecha: '' }));
            setMessage('Selecciona una fecha válida.');
            setMessageColor('red');
          }
        },
      });
    }
  }, []);

  // Inicialización de intl-tel-input en el campo de teléfono
  useEffect(() => {
    if (phoneRef.current) {
      itiRef.current = intlTelInput(phoneRef.current, {
        preferredCountries: ['mx', 'us'],
        separateDialCode: true,
        utilsScript:
          'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.9/js/utils.js',
      });
    }
  }, []);

  const validarFormatoCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  // Validaciones por paso
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Por favor ingresa tu nombre';
    }
    if (!formData.correo.trim()) {
      newErrors.correo = 'Por favor ingresa tu correo';
    } else if (!validarFormatoCorreo(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.tipoReserva) {
      newErrors.tipoReserva = 'Por favor selecciona un tipo de reserva';
    }
    if (showSpecial) {
      if (!formData.contactMethod) {
        newErrors.contactMethod = 'Selecciona un método de contacto';
      } else if (
        formData.contactMethod === 'whatsapp' &&
        itiRef.current &&
        !itiRef.current.isValidNumber()
      ) {
        newErrors.whatsapp = 'Número telefónico inválido';
      } else if (formData.contactMethod === 'email') {
        if (!formData.email.trim()) {
          newErrors.email = 'Por favor ingresa tu correo';
        } else if (!validarFormatoCorreo(formData.email)) {
          newErrors.email = 'Formato de correo inválido';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.fecha) {
      newErrors.fecha = 'Por favor selecciona una fecha';
    }
    if (!formData.hora) {
      newErrors.hora = 'Por favor selecciona una hora';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar de paso
  const handleNext = (step) => {
    if (currentStep === 1 && !validateStep1()) return;
    // Si es paso 2 sin banner especial, validar normalmente
    if (currentStep === 2 && !showSpecial && !validateStep2()) return;

    setErrors({});
    setCurrentStep(step);
  };

  // Regresar de paso
  const handlePrev = (step) => {
    setErrors({});
    setCurrentStep(step);
  };

  // Cambio en "Tipo de Reserva"
  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    setFormData((prev) => ({ ...prev, tipoReserva: tipo }));
    if (['Corporativo', 'Streamer'].includes(tipo)) {
      setShowSpecial(true);
    } else {
      setShowSpecial(false);
    }
  };

  // Elegir método de contacto (WhatsApp o Email)
  const handleContactMethodChange = (e) => {
    const method = e.target.value;
    setFormData((prev) => ({ ...prev, contactMethod: method }));
    // Limpiar posibles errores previos
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.whatsapp;
      delete updated.email;
      delete updated.contactMethod;
      return updated;
    });
  };

  // Cambio en input de email (paso 2)
  const handleEmailChange = (e) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.email;
      return updated;
    });
  };

  // Cambio en input de hora (paso 3)
  const handleHoraChange = (e) => {
    setFormData((prev) => ({ ...prev, hora: e.target.value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.hora;
      return updated;
    });
  };

  // Continuar cuando el banner especial está visible (paso 2)
  const handleContinueSpecial = () => {
    if (!validateStep2()) return;

    let contactValue = '';
    if (formData.contactMethod === 'whatsapp') {
      if (itiRef.current && !itiRef.current.isValidNumber()) {
        setErrors({ whatsapp: 'Número telefónico inválido' });
        return;
      }
      contactValue = itiRef.current.getNumber();
    } else {
      contactValue = formData.email.trim();
    }

    // Guardar datos parciales en localStorage
    const reservaParcial = {
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim(),
      tipoReserva: formData.tipoReserva,
      contactMethod: formData.contactMethod,
      contactValue,
    };
    localStorage.setItem('reserva', JSON.stringify(reservaParcial));

    setErrors({});
    setCurrentStep(3);
  };

  // Envío final del formulario (paso 3)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const reservaGuardada = JSON.parse(localStorage.getItem('reserva') || '{}');
    const reservaCompleta = {
      ...reservaGuardada,
      fecha: formData.fecha,
      hora: formData.hora,
    };
    localStorage.setItem('reserva', JSON.stringify(reservaCompleta));
    window.location.href = 'cotizacion.html';
  };

  return (
    <form id="reservation-form" onSubmit={handleSubmit}>
      {/* ================= PASO 1: Datos Personales ================= */}
      {currentStep === 1 && (
        <div id="step-1" className="step active">
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
            {errors.nombre && (
              <div className="error-tooltip">
                <span className="error-tooltip-icon">⚠️</span>
                {errors.nombre}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo:</label>
            <input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, correo: e.target.value }))
              }
            />
            {errors.correo && (
              <div className="error-tooltip">
                <span className="error-tooltip-icon">⚠️</span>
                {errors.correo}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNext(2)}
            id="next-step-1"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* ================ PASO 2: Tipo de Reserva y Contacto ================ */}
      {currentStep === 2 && (
        <div id="step-2" className="step active">
          <div className="form-group">
            <label htmlFor="tipoReserva">Tipo de Reserva:</label>
            <select
              id="tipoReserva"
              value={formData.tipoReserva}
              onChange={handleTipoChange}
            >
              <option value="">-- Seleccione --</option>
              <option value="General">General</option>
              <option value="Corporativo">Corporativo</option>
              <option value="Streamer">Streamer</option>
            </select>
            {errors.tipoReserva && (
              <div className="error-tooltip">
                <span className="error-tooltip-icon">⚠️</span>
                {errors.tipoReserva}
              </div>
            )}
          </div>

          {showSpecial && (
            <div id="special-banner" className="special-banner">
              <p>
                Bienvenido{' '}
                <strong id="banner-nombre">
                  {formData.nombre.trim() || 'visitante'}
                </strong>
                , tipo de reserva:{' '}
                <strong id="banner-tipo">{formData.tipoReserva}</strong>
              </p>

              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="contact-method"
                    value="whatsapp"
                    checked={formData.contactMethod === 'whatsapp'}
                    onChange={handleContactMethodChange}
                  />
                  WhatsApp
                </label>
                <label>
                  <input
                    type="radio"
                    name="contact-method"
                    value="email"
                    checked={formData.contactMethod === 'email'}
                    onChange={handleContactMethodChange}
                  />
                  Email
                </label>
                {errors.contactMethod && (
                  <div className="error-tooltip">
                    <span className="error-tooltip-icon">⚠️</span>
                    {errors.contactMethod}
                  </div>
                )}
              </div>

              {formData.contactMethod === 'whatsapp' && (
                <div className="form-group" id="whatsapp-container">
                  <input
                    id="whatsapp-number"
                    type="tel"
                    ref={phoneRef}
                    placeholder="Número de WhatsApp"
                  />
                  {errors.whatsapp && (
                    <div className="error-tooltip">
                      <span className="error-tooltip-icon">⚠️</span>
                      {errors.whatsapp}
                    </div>
                  )}
                </div>
              )}

              {formData.contactMethod === 'email' && (
                <div className="form-group" id="email-input">
                  <input
                    id="email-input-field"
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    placeholder="Correo electrónico"
                  />
                  {errors.email && (
                    <div className="error-tooltip">
                      <span className="error-tooltip-icon">⚠️</span>
                      {errors.email}
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleContinueSpecial}
                className="btnContinueSpecial"
              >
                Continuar
              </button>
            </div>
          )}

          {!showSpecial && (
            <button
              type="button"
              onClick={() => handleNext(3)}
              id="next-step-2"
            >
              Siguiente
            </button>
          )}

          <button type="button" onClick={() => handlePrev(1)}>
            Anterior
          </button>
        </div>
      )}

      {/* ================= PASO 3: Fecha y Hora ================= */}
      {currentStep === 3 && (
        <div id="step-3" className="step active">
          <div className="form-group">
            <label htmlFor="fecha">Fecha:</label>
            <input
              id="fecha"
              type="text"
              ref={fechaRef}
              readOnly
            />
            {errors.fecha && (
              <div className="error-tooltip">
                <span className="error-tooltip-icon">⚠️</span>
                {errors.fecha}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="hora">Hora:</label>
            <input
              id="hora"
              type="time"
              value={formData.hora}
              onChange={handleHoraChange}
            />
            {errors.hora && (
              <div className="error-tooltip">
                <span className="error-tooltip-icon">⚠️</span>
                {errors.hora}
              </div>
            )}
          </div>

          <div id="mensaje" style={{ color: messageColor }}>
            {message}
          </div>

          <button type="submit">Enviar</button>
          <button type="button" onClick={() => handlePrev(2)}>
            Anterior
          </button>
        </div>
      )}
    </form>
  );
};

export default Reservation;
