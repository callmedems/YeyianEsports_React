// src/App.jsx
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'
import Home from './components/Home'
import Payment from './components/Payment'
import Confirmation from './components/Confirmation'
import ReservationForm from './components/ReservationForm'
import Cotization from './components/Cotization'
import Login from './components/Login'
import Register from './components/Register'
import News from './components/News'
import Rules from './components/Rules'
import MyReservations from './components/MyReservations'
import Profile from './components/Profile'
import MeetUs from './components/MeetUs'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId')
    if (!sessionId) return
    fetch('http://localhost:3000/api/track/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: parseInt(sessionId, 10), page: location.pathname })
    })
  }, [location.pathname])

  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionId = localStorage.getItem('sessionId')
      if (!sessionId) return
      navigator.sendBeacon(
        'http://localhost:3000/api/track/session-end',
        JSON.stringify({ sessionId: parseInt(sessionId, 10) })
      )
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

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
          <Route
            path="/admin"
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
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
