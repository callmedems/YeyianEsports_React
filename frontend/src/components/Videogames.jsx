import '../css/videogames.css';


export default function Videogames(){
    return(
        <section className="gamesContainer">
            <header>
                <h1>Explora nuestros videojuegos</h1>
            </header>

            <div className="carousel">
                <i className="bi bi-arrow-left-circle controllers"></i>

                <div className="card" id="game1">
                <img src="assets/images/godofwar.jpeg" alt="Juego 1" />
                <div className="gameInfo">
                    <h3>God of War</h3>
                    <p>Eres un dios, ¿ahora qué sigue?</p>
                </div>
                </div>

                <div className="card" id="game2">
                <img src="assets/images/thelastofus.jpeg" alt="Juego 2" />
                <div className="gameInfo">
                    <h3>The Last of Us</h3>
                    <p>Zombies + venganza = depresión.</p>
                </div>
                </div>

                <div className="card" id="game3">
                <img src="assets/images/cod.jpeg" alt="Juego 3" />
                <div className="gameInfo">
                    <h3>Call of Duty</h3>
                    <p>Un clásico para disparar.</p>
                </div>
                </div>

                <i className="bi bi-arrow-right-circle controllers"></i>
            </div>
        </section>
    );
}
