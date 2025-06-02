// src/App.jsx
import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './components/Home';    // ya no es “otro App”, es tu Home

import Pago from './components/Pago';
import ReservationForm from './components/ReservationForm';
import Cotization from './components/cotizacion';
import Rules from './components/Rules';
import News from './components/News';
import "./App.css";
// importa cotizacion, rules, tour, etc., según las páginas que tengas

function App() {
  
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/payment" element={<Pago />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/cotizacion" element={<Cotization />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/news" element={<News />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;