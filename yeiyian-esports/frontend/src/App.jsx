// src/App.jsx
import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './components/Home';    // ya no es “otro App”, es tu Home
import LandingPage from './components/LandingPage';
import Pago from './components/Pago';
import Confirmation from './components/Confirmation';
import ReservationForm from './components/ReservationForm';
import Cotizacion from './components/cotizacion';
import Rules from './components/Rules';
import News from './components/News';
import "./App.css";
// importa cotizacion, rules, tour, etc., según las páginas que tengas

function App() {
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/cotizacion" element={<Cotizacion />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/news" element={<News />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;