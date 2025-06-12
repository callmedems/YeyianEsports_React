import {useState,useEffect} from 'react';
import '../css/modifyResType.css';


export default function ModifyResType() {
 const [detailsEvent,setDetailsEvent] =useState([])
const icons = [<i className="bi bi-file-earmark-person"></i>,<i className="bi bi-buildings"></i>,<i className="bi bi-controller"></i>,<i className="bi bi-journals"></i>,<i className="bi bi-emoji-laughing"></i>]
  

  useEffect(() => {
      fetch('http://localhost:3000/api/config-event-type')
        .then(response => response.ok ? response.json() : [])
        .then(
          data => {
              setDetailsEvent(data)
          })
        .catch(err => console.error('Error al cargar los eventos:', err));
    }, []);
  

  return (
    <div className="containerModifyResType">
      <h1>Modifica los tipos de evento</h1>
      <div className="contentMRTP">
        {detailsEvent.map((card,index) => (
          <div key={index} className={`cardEvent ${index}`}>
             <div className="icon">{icons[index]}</div> 
            <div className="nameEvent">{card.reservationType}</div>
            <div className="description">{card.pricePerDay}</div>
            <button className="modifyEventBTN">Modificar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
