// src/pages/Pricing.jsx

import React, { useEffect, useState } from "react";
import "../css/pricing.css";

const Pricing = () => {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Al montar, bajamos los datos desde /api/reservationcosts
    const fetchCosts = async () => {
      try {
        const resp = await fetch("http://localhost:3000/api/reservationcosts");
        if (!resp.ok) throw new Error("No se pudieron cargar los precios.");
        const data = await resp.json();
        setCosts(data);
      } catch (err) {
        console.error("Error fetchCosts:", err);
        setError("Hubo un problema al cargar los precios. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCosts();
  }, []);

  return (
    <div className="pricing-page">
      <h1 className="pricing-title">Nuestros Precios</h1>

      {loading && <p className="loading-text">Cargando precios…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="pricing-grid">
          {costs.map((item) => (
            <div key={item.reservationTypeId} className="pricing-card">
              <div className="card-header">
                {/* ícono o ilustración opcional */}
                <svg
                  className="card-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                >
                  <circle cx="32" cy="32" r="30" fill="none" stroke="#8A2BE2" strokeWidth="2"/>
                  <path d="M32 16 L32 36 M32 44 L32 44" stroke="#8A2BE2" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                <h2 className="card-title">{item.reservationType}</h2>
              </div>
              <div className="card-body">
                <p className="card-price">${item.pricePerDay.toLocaleString("es-MX")} MXN</p>
                <p className="card-label">por día</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pricing;
