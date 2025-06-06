// ----- MyReservations.jsx ----- //
import React, { useEffect, useState } from 'react';
import '../css/myreservations.css';
import '../css/styles.css';

const MyReservations = () => {
  const [reservas, setReservas] = useState([]);
  const clientId = localStorage.getItem('clientId'); // asegura que está guardado tras el login

  useEffect(() => {
    // 1) Llamamos al back-end para obtener las reservas
    fetch(`http://localhost:3000/api/reservation/${clientId}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron obtener las reservas');
        return res.json();
      })
      .then((data) => {
        // data es un array con objetos del tipo que definimos arriba
        setReservas(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [clientId]);

  if (!reservas.length) {
    return (
      <div className="no-reservas">
        <h2>No tienes reservaciones</h2>
        <p>Explora nuestras arenas y agenda tu próxima experiencia.</p>
        <button className="reservar-button" onClick={() => window.location.href = '/reservation'}>
          Reservar Ahora
        </button>
      </div>
    );
  }

  return (
    <div className="my-reservations-container">
      <h1>Mis Reservaciones</h1>
      <div className="reservations-list">
        {reservas.map((r) => {
            const fechaObj = new Date(r.reservationDate);
            const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const fechaFormateada = fechaObj.toLocaleDateString('es-MX', opcionesFecha);

            // Formatear la hora "16:36:00"
            let horaFormateada = "";
            if (r.reservationTime) {
                const [hh, mm] = r.reservationTime.split(':');
                let horaNum = Number(hh);
                const periodo = horaNum >= 12 ? 'p.m.' : 'a.m.';
                if (horaNum > 12) horaNum -= 12;
                if (horaNum === 0) horaNum = 12; // para “00:MM” sería “12:MM a.m.” si quieres
                horaFormateada = `${horaNum}:${mm} ${periodo}`; // ej. "4:36 p.m."
            } else {
                horaFormateada = "N/A";
            }

            return (
                <div key={r.reservationId} className="reservation-card">
                <div className="card-header">
                    <h2>{r.reservationType}</h2>
                    <span className="price">
                    ${r.pricePerDay.toLocaleString('es-MX')} MXN
                    </span>
                </div>
                <div className="card-body">
                    <p><i className="fas fa-user"></i> {r.userName}</p>
                    <p><i className="fas fa-calendar-alt"></i> {fechaFormateada}</p>
                    <p><i className="fas fa-clock"></i> {horaFormateada}</p>
                </div>
                <div className="card-footer">
                    <span className="total">
                    ¡No olvides dejar tu reseña!
                    </span>
                    <span className={`status ${r.ReservationStatus}`}>
                    {r.ReservationStatus === 'pending' ? 'Pendiente' :
                    r.ReservationStatus === 'approved' ? 'Aprobada' :
                    r.ReservationStatus === 'rejected' ? 'Rechazada' : r.ReservationStatus}
                    </span>
                </div>
                </div>
            );
            })}
      </div>
    </div>
  );
};

export default MyReservations;
