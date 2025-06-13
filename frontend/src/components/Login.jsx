// ----- Login.jsx ----- //
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/register.css';

const Login = () => {
  const [form, setForm] = useState({ mail: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1) Llamas al backend para verificar credenciales:
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
      })
      .then((data) => {
        console.log('→ Login res.json →', data);
        // 2) Guardas el token (o la bandera) en localStorage
        
        localStorage.setItem('reserva', data.token || 'true');
       

        if(data.fullPermits === true){
          
          localStorage.setItem('adminId', data.adminId);
          
        }
        else{
          localStorage.setItem('clientId', data.clientId);
        }
       
        localStorage.setItem('reservaUserName', data.userName);
        localStorage.setItem('navbarProfilePicture', data.profilePicture);

        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('isAdmin', data.isAdmin);  /*POSIBLE PROBLEMA */

        // 3) Rediriges inmediatamente a "/"
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        alert('Email o contraseña incorrectos');
      });
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input name="mail" type="email" placeholder="Correo" onChange={handleChange} required/>
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required/>
          <button type="submit">Entrar</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'white' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--color-estrellas)' }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
