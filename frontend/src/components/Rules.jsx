// src/pages/Rules.jsx
import React from 'react';
import '../css/Rules.css';

const rulesList = [
  "Para hacer uso de la arena se le pide de favor realizar el pago de la reservación antes del ingreso de cualquier usuario. Sin realizar el pago previamente se le negará el acceso.",
  "Hacer uso adecuado del equipo perteneciente a la arena Yeyian. En caso de cualquier afección a este equipo, se le aplicará una multa proporcional al deterioro, determinado por el personal de la arena.",
  "No sacar ningún equipo o accesorio presente en la arena. En caso de ser sorprendido, será amonestado y expulsado completamente de los servicios.",
  "Queda prohibido el ingreso de cualquier tipo de sustancia para adultos. En caso de ser sorprendido, será amonestado y expulsado de la arena.",
  "Dejar el espacio libre cuando llegue la hora en la que termina la reserva. Se recomienda que todos los usuarios dejen de jugar 5 minutos antes de finalizar la experiencia."
];

const Rules = () => (
  <div className="rulesPage">
    <div className="rulesHeader">
      <h1>Reglamento de Arena Yeyian</h1>
      <p>Por favor, lee y acepta las siguientes normas antes de jugar.</p>
    </div>
    <ul className="rulesGrid">
      {rulesList.map((text, i) => (
        <li key={i} className="ruleCard">
          <div className="ruleNumber">{i+1}</div>
          <p className="ruleText">{text}</p>
        </li>
      ))}
    </ul>
    <div className="rulesFooter">
      <button className="acceptBtn" onClick={() => window.location.href = '/'}>¡Acepto y Continuar!</button>
    </div>
  </div>
);

export default Rules;
