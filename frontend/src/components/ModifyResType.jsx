import { useState, useEffect } from 'react';
import '../css/modifyResType.css';

export default function ModifyResType() {
  const [detailsEvent, setDetailsEvent] = useState([]);
   const [editingIndex, setEditingIndex] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const cardsColors = ['#FF512F', '#9733EE', '#00FFA2', '#2948ff', '#ee0979'];

  const icons = [
    <i className="bi bi-file-earmark-person"></i>,
    <i className="bi bi-buildings"></i>,
    <i className="bi bi-controller"></i>,
    <i className="bi bi-journals"></i>,
    <i className="bi bi-emoji-laughing"></i>
  ];

  useEffect(() => {
    fetch('http://localhost:3000/api/config-event-type')
      .then(response => response.ok ? response.json() : [])
      .then(data => {
        setDetailsEvent(data);
      })
      .catch(err => console.error('Error al cargar los eventos:', err));
  }, []);
  const handleModifyClick = (index) => {
    setEditingIndex(index);
    setNewPrice(detailsEvent[index].pricePerDay);
  };

  const handleSave = (reservationTypeId) => {
    fetch(`http://localhost:3000/api/config-event-type/${reservationTypeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pricePerDay: newPrice })
    })
      .then(res => res.json())
      .then(() => {
        const updated = [...detailsEvent];
        updated[editingIndex].pricePerDay = newPrice;
        setDetailsEvent(updated);
        setEditingIndex(null);
      })
      .catch(err => console.error('Error al actualizar precio:', err));
  };

  const hexToRGBA = (hex, alpha) => {
    let r = 0, g = 0, b = 0;

    // Si es formato corto (#FFF)

    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
    

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div className="containerModifyResType">
      <h1>Modifica los precios</h1>
      <div className="contentMRTP">
        {detailsEvent.map((card, index) => (
          <div 
            key={index} 
            className="cardEvent"
            style={{ borderColor: cardsColors[index] }}
          >
            <div className="icon">{icons[index]}</div>
            <div 
              className="nameEvent"
              style={{ color: cardsColors[index] }}
            >
              {card.reservationType}
            </div>
            <div className="description">{card.pricePerDay} pesos</div>
              {editingIndex === index && (
                <div>
                  <input
                    type="number"
                    className="inputPrice"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Nuevo precio"
                    style={{
                      backgroundColor: hexToRGBA(cardsColors[index], 0.6),
                      color: index === 2 ? 'black' : 'white',
                      
                    }}
                  />
                  <button 
                  className ="saveEventBTN"
                  style={{
                    backgroundColor: cardsColors[index],
                    color: index === 2 ? 'black' : 'white',
                    opacity: 0.8
                  }}
                  onMouseOver={(e) => e.target.style.boxShadow = `0 0 20px ${cardsColors[index]}`}
                  onMouseOut={(e) => e.target.style.boxShadow = 'none'}
                  onClick={() => handleSave(card.reservationTypeId)}>
                    Guardar
                  </button>
                </div>
              )}

            {editingIndex !== index && (
              <button
                className="modifyEventBTN"
                style={{
                  backgroundColor: cardsColors[index],
                  color: index === 2 ? 'black' : 'white'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = `0 0 20px ${cardsColors[index]}`}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
                onClick={() => handleModifyClick(index)}
              >
                Modificar
              </button>
            )}
          </div>
        ))}
       
      </div>
    </div>
  );
}
