import React, { useState, useEffect} from 'react';

import '../css/adminReservations.css';

export default function AdminReservations(){
   

    return(         
    <div className="containerAdminReserv">
        <main>
            <h2>Reservas de clientes</h2>
            <div className="chooseResToWatch">
                <div className="activeOp">Activas</div>
                <div className="futureOp">Futuras</div>
                <div className="cancelledOp">Canceladas</div>
                <div className="pastOp">Pasadas</div>
            </div>

            <div className="reservationsTable">
                <div className="columnsNames">
                    <div className="nameTC"><i class="bi bi-person"></i>Nombre</div>
                    <div className="dateTC"><i class="bi bi-calendar2"></i>Fecha</div>
                    <div className="hourTC"><i class="bi bi-clock"></i>Hora</div>
                    <div className="resTypeTC"><i class="bi bi-list-stars"></i>Tipo reserva</div>
                    <div className="cancelTC"><i class="bi bi-x-square"></i>Cancelar</div>
                  
                </div>

                <div className="reservationRow">
                    <div className="nameV">Texto</div>
                    <div className="dateV">Texto</div>
                    <div className="hourV">Texto</div>
                    <div className="resTypeV">Texto</div>
                    <div className="resTypeV"><button className="cancelBTN">CANCELAR</button></div>
                    
                </div>

             
            </div>
        </main>
    </div>

  );
};



