// ----- App.jsx ----- //

// Importamos React y las librerías para las páginas necesarias
import React from 'react';
import {BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './components/Home';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import ReservationForm from './components/ReservationForm';
import Cotization from './components/Cotization';

// Lateral menu
import Login from './components/Login';
import Register from './components/Register';
import News from './components/News';
import Rules from './components/Rules';
import MyReservations from './components/MyReservations';
import Profile from './components/Profile';
import MeetUs from './components/MeetUs';

/*Componentes del admin */
import AdminConfig from './components/AdminConfig';
import AdminReservations from './components/AdminReservations';
import ModifyResType from './components/ModifyResType';

import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'



// ----- Main Function ----- //
function AppContent() {
  const location = useLocation()
  return (

    <>
      <Navbar />
      <main className="page-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/Reservation" element={<ReservationForm />} />
        <Route path="/Cotization" element={<Cotization />} />
        <Route path="/Confirmation" element={<Confirmation />} />
        <Route path="/Rules" element={<Rules />} />
        <Route path="/News" element={<News />} />
        <Route path="/MyReservations" element={<MyReservations />} />
        <Route path="/Profile" element={<Profile />} />
         <Route path="/MeetUs" element={<MeetUs />} />

         {/* Componentes del admin*/}
        
        <Route
            path="/AdminConfig"
            element={
              <ProtectedRoute>
                <AdminConfig />
              </ProtectedRoute>
            }
          />

        <Route
            path="/AdminConfig/AdminReservations"
            element={
              <ProtectedRoute>
                <AdminReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminConfig/ModifyResType"
            element={
              <ProtectedRoute>
                <ModifyResType />
              </ProtectedRoute>
            }
          />
  
         <Route
            path="/AdminConfig/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
      </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}