// PaymentPage.jsx
import React, { useState, useEffect, useRef } from 'react';

const Payment = () => {
  const [reserva, setReserva] = useState({});
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card'); // 'card' or 'paypal'
  const cardNumberRef = useRef(null);
  const cardExpiryRef = useRef(null);
  const cardCvcRef = useRef(null);
  const paypalRef = useRef(null);
  const mapRef = useRef(null);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const cardNumberElement = useRef(null);
  const cardExpiryElement = useRef(null);
  const cardCvcElement = useRef(null);

  // Leer reserva de localStorage y redirigir si no existe
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('reserva')) || {};
    if (!stored || Object.keys(stored).length === 0) {
      window.location.href = 'reservation.html';
      return;
    }
    setReserva(stored);

    // Formatear fecha
    if (stored.fecha) {
      const fechaObj = new Date(stored.fecha);
      const opcionesFecha = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const fechaFormateada = fechaObj.toLocaleDateString('es-MX', opcionesFecha);
      setFormattedDate(fechaFormateada);
    }

    // Formatear hora
    if (stored.hora) {
      const [horas, minutos] = stored.hora.split(':');
      const periodo = parseInt(horas, 10) >= 12 ? 'p.m.' : 'a.m.';
      setFormattedTime(`${horas}:${minutos} ${periodo}`);
    }
  }, []);

  // Configurar Stripe Elements
  useEffect(() => {
    if (!window.Stripe) {
      console.error('Stripe.js no está cargado');
      return;
    }
    const stripe = window.Stripe(
      'pk_test_51RJhFw2HfMSQSL5i8QnDnjVAutROW6U3LcR7HWpbxxlFOjCpp8eVO8iZ2oHTzcpkrPeJrtcOffE0TVmC8hjVJiI300PSLDTtm3'
    );
    stripeRef.current = stripe;
    const elements = stripe.elements();
    elementsRef.current = elements;

    const baseStyle = {
      color: '#ffffff',
      fontFamily: '"Poppins", sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    };

    const cardNumber = elements.create('cardNumber', {
      style: {
        base: baseStyle,
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    });
    cardNumber.mount(cardNumberRef.current);
    cardNumberElement.current = cardNumber;

    const cardExpiry = elements.create('cardExpiry', {
      style: { base: baseStyle },
    });
    cardExpiry.mount(cardExpiryRef.current);
    cardExpiryElement.current = cardExpiry;

    const cardCvc = elements.create('cardCvc', {
      style: { base: baseStyle },
    });
    cardCvc.mount(cardCvcRef.current);
    cardCvcElement.current = cardCvc;
  }, []);

  // Configurar PayPal Buttons
  useEffect(() => {
    if (!window.paypal) {
      console.error('PayPal SDK no está cargado');
      return;
    }
    window.paypal
      .Buttons({
        style: {
          color: 'blue',
          shape: 'pill',
          label: 'pay',
          height: 40,
        },
        createOrder: (data, actions) => {
          const amountValue = ((reserva.cotizacion || 1500) / 100).toFixed(2);
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amountValue,
                },
                description: `Reserva Arena Yeyian - ${reserva.tipoReserva || 'Individual'}`,
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Pago completado por ' + details.payer.name.given_name);
            localStorage.setItem('pagoConfirmado', 'true');
            window.location.href = 'confirmacion.html';
          });
        },
        onError: (err) => {
          alert('Error en el pago con PayPal: ' + err);
        },
      })
      .render(paypalRef.current);
  }, [reserva]);

  // Inicializar Google Maps
  useEffect(() => {
    window.initMap = () => {
      if (!mapRef.current) return;
      if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
        console.error('Google Maps API no está cargada');
        return;
      }
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
              stylers: [
                { saturation: 36 },
                { color: '#8a2be2' },
                { lightness: 40 },
              ],
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [
                { visibility: 'on' },
                { color: '#000000' },
                { lightness: 16 },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
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
        mapRef.current.innerHTML =
          '<p style="color:white; text-align:center; padding:20px;">Error al cargar el mapa. Por favor recarga la página.</p>';
      }
    };

    // Si Google Maps ya está cargado
    if (typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined') {
      window.initMap();
    } else {
      console.log('Esperando a que cargue Google Maps API...');
    }

    // Manejador de error de autenticación
    window.gm_authFailure = () => {
      if (mapRef.current) {
        console.error('Error de autenticación con Google Maps API');
        mapRef.current.innerHTML =
          '<p style="color:white; text-align:center; padding:20px;">Error al cargar el mapa. Verifica tu conexión a internet.</p>';
      }
    };
  }, []);

  // Manejo de pago con tarjeta
  const handleCardPayment = async () => {
    const cardNameInput = document.getElementById('card-name').value.trim();
    if (!cardNameInput) {
      alert('Por favor ingresa el nombre que aparece en la tarjeta');
      return;
    }
    if (!stripeRef.current || !cardNumberElement.current) {
      alert('Stripe no está inicializado.');
      return;
    }
    const { error, paymentMethod } = await stripeRef.current.createPaymentMethod({
      type: 'card',
      card: cardNumberElement.current,
      billing_details: {
        name: cardNameInput,
        email: reserva.correo || '',
      },
    });
    if (error) {
      alert(error.message);
    } else {
      alert('Pago exitoso! Redirigiendo...');
      localStorage.setItem('pagoConfirmado', 'true');
      setTimeout(() => {
        window.location.href = 'confirmation.html';
      }, 1500);
    }
  };

  const priceDisplay = `$${((reserva.cotizacion || 1500).toLocaleString('es-MX'))} MXN`;
  const tipoDisplay = reserva.tipoReserva || 'Individual';

  return (
    <div className="payment-page">

      {/* ===== Resumen de Reserva ===== */}
      <section className="resumen">
        <div className="resumen-header">
          <h3>{tipoDisplay}</h3>
        </div>
        <div className="precio-resumen">{priceDisplay}</div>
        <div className="resumen-details">
          <div className="detail-item">
            <strong>Nombre:</strong>{' '}
            <span>{reserva.nombre || ''}</span>
          </div>
          <div className="detail-item">
            <strong>Fecha:</strong>{' '}
            <span id="fecha-formateada">{formattedDate}</span>
          </div>
          <div className="detail-item">
            <strong>Hora:</strong>{' '}
            <span id="hora-formateada">{formattedTime}</span>
          </div>
        </div>
      </section>

      {/* ===== Selección de Método de Pago ===== */}
      <section className="payment-method-selector">
        <div
          className={`metodo-option ${
            selectedMethod === 'card' ? 'active' : ''
          }`}
          onClick={() => setSelectedMethod('card')}
          data-metodo="card"
        >
          <p>Pago con Tarjeta</p>
        </div>
        <div
          className={`metodo-option ${
            selectedMethod === 'paypal' ? 'active' : ''
          }`}
          onClick={() => setSelectedMethod('paypal')}
          data-metodo="paypal"
        >
          <p>Pago con PayPal</p>
        </div>
      </section>

      {/* ===== Formulario de Pago con Tarjeta ===== */}
      <section
        id="card-form"
        className={`metodo-form ${selectedMethod === 'card' ? 'active' : ''}`}
      >
        <div className="form-group">
          <label htmlFor="card-name">Nombre en la tarjeta:</label>
          <input id="card-name" type="text" placeholder="Juan Pérez" />
        </div>
        <div className="form-group">
          <label>Número de Tarjeta:</label>
          <div id="card-number" ref={cardNumberRef} className="stripe-element" />
        </div>
        <div className="form-group">
          <label>Fecha de Expiración:</label>
          <div id="card-expiry" ref={cardExpiryRef} className="stripe-element" />
        </div>
        <div className="form-group">
          <label>CVC:</label>
          <div id="card-cvc" ref={cardCvcRef} className="stripe-element" />
        </div>
        <button type="button" onClick={handleCardPayment} id="pagar-tarjeta">
          Pagar con Tarjeta
        </button>
      </section>

      {/* ===== Contenedor de PayPal ===== */}
      <section
        id="paypal-form"
        className={`metodo-form ${selectedMethod === 'paypal' ? 'active' : ''}`}
      >
        <div id="paypal-button-container" ref={paypalRef}></div>
      </section>

      {/* ===== Mapa de Google ===== */}
      <section className="map-container">
        <div id="mapa-arena" ref={mapRef} style={{ width: '100%', height: '300px' }}></div>
      </section>
    </div>
  );
};

export default Payment;
