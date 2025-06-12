import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import '../css/admin-dashboard.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  if (!stats) return <div className="loading">Cargando estadísticas…</div>

  const COLORS = ['#00C49F', '#FF8042', '#8884D8', '#FFBB28']

  return (
    <div className="admin-dashboard">
      <h1>Hola, Administrador</h1>

      <div className="card-grid">
        <div className="card">
          <h2>Usuarios Totales</h2>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="card">
          <h2>Tiempo Promedio (min)</h2>
          <p>
            {stats.avgSessionDuration != null
              ? Number(stats.avgSessionDuration).toFixed(1)
              : '0.0'}
          </p>
        </div>
      </div>

      <section className="charts-section">
        {stats.byGender && (
          <div className="chart-card">
            <h3>Usuarios por Género</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.byGender}
                  dataKey="count"
                  nameKey="gender"
                  outerRadius={80}
                >
                  {stats.byGender.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats.byAgeRange && (
          <div className="chart-card">
            <h3>Usuarios por Rango de Edad</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.byAgeRange}>
                <XAxis dataKey="ageRange" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats.clicksByGame && (
          <div className="chart-card">
            <h3>Clicks por Juego</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.clicksByGame}>
                <XAxis dataKey="gameName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="table-section">
        <h3>Detalle de Sesiones Recientes</h3>
        <table>
          <thead>
            <tr>
              <th># Sesión</th>
              <th>Usuario</th>
              <th>Inicio</th>
              <th>Duración (min)</th>
            </tr>
          </thead>
          <tbody>
            {stats.sessions &&
              stats.sessions.map(s => (
                <tr key={s.sessionId}>
                  <td>{s.sessionId}</td>
                  <td>{s.userName}</td>
                  <td>{new Date(s.startTime).toLocaleString()}</td>
                  <td>{s.durationMin}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
