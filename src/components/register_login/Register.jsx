import React, { useState } from 'react';
import Footer from '../Footer'; //agregar footer y nav responsivos
import './Register.css';



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
    // backend here
    console.log('Registrando...', form);
  };

  return (
    <div className="authContainer">
      <div className="authBox">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <input name="mail" type="email" placeholder="Correo" onChange={handleChange} required />
          <input name="phoneNumber" type="tel" placeholder="Teléfono" onChange={handleChange} />
          <input name="userName" type="text" placeholder="Nombre de usuario" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
          <button type="submit"> <p style={{  color: 'white' }}></p>Crear cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
