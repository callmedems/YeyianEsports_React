document.addEventListener("DOMContentLoaded", () => {
  // Recuperar y mostrar datos
  const reserva = JSON.parse(localStorage.getItem("reserva") || "{}");
  const detallesContainer = document.getElementById("detalles-reserva");
  const correoUsuario = document.getElementById("correo-usuario");

  if (reserva) {
    detallesContainer.innerHTML = `
        <div>
          <strong>Nombre:</strong> ${reserva.nombre || "N/A"}
        </div>
        <div>
          <strong>Tipo:</strong> ${reserva.tipoReserva || "N/A"}
        </div>
        <div>
          <strong>Fecha:</strong> ${
            new Date(reserva.fecha).toLocaleDateString("es-MX") || "N/A"
          }
        </div>
        <div>
          <strong>Hora:</strong> ${reserva.hora || "N/A"}
        </div>
        ${
          reserva.contactMethod
            ? `
        <div>
          <strong>Contacto:</strong> ${reserva.contactValue}
        </div>`
            : ""
        }
      `;

    correoUsuario.textContent = reserva.correo || "N/A";
  }

  // Inicializar mapa
  // Código proporcionado por Google Developers
  window.initMap = function () {
    const arenaLocation = { lat: 20.6817814, lng: -103.4652204 };

    const map = new google.maps.Map(document.getElementById("mapa-arena"), {
      zoom: 16,
      center: arenaLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
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

    new google.maps.Marker({
      position: arenaLocation,
      map: map,
      title: "Arena Yeyian",
      icon: {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238a2be2'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
        scaledSize: new google.maps.Size(40, 40),
      },
    });
  };

  // Cargar mapa si la API está lista
  if (typeof google !== "undefined") initMap();
});
