// ConfirmacionPage.jsx
import React, { useEffect, useState, useRef } from 'react';

const Confirmation = () => {
  const [reserva, setReserva] = useState({});
  const mapRef = useRef(null);

  useEffect(() => {
    // 1. Recuperar reserva de localStorage
    const stored = JSON.parse(localStorage.getItem('reserva') || '{}');
    setReserva(stored);

    // 2. Definir función initMap para Google Maps
    window.initMap = () => {
      if (!mapRef.current || typeof window.google === 'undefined') return;

      const arenaLocation = { lat: 20.6817814, lng: -103.4652204 };

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 16,
          center: arenaLocation,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#8a2be2' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [{ color: '#2d1b6e' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#1e1b38' }],
            },
          ],
        });

        new window.google.maps.Marker({
          position: arenaLocation,
          map: map,
          title: 'Arena Yeyian',
          icon: {
            url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238a2be2'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });
      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        if (mapRef.current) {
          mapRef.current.innerHTML =
            '<p style="color:white; text-align:center; padding:20px;">Error al cargar el mapa. Por favor recarga la página.</p>';
        }
      }
    };

    // 3. Si Google Maps ya está cargado, llamar a initMap
    if (typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined') {
      window.initMap();
    } else {
      console.log('Esperando Google Maps API...');
    }
  }, []);

  // Formatear fecha en "es-MX"
  const formatFecha = (isoFecha) => {
    if (!isoFecha) return 'N/A';
    const fechaObj = new Date(isoFecha);
    return fechaObj.toLocaleDateString('es-MX');
  };

  // JSX de detalles de reserva
  return (
    <div className="confirmacion-page">
      <h2>Confirmación de Reserva</h2>

      <section id="detalles-reserva" className="detalles-reserva">
        <div>
          <strong>Nombre:</strong> {reserva.nombre || 'N/A'}
        </div>
        <div>
          <strong>Tipo:</strong> {reserva.tipoReserva || 'N/A'}
        </div>
        <div>
          <strong>Fecha:</strong> {formatFecha(reserva.fecha)}
        </div>
        <div>
          <strong>Hora:</strong> {reserva.hora || 'N/A'}
        </div>
        {reserva.contactMethod && (
          <div>
            <strong>Contacto:</strong> {reserva.contactValue}
          </div>
        )}
      </section>

      <section className="correo-usuario-section">
        <p>
          <strong>Correo de contacto:</strong>{' '}
          <span id="correo-usuario">{reserva.correo || 'N/A'}</span>
        </p>
      </section>

      <section className="map-container">
        <div
          id="mapa-arena"
          ref={mapRef}
          style={{ width: '100%', height: '300px' }}
        ></div>
      </section>
    </div>
  );
};

export default Confirmation;
