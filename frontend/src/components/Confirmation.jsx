// src/pages/Confirmation.jsx

import React, { useEffect, useRef, useState } from "react";
import "../css/confirmation.css";
import "../css/styles.css";

import Navbar from "../components/Navbar";

const Confirmation = () => {
  // 1) Leemos del localStorage la reserva completa
  const reserva = JSON.parse(localStorage.getItem("reservaDetalle")) || {};

  // 2) Creamos un estado local con TODOS los campos que queremos mostrar
  const [detalles, setDetalles] = useState({
    nombre: "",
    tipoReserva: "",
    fecha: "",
    hora: "",
    contactoLabel: "",
    contactoValor: "",
    correo: ""
  });

  const mapaArenaRef = useRef(null);

  // Helper para formatear “2025-06-08” → “domingo, 8 de junio de 2025”
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

  // Helper para formatear “16:00:00” → “4:00 p.m.”, etc.
  const formatearHora = (horaStr) => {
    if (!horaStr) return "";
    const [hh, mm] = horaStr.split(":");
    let horaNum = Number(hh);
    const periodo = horaNum >= 12 ? "p.m." : "a.m.";
    if (horaNum === 0) {
      horaNum = 12;
    } else if (horaNum > 12) {
      horaNum = horaNum - 12;
    }
    return `${horaNum}:${mm} ${periodo}`;
  };

  // 3) Iniciamos el mapa de Google Maps (igual que en Pago.jsx)
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
            stylers: [{ color: "#8a2be2" }],
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

  // 4) Cuando el componente se monta:
  useEffect(() => {
    // Si no hay reserva válida, volvemos a "/"
    if (!reserva || Object.keys(reserva).length === 0) {
      window.location.href = "/";
      return;
    }

    // Extraemos del objeto “reserva” los campos que necesitamos
    const detallesObj = {
      nombre: reserva.fullName,
      correo: reserva.email,
      tipoReserva: reserva.tipoReservaTexto,
      fecha: formatearFecha(reserva.reservationDate),
      hora: formatearHora(reserva.reservationTime),
    };

    // Si guardaste método de contacto (email/whatsapp), también lo mostramos:
    if (reserva.contactMethod && reserva.contactValue) {
      // Por ejemplo contactMethod = "email" / "whatsapp"
      // contactValue = "correo@ejemplo.com" o "+52 33 1234 5678"
      detallesObj.contactoLabel = reserva.contactMethod === "whatsapp" ? "WhatsApp" : "Email";
      detallesObj.contactoValor = reserva.contactValue;
    }

    setDetalles(detallesObj);

    // Inicializar el mapa (igual que en Pago.jsx)
    if (window.google && window.google.maps) {
      window.initMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 5) Función para volver al inicio
  const volverInicio = () => {
    window.location.href = "/";
  };

  return (
    <>
      {/* Si tienes una Navbar global, la puedes desplegar aquí */}
      <Navbar />

      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-card">
            {/* Animación del check */}
            <div className="checkmark-animation">
              <div className="check-icon">
                <i className="fas fa-check"></i>
              </div>
              <svg className="circles" width="150" height="150">
                <circle className="circle-bg" cx="75" cy="75" r="70" />
                <circle className="circle-progress" cx="75" cy="75" r="70" />
              </svg>
            </div>

            <h1 className="confirmation-title">¡Pago Exitoso!</h1>
            <p className="confirmation-message">
              Tu reserva en Arena Yeyian ha sido confirmada
            </p>

            <div className="reservation-details">
              <h2>Detalles de tu reserva:</h2>
              <div className="details-container">
                <div>
                  <strong>Nombre:</strong> {detalles.nombre}
                </div>
                <div>
                  <strong>Tipo:</strong> {detalles.tipoReserva || "N/A"}
                </div>
                <div>
                  <strong>Fecha:</strong> {detalles.fecha || "N/A"}
                </div>
                <div>
                  <strong>Hora:</strong> {detalles.hora || "N/A"}
                </div>
                {detalles.contactoLabel && detalles.contactoValor && (
                  <div>
                    <strong>Contacto ({detalles.contactoLabel}):</strong>{" "}
                    {detalles.contactoValor}
                  </div>
                )}
              </div>
            </div>

            <div className="ubicacion-container">
              <h2>
                <i className="fas fa-map-marked-alt"></i> Recuerda dónde nos
                ubicamos
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

            <div className="additional-info">
              <div className="info-box">
                <i className="fas fa-envelope-open-text"></i>
                <p>
                  Hemos enviado un correo de confirmación a:<br />
                  <span>{detalles.correo || "usuario@ejemplo.com"}</span>
                </p>
              </div>
              <div className="info-box">
                <i className="fas fa-life-ring"></i>
                <p>
                  ¿Necesitas ayuda?<br />
                  Escríbenos a:{" "}
                  <a href="mailto:soporte@arenayeyian.com" className="enlace-soporte">
                    soporte@arenayeyian.com
                  </a>
                </p>
              </div>
            </div>

            <button className="return-home" onClick={volverInicio}>
              <i className="fas fa-home"></i> Volver al Inicio
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Confirmation;
