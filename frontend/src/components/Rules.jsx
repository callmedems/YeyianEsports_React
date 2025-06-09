// src/pages/Rules.jsx
import React from 'react';
import '../css/rules.css';

const Rules = () => (
    <>
    <div className="backgroundOverlay"></div>
    <main className="rulesMainContainer">
        <h1 className="mainTitle">Reglamento</h1>
        <p>1. Para hacer uso de la arena se le pide de favor realizar el pago de la reservación antes del ingreso de cualquier usuario. Sin realizar el pago previamente se le negará el acceso.</p>
        <p>2. Hacer uso adecuado del equipo perteneciente a la arena Yeyian. En caso de cualquier afección a este equipo, se le aplicará una multa proporcional al deterioro, determinado por el personal de la arena.</p>
        <p>3. No sacar ningún equipo o accesorio presente en la arena. En caso de ser sorprendido, será amonestado y expulsado completamente de los servicios.</p>
        <p>4. Queda prohibido el ingreso de cualquier tipo de sustancia para adultos. En caso de ser sorprendido, será amonestado y expulsado de la arena.</p>
        <p>5. Dejar el espacio libre cuando llegue la hora en la que termina la reserva. Se recomienda que todos los usuarios dejen de jugar 5 minutos antes de finalizar la experiencia.</p>
        <section className="buttonContainer">
            <a href="/">
                <span className="aceptButton">¡Acepto!</span>
            </a>
        </section>
    </main>
  </>
);

export default Rules;
