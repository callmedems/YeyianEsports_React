// ----- Register.jsx ----- //
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mail: '',
    phoneNumber: '',
    userName: '',
    password: '',
    profilePicture: '',
    dateOfBirth: '',
    gender: ''
  });
  const [showBanner, setShowBanner]=useState(false);
  const [showRegisterBanner, setShowRegisterBanner]=useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!form.mail.includes('@')) {
    alert('Debes escribir un correo válido.');
    return;
  }

  fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  })
    .then((res) => {
      if (!res.ok) throw new Error('Error al registrar cuenta');
      return res.json();
    })
    .then((data) => {
      console.log('Cuenta creada correctamente, ahora hacemos login automático...');
      alert("Tu cuenta se ha registrado exitosamente")
      
      // Ahora hacemos login con las mismas credenciales:
      return fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mail: form.mail,
          password: form.password
        }),
      });
    })
    .then((res) => {
      if (!res.ok) throw new Error('Error al iniciar sesión después de registrarse');
      return res.json();
    })
    .then((data) => {
      // Mismo manejo que tu Login.jsx actual:
      localStorage.setItem('reserva', data.token || 'true');
      if (data.fullPermits === true) {
        localStorage.setItem('adminId', data.adminId);
      } else {
        localStorage.setItem('clientId', data.clientId);
      }
      localStorage.setItem('reservaUserName', data.userName);
      localStorage.setItem('navbarProfilePicture', data.profilePicture);
      localStorage.setItem('sessionId', data.sessionId);
      localStorage.setItem('isAdmin', data.isAdmin);

      // Ya estamos logueados, redirigimos:
      navigate('/');
    })
    .catch(err => {
      console.error(err);
      alert('No se pudo registrar e iniciar sesión');
    });
};

    // backend here
    console.log('Registrando...', form);
  

  return (
    <div className="authContainer">
     <div className="authBox">
        <h2>Registrarse</h2>
        
        <form onSubmit={handleSubmit}>
          <input name="mail" type="email" placeholder="Correo" onChange={handleChange} required />
          <input name="phoneNumber" type="tel" placeholder="Teléfono" onChange={handleChange} />
          <input name="userName" type="text" placeholder="Nombre de usuario" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
          <label>Fecha de nacimiento</label>
          <input
            name="dateOfBirth"
            type="date"
            onChange={handleChange}
            required
          />
           <label>Género</label>
          <select name="gender" onChange={handleChange} required>
            <option value="">Selecciona...</option>
            <option value="Male">Masculino</option>
            <option value="Female">Femenino</option>
            <option value="Other">Otro</option>
          </select>

          <button type="submit"> <p style={{  color: 'white' }}>Crear cuenta</p></button>
        </form>
        {showBanner && (
          <div className="success-banner">
            Cuenta registrada con éxito
          </div>
        )}

      </div>

      
      

    </div>
  );
};

export default Register;
