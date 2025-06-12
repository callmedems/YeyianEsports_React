import React, { useState, useEffect} from 'react';

import '../css/adminReservations.css';

export default function AdminReservations(){
    const [selectedFilter, setSelectedFilter] = useState('Activas'); //para ver qué reservas quiere ver el admin en ese momento (si activas, canceladas, futuras o pasadas)
    const handleSelectedFilter = (filter) => {
        setSelectedFilter(filter);
        console.log("Filtro seleccionado:", filter);
        // Aquí después puedes hacer el fetch a tu backend con este filtro
    }

    return(         
    <div className="containerAdminReserv">
        <main>
            <h2>Reservas de clientes</h2>
            <div className="chooseResToWatch">
                <div  
                    className={selectedFilter === 'Activas' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('Activas')} 
                > Activas</div> {/*aqui si el filtro seleccionado fue activas, le pone la clase activeFilter para cambiar el css*/}

                <div
                    className={selectedFilter === 'Futuras' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('Futuras')}
                > Futuras</div>

                <div
                    className={selectedFilter === 'Canceladas' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('Canceladas')}
                >Canceladas</div>

                <div
                    className={selectedFilter === 'Pasadas' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('Pasadas')}
                >Pasadas</div>

            </div>

            <div className="reservationsTable">
                <div className="columnsNames">
                    <div className="nameTC"><i className="bi bi-person"></i>Nombre</div>
                    <div className="dateTC"><i className="bi bi-calendar2"></i>Fecha</div>
                    <div className="hourTC"><i className="bi bi-clock"></i>Hora</div>
                    <div className="resTypeTC"><i className="bi bi-list-stars"></i>Tipo reserva</div>
                    <div className="cancelTC"><i className="bi bi-x-square"></i>Cancelar</div>
                  
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



