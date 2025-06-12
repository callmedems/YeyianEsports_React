import React, { useState, useEffect} from 'react';

import '../css/adminReservations.css';

export default function AdminReservations(){
    const [selectedFilter, setSelectedFilter] = useState('active'); //para ver qué reservas quiere ver el admin en ese momento (si activas, canceladas, futuras o pasadas)
    const [allReservations,setAllReservations] = useState([])

    const handleSelectedFilter = (filter) => {
        setSelectedFilter(filter);
        console.log("Filtro seleccionado:", filter);
        // Aquí después puedes hacer el fetch a tu backend con este filtro
    }

    useEffect(() => {
        fetch(`http://localhost:3000/api/config-reservations?filter=${selectedFilter}`)
            .then(res => res.json())
            .then(data => {
                console.log("DATOS",data)
            setAllReservations(data);
        });
    }, [selectedFilter])

    const handleCancelReservation = (reservationId) => {
        if (window.confirm("¿Seguro que deseas cancelar esta reserva?")) {
            fetch(`http://localhost:3000/api/config-reservations/cancel/${reservationId}`, {
                method: 'PUT'
            })
            .then(res => res.json())
            .then(data => {
                console.log("Reserva cancelada:", data);
                  const updatedReservations = allReservations.filter(r => r.reservationId !== reservationId);
                setAllReservations(updatedReservations);
                setSelectedFilter(selectedFilter); 
            })
            .catch(err => {
                console.error("Error al cancelar reserva:", err);
            });
        }
    }



    

    return(         
    <div className="containerAdminReserv">
        <main>
            <h2>Reservas de clientes</h2>
            <div className="chooseResToWatch">
                <div  
                    className={selectedFilter === 'active' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('active')} 
                > En curso</div> {/*aqui si el filtro seleccionado fue activas, le pone la clase activeFilter para cambiar el css*/}

                <div
                    className={selectedFilter === 'future' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('future')}
                > Futuras</div>

                <div
                    className={selectedFilter === 'cancelled' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('cancelled')}
                >Canceladas</div>

                <div
                    className={selectedFilter === 'past' ? "filterOption activeFilter" : "filterOption"}
                    onClick={() => handleSelectedFilter('past')}
                >Pasadas</div>

            </div>

            <div className="reservationsTable">
                <div className="columnsNames">
                    <div className="mailTC"><i className="bi bi-person"></i>Correo</div>
                    <div className="dateTC"><i className="bi bi-calendar2"></i>Fecha</div>
                    <div className="hourTC"><i className="bi bi-clock"></i>Hora</div>
                    <div className="resTypeTC"><i className="bi bi-list-stars"></i>Tipo reserva</div>
                    <div className="cancelTC"><i className="bi bi-x-square"></i>Cancelar</div>
                  
                </div>

                


                {allReservations.map((r, index) => (
                    <div className="reservationRow" key={index}>
                        <div className="nameV">{r.clientMail}</div>
                        <div className="dateV">{new Date(r.reservationDate).toLocaleDateString()}</div>
                        <div className="hourV">{r.reservationTime}</div>
                        <div className="resTypeV">{r.reservationType}</div>
                        <div className="resTypeV">
                            {selectedFilter === 'cancelled' 
                                ? <span className="cancelText">Cancelada</span> 
                                : <button className="cancelBTN"  onClick={() => handleCancelReservation(r.reservationId)}>CANCELAR</button>
                            }
                        </div>
                    </div>
                ))}




                    
          

             
            </div>
        </main>
    </div>

  );
};



