import '../css/videogames.css';
import React, { useState, useRef, useEffect } from 'react';

export default function Videogames(){
    const [videogames, setVideogames] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3000/api/videogames')
          .then(response => response.ok ? response.json() : [])
          .then(
            data => {
                setVideogames(data)
                //Gives functionality to carrousel buttons
                var swiper = new Swiper(".swiperVideogames", {
                    effect: "coverflow",
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: "auto",
                    coverflowEffect: {
                        rotate: 15,
                        stretch: 0,
                        depth: 300,
                        modifier: 1,
                        slideShadows: true,
                    },
                    loop:true,
                    
                    
                });
            })
          .catch(err => console.error('Error al cargar los videojuegos:', err));
      }, []);
    return(
        <section className="gamesContainer">
            <header>
                <h1>Explora nuestros videojuegos</h1>
            </header>
                <div className="swiper swiperVideogames">
                    
                    <div className="swiper-wrapper videogames"> 
                        {videogames.map((g, index) => (
                        
                            <div className="swiper-slide videogames" key={index}>
                                <img src={"http://localhost:3000/uploads/games/"+g.thumbnailImage}></img>
                            </div>
                        ))}
                    </div>
                          
            </div>


            
        </section>
    );
}
