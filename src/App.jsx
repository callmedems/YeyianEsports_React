import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ReservationForm from "./components/ReservationForm";
import Cotizacion from "./pages/cotizacion";
import Pago from "./pages/Pago";
import Confirmation from "./pages/Confirmation";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <div style={{ marginTop: "80px", marginBottom: "80px" }}>
              <ReservationForm />
            </div>
          }
        />
        <Route
          path="/cotizacion"
          element={
            <div style={{ marginTop: "80px", marginBottom: "80px" }}>
              <Cotizacion />
            </div>
          }
        />
        <Route
          path="/pago"
          element={
            <div style={{ marginTop: "80px", marginBottom: "80px" }}>
              <Pago />
            </div>
          }
        />
        <Route
          path="/confirmation"
          element={
            <div style={{ marginTop: "80px", marginBottom: "80px" }}>
              <Confirmation />
            </div>
          }
        />
        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
