// CotizacionPage.jsx
import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Asegúrate de tener font-awesome instalado

const Cotization = () => {
  const [reserva, setReserva] = useState({});
  const [marketingData, setMarketingData] = useState({
    title: '',
    message: '',
    features: [],
  });
  const [fechaFormateada, setFechaFormateada] = useState('');
  const [horaFormateada, setHoraFormateada] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [precio, setPrecio] = useState(0);

  // Precios simulados por tipo de reserva
  const precios = {
    Individual: 1500,
    Corporativo: 8000,
    Streamer: 5000,
    Educativo: 4500,
    Escolar: 4000,
  };

  // Mensajes de marketing por tipo de reserva
  const marketingMessages = {
    Escolar: {
      title: '¡Una experiencia educativa inolvidable!',
      message:
        'Haremos que tus alumnos aprendan mientras se divierten en un entorno gaming profesional. Ideal para clases de tecnología, robótica o eventos escolares.',
      features: [
        'Área segura y supervisada - Espacio controlado para grupos escolares',
        'Contenido educativo adaptable - Programas alineados a planes de estudio',
        'Posibilidad de torneos internos - Competencias sanas entre alumnos',
      ],
    },
    Corporativo: {
      title: '¡Impulsa el trabajo en equipo de forma innovadora!',
      message:
        'Perfecto para team buildings, eventos corporativos o lanzamientos de producto. Mejora la comunicación y colaboración de tu equipo.',
      features: [
        'Espacio para presentaciones - Área equipada para reuniones',
        'Actividades personalizadas - Diseñadas para tus objetivos',
        'Análisis de desempeño en equipo - Reportes post-evento',
      ],
    },
    Streamer: {
      title: '¡Eleva tu contenido al siguiente nivel!',
      message:
        'Graba o transmite desde nuestras instalaciones profesionales con el mejor equipamiento y conexión de fibra óptica.',
      features: [
        'Setup profesional para streaming - Equipo de alta gama listo para transmitir',
        'Backdrops personalizables - Escenarios temáticos para tu marca',
        'Asistencia técnica especializada - Soporte durante tus transmisiones',
      ],
    },
    Educativo: {
      title: 'Aprendizaje a través del gaming',
      message:
        'Programas educativos diseñados para enseñar habilidades STEM, trabajo en equipo y pensamiento estratégico.',
      features: [
        'Contenido curricular adaptable - Material para diferentes niveles',
        'Sesiones guiadas por expertos - Instructores certificados',
        'Reportes de progreso - Evaluación del aprendizaje',
      ],
    },
    Individual: {
      title: '¡Vive la experiencia gaming definitiva!',
      message:
        'Disfruta de horas de diversión con el mejor equipamiento en un ambiente diseñado para gamers.',
      features: [
        'Acceso a todos nuestros juegos - Biblioteca con +50 títulos',
        'Sesiones personalizadas - Configuración a tu medida',
        'Participación en torneos - Competencias semanales',
      ],
    },
  };

  useEffect(() => {
    // 1. Obtener reserva de localStorage o redirigir si no existe
    const stored = JSON.parse(localStorage.getItem('reserva')) || {};
    if (!stored || Object.keys(stored).length === 0) {
      window.location.href = 'reservation.html';
      return;
    }

    const tipoReserva = stored.tipoReserva || 'Individual';

    // 2. Calcular precio y actualizar reserva
    const precioCalculado = precios[tipoReserva] || precios['Individual'];
    const updatedReserva = { ...stored, cotizacion: precioCalculado };
    localStorage.setItem('reserva', JSON.stringify(updatedReserva));
    setReserva(updatedReserva);
    setPrecio(precioCalculado);

    // 3. Seleccionar datos de marketing
    const marketing =
      marketingMessages[tipoReserva] || marketingMessages['Individual'];
    setMarketingData(marketing);

    // 4. Formatear fecha y hora
    if (updatedReserva.fecha) {
      const fechaObj = new Date(updatedReserva.fecha);
      const opcionesFecha = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const fechaFmt = fechaObj.toLocaleDateString('es-MX', opcionesFecha);
      setFechaFormateada(fechaFmt);
    }

    if (updatedReserva.hora) {
      const [horas, minutos] = updatedReserva.hora.split(':');
      const periodoFmt = parseInt(horas, 10) >= 12 ? 'p.m.' : 'a.m.';
      setPeriodo(periodoFmt);
      setHoraFormateada(`${horas}:${minutos}`);
    }
  }, []);

  const handlePagar = () => {
    window.location.href = 'pago.html';
  };

  // Íconos sugeridos (FontAwesome)
  const icons = [
    'fa-gamepad',
    'fa-users',
    'fa-trophy',
    'fa-chalkboard-teacher',
    'fa-video',
  ];

  return (
    <div className="cotizacion-page">
      {/* Título de marketing */}
      <header className="cotizacion-header">
        <h1>{marketingData.title}</h1>
      </header>

      {/* Mensaje y fecha/hora */}
      <section className="marketing-message" id="marketing-message">
        <div>
          {marketingData.message}
          <br />
          <br />
          <span
            style={{
              fontSize: '0.9em',
              color: '#aaaaaa',
            }}
          >
            Este es el precio para la renta de la arena el {fechaFormateada} a las{' '}
            {horaFormateada} {periodo}
          </span>
        </div>
      </section>

      {/* Precio de cotización */}
      <section className="cotizacion-precio" id="cotizacion-precio">
        <span
          style={{
            fontSize: '0.8em',
            display: 'block',
            marginBottom: '5px',
          }}
        >
          Cotización para reserva {reserva.tipoReserva?.toLowerCase() || 'individual'}
        </span>
        ${precio.toLocaleString('es-MX')} MXN
      </section>

      {/* Grid de características */}
      <section className="features-grid">
        {marketingData.features.map((feature, index) => {
          const [titulo, descripcion] = feature.split(' - ');
          return (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <i className={`fa ${icons[index]}`} aria-hidden="true"></i>
              </div>
              <h3>{titulo}</h3>
              <p>{descripcion || feature}</p>
            </div>
          );
        })}
      </section>

      {/* Botón de pago */}
      <button id="pago-button" onClick={handlePagar}>
        Continuar a Pago
      </button>
    </div>
  );
};

export default Cotization;
