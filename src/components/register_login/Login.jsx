import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
//agregar footer y nav responsivos


const Login = () => {
  const [form, setForm] = useState({ mail: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validacion del login (despues)
    console.log('Iniciando sesión...', form);

    // Redirección simulada
    navigate('/reservations');
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input name="mail" type="email" placeholder="Correo" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
          <button type="submit">Entrar</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'white' }}>
          ¿No tienes cuenta? <a href="/Register" style={{ color: 'var(--color-estrellas)' }}>Regístrate</a>
        </p>
      </div>
    </div>
  );
};



export default Login;
