// src/App.jsx
import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './components/Home';    // ya no es “otro App”, es tu Home
import LandingPage from './components/LandingPage';
import Payment from './components/Payment';
import Reservation from './components/Reservation';
import Cotization from './components/Cotization';
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
        <Route path="/payment" element={<Payment />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/cotization" element={<Cotization />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/news" element={<News />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;