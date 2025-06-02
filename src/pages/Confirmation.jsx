// src/pages/Confirmation.jsx
import React, { useEffect, useRef, useState } from "react";
import "../assets/css/confirmation.css"; // CSS que creamos en el paso anterior
import "../assets/css/styles.css";       // CSS global (navbar + footer)

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Confirmation = () => {
  // 1) Leemos la reserva desde localStorage
  const reserva = JSON.parse(localStorage.getItem("reserva")) || {};

  // 2) Estado local para mostrar los datos de la reserva en el JSX
  const [detalles, setDetalles] = useState({
    nombre: "",
    tipoReserva: "",
    fecha: "",
    hora: "",
    contacto: "",
    contactValue: "",
    correo: "",
  });

  // 3) Ref para el contenedor del mapa
  const mapaArenaRef = useRef(null);

  // 4) Función para formatear fecha (igual que antes)
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

  // 5) Función para formatear hora (igual que antes)
  const formatearHora = (horaStr) => {
    if (!horaStr) return "";
    const [horas, minutos] = horaStr.split(":");
    const periodo = parseInt(horas, 10) >= 12 ? "p.m." : "a.m.";
    return `${horas}:${minutos} ${periodo}`;
  };

  // 6) Definimos window.initMap de inmediato, para que la API de Google Maps 
  //    no intente llamarlo antes de que exista.
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

  // 7) Al montar el componente, llenamos los datos y montamos el mapa
  useEffect(() => {
    // 7.a) Si no hay datos de reserva, redirigimos a "/"
    if (!reserva || Object.keys(reserva).length === 0) {
      window.location.href = "/";
      return;
    }

    // 7.b) Creamos un objeto con los detalles a mostrar
    const detallesObj = {
      nombre: reserva.nombre || "",
      tipoReserva: reserva.tipoReserva || "",
      fecha: formatearFecha(reserva.fecha),
      hora: formatearHora(reserva.hora),
      correo: reserva.correo || "",
    };

    // Si el usuario agregó un método de contacto (por ejemplo, WhatsApp),
    // asumimos que en `reserva.contactMethod` viene el tipo y `reserva.contactValue` el valor.
    if (reserva.contactMethod && reserva.contactValue) {
      detallesObj.contacto = reserva.contactMethod;
      detallesObj.contactValue = reserva.contactValue;
    }

    setDetalles(detallesObj);

    // 7.c) Si la API de Google Maps ya está lista, la montamos de inmediato
    if (window.google && window.google.maps) {
      window.initMap();
    }
    // Si la API no está lista, el callback &callback=initMap la invocará
  }, []); // se ejecuta solo una vez, al montar

  // 8) Función para volver al inicio (ruta "/")
  const volverInicio = () => {
    window.location.href = "/";
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Encapsulamos todo el fondo y el contenido en .confirmation-page */}
      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-card">
            {/* 1) Animación de checkmark */}
            <div className="checkmark-animation">
              <div className="check-icon">
                <i className="fas fa-check"></i>
              </div>
              <svg className="circles" width="150" height="150">
                <circle className="circle-bg" cx="75" cy="75" r="70" />
                <circle className="circle-progress" cx="75" cy="75" r="70" />
              </svg>
            </div>

            {/* 2) Mensaje de confirmación */}
            <h1 className="confirmation-title">¡Pago Exitoso!</h1>
            <p className="confirmation-message">
              Tu reserva en Arena Yeyian ha sido confirmada
            </p>

            {/* 3) Detalles de la reserva */}
            <div className="reservation-details">
              <h2>Detalles de tu reserva:</h2>
              <div className="details-container">
                <div>
                  <strong>Nombre:</strong> {detalles.nombre || "N/A"}
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
                {detalles.contacto && detalles.contactValue && (
                  <div>
                    <strong>Contacto ({detalles.contacto}):</strong>{" "}
                    {detalles.contactValue}
                  </div>
                )}
              </div>
            </div>

            {/* 4) Mapa de ubicación */}
            <div className="ubicacion-container">
              <h2>
                <i className="fas fa-map-marked-alt"></i> Recuerda dónde nos
                ubicamos
              </h2>
              <div id="mapa-arena" ref={mapaArenaRef}></div>
              <div className="direccion">
                <p>
                  <i className="fas fa-location-dot"></i> Estadio Akron, Cto.
                  J.V.C. 2800, El Bajío, Zapopan, Jalisco
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

            {/* 5) Información adicional (correo y soporte) */}
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

            {/* 6) Botón “Volver al Inicio” */}
            <button className="return-home" onClick={volverInicio}>
              <i className="fas fa-home"></i> Volver al Inicio
            </button>
          </div>
        </div>
      </div>

      {/* Espacio para que el Footer no tape contenido */}
      <div style={{ marginBottom: "80px" }}></div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Confirmation;
