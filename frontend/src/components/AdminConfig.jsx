import React, { useState, useEffect} from 'react';
import { Link,useNavigate} from 'react-router-dom';
import '../css/adminConfig.css';

export default function AdminConfig(){
   const navigate = useNavigate();

    return(       
        <div className = "containerAdminConfig">
            <main className = "mainAdminConfig">
                <h1>Configuración vista cliente</h1>
                <nav className="btnsAdmin">             
                        <Link to="./AdminReservations" className="myBtn" o><span>Ver/Aprobar/Cancelar reservas</span></Link>
                        <Link to="/" className="myBtn"><span>Eliminar reseñas</span></Link>
                        <Link to="/" className="myBtn"><span>Modificar horarios</span></Link>
                        <Link to="./ModifyResType" className="myBtn" ><span>Modificar precios</span></Link>
                </nav>
            </main>
        </div>
    )
}