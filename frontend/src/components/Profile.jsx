// src/components/Profile.jsx

import React, { useEffect, useState, useRef } from "react";
import "../css/profile.css"; // ver sección 2
import "../css/styles.css"; // tus estilos globales

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  const fileInputRef = useRef(null);
  const clientId = localStorage.getItem("clientId");

  // 1) Al montar, bajamos los datos del usuario (nombre + foto) y sus reservaciones
  useEffect(() => {
    if (!clientId) {
      window.location.href = "/login";
      return;
    }

    // 1.1) Fetch para datos de usuario
    const fetchUserData = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/api/client/${clientId}`);
        if (!resp.ok) throw new Error("No se pudo bajar datos del usuario");
        const usuario = await resp.json();
        setUserName(usuario.userName || "");
        setCurrentPhotoUrl(usuario.profilePicture || null);

        // Inicialmente guardamos en localStorage para que la navbar lo capte
        localStorage.setItem("navbarUserName", usuario.userName || "");
        if (usuario.profilePicture) {
          localStorage.setItem("navbarProfilePicture", usuario.profilePicture);
        }
      } catch (err) {
        console.error("Error al bajar datos de usuario:", err);
      }
    };

    // 1.2) Fetch para reservaciones
    const fetchReservas = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/api/reservation/${clientId}`);
        if (!resp.ok) throw new Error("No se pudieron obtener las reservas");
        const data = await resp.json();
        setReservas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReservas(false);
      }
    };

    fetchUserData();
    fetchReservas();
  }, [clientId]);

  // 2) Cuando el usuario selecciona un archivo, actualizamos preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3) Enviar formulario al backend para actualizar perfil
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("El nombre de usuario no puede estar vacío.");
      return;
    }

    setLoadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("userName", userName.trim());
      if (newPhotoFile) {
        formData.append("profilePicture", newPhotoFile);
      }

      const resp = await fetch(`http://localhost:3000/api/client/${clientId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Error al actualizar perfil.");
      }

      // 3.1) Actualizamos estado local y localStorage para que navbar lo reciba
      setCurrentPhotoUrl(data.profilePicture || currentPhotoUrl);
      setNewPhotoFile(null);
      setPreviewUrl(null);

      localStorage.setItem("navbarUserName", data.userName);
      if (data.profilePicture) {
        localStorage.setItem("navbarProfilePicture", data.profilePicture);
      }

      // Emitimos evento para que Navbar sepa que cambió
      window.dispatchEvent(new Event("userProfileChanged"));

      alert("Perfil actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      alert(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  // 4) Función para formatear fecha y hora
  const formatearFecha = (fechaStr) => {
    const fechaObj = new Date(fechaStr);
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return fechaObj.toLocaleDateString("es-MX", opciones);
  };
  const formatearHora = (horaStr) => {
    if (!horaStr) return "N/A";
    const [hh, mm] = horaStr.split(":");
    let h = Number(hh);
    const periodo = h >= 12 ? "p.m." : "a.m.";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${mm} ${periodo}`;
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        {/* ───────────────────────────────────────────────────────
            1) SECCIÓN IZQUIERDA: Editar Perfil (foto + userName)
           ─────────────────────────────────────────────────────── */}
        <div className="profile-section">
          <h1>Editar Perfil</h1>
          <form className="edit-profile-form" onSubmit={handleSubmitProfile}>
            <div className="photo-section">
              <label className="section-label">Foto de perfil actual:</label>
              <div className="photo-preview-wrapper">
                {previewUrl ? (
                  <img src={previewUrl} alt="Nuevo preview" className="photo-preview" />
                ) : currentPhotoUrl ? (
                  <img
                    src={`http://localhost:3000/${currentPhotoUrl}`}
                    alt="Foto actual"
                    className="photo-preview"
                  />
                ) : (
                  <div className="no-photo">Sin foto</div>
                )}
              </div>

              <button
                type="button"
                className="btn-select-photo"
                onClick={() => fileInputRef.current.click()}
                disabled={loadingProfile}
              >
                {newPhotoFile ? "Cambiar archivo" : "Seleccionar nueva foto"}
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={loadingProfile}
              />
              <p className="small-text">
                <i>JPEG/PNG. Máx. 2 MB.</i>
              </p>
            </div>

            <div className="field-group">
              <label htmlFor="userName" className="section-label">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Escribe tu nuevo nombre"
                disabled={loadingProfile}
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn-save" disabled={loadingProfile}>
                {loadingProfile ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>

        {/* ───────────────────────────────────────────────────────
            2) SECCIÓN DERECHA: Listado de Mis Reservas
           ─────────────────────────────────────────────────────── */}
        <div className="reservations-section">
          <h1>Mis Reservas</h1>
          {loadingReservas ? (
            <p className="loading-text">Cargando reservaciones…</p>
          ) : reservas.length === 0 ? (
            <div className="no-reservas-section">
              <h2>No tienes reservaciones</h2>
              <p>Explora nuestro mundo y agenda tu próxima experiencia.</p>
              <button
                className="reservar-button"
                onClick={() => (window.location.href = "/reservation")}
              >
                Reservar Ahora
              </button>
            </div>
          ) : (
            <div className="reservations-list">
              {reservas.map((r) => {
                const fechaFormateada = formatearFecha(r.reservationDate);
                const horaFormateada = formatearHora(r.reservationTime);

                // Determinamos texto de estado y clase CSS:
                let estadoTexto = "";
                let estadoClase = "";
                if (r.ReservationStatus === "pending") {
                  estadoTexto = "Pendiente";
                  estadoClase = "status-pending";
                } else if (r.ReservationStatus === "approved") {
                  estadoTexto = "Aprobada";
                  estadoClase = "status-approved";
                } else if (r.ReservationStatus === "rejected") {
                  estadoTexto = "Rechazada";
                  estadoClase = "status-rejected";
                } else {
                  estadoTexto = r.ReservationStatus;
                  estadoClase = "";
                }

                return (
                  <div key={r.reservationId} className="reservation-card">
                    <div className="card-header">
                      <h2 className="reservation-type">{r.reservationType}</h2>
                      <span className="price">
                        ${r.pricePerDay.toLocaleString("es-MX")} MXN
                      </span>
                    </div>
                    <div className="card-body">
                      <p>
                        <i className="fas fa-user"></i> {r.userName}
                      </p>
                      <p>
                        <i className="fas fa-calendar-alt"></i> {fechaFormateada}
                      </p>
                      <p>
                        <i className="fas fa-clock"></i> {horaFormateada}
                      </p>
                    </div>
                    <div className="card-footer">
                      <span className="total">
                        Total: ${r.totalPrice.toLocaleString("es-MX")} MXN
                      </span>
                      <span className={`status ${estadoClase}`}>{estadoTexto}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
