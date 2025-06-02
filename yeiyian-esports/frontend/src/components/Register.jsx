import React, { useState } from 'react';

import '../css/Register.css';

const Register = () => {
  const [form, setForm] = useState({
    mail: '',
    phoneNumber: '',
    userName: '',
    password: '',
    profilePicture: ''
  });

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
      .then(res => {
        if (!res.ok) throw new Error('Error al registrar cuenta');
        return res.json();
      })
      .then(() => {
        alert('¡Se ha registrado tu cuenta!');
        setForm({ //se reinicia la info del forms para cuando se cree otra cuenta
          mail: '',
          phoneNumber: '',
          userName: '',
          password: '',
          profilePicture: ''
        });
        // Recargar reseñas
      })
      .catch(err => {
        console.error(err);
        alert('No se pudo enviar registrar la cuenta');
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
          <button type="submit"> <p style={{  color: 'white' }}>Crear cuenta</p></button>
        </form>
      </div>
    </div>
  );
};

export default Register;
