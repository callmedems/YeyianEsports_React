# Puntos Importantes para Ejecutarse
Aún no he especificado bien en "migrations/###create_tables.cjs" como quedaron las tablas, pero para que las tablas se coordinen bien con el proyecto deben de escribir esto en el Script de <arenareservations> en su base de datos en DBeaver:
1. Añadir que el correo sea único para que funcione con los logins en "client":
ALTER TABLE client
ADD CONSTRAINT unique_client_mail UNIQUE (mail);

2. Insertar la información del costo de reserva en "reservationcosts":
INSERT INTO reservationcosts (reservationTypeId, reservationType, pricePerDay) VALUES
  (1, 'Individual', 1500.00),
  (2, 'Corporativo', 8000.00),
  (3, 'Streamer', 5000.00),
  (4, 'Educativo', 4500.00),
  (5, 'Escolar', 4000.00);

3. Añaden reservationTime ya que este será el dato que se extraerá para el frontend de confirmación:
ALTER TABLE reservation
ADD COLUMN reservationTime TIME NOT NULL;

--- DBeaver es muy delicado con los errores de sintaxis, en caso que les de error copiando el código escríbanlo a mano.


4. En el directorio de "backend" deben de crear un archivo ".env" donde van a poner los datos de su correo y contraseña para tener un correo de referencia el cual enviar, esto debe incluir:

STRIPE_SECRET_KEY= (Deben de crear una cuenta y agregar sus Public Key en: Payment.jsx línea 143, y en: .env en esta misma línea que inserten)

SMTP_HOST=smtp.gmail.com #Cambiar a smtp.office365.com si usan outlook o investiguen el de su extensión de correo
SMTP_PORT=465
SMTP_USER= #Pongan aquí su correo
SMTP_PASS= #Pongan aquí su contraseña (si su cuenta tiene autenticación en 2 pasos hagan una app password aquí: https://myaccount.google.com/apppasswords y la ponen en este apartado)
EMAIL_FROM="Yeyian Arena" <no-reply@yeyianarena.com>

(Obviamente no añado el archivo porque quedaría en el repositorio público de git y contiene mi correo y contraseña lol)

Sin más que decir les dejo con las indicaciones del uso de React con Vite que ya teníamos:

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Para correr la parte más reciente (brau+ana), hacer modificaciones a la base de datos:
- Modificar tabla de admin
```sql
ALTER TABLE admin
CHANGE COLUMN gmail mail VARCHAR(100),
ADD COLUMN profilePicture VARCHAR(255);
```

- Agregar un admin: (si quieren pueden poner su correo en el gmail para hacer pruebas)

```sql
insert into admin(adminId, gmail, username, password) VALUES(1, "anajmz345@gmail.com", "adminArena", "chivas123" )

```

- Agregar la info de los videojuegos:
```sql
INSERT INTO game (gameName, thumbnailImage, releaseDate, genre, lore, adminId) VALUES
('Fall Guys', 'fallguys.jpg', '2020-08-04', 'Party', 'Un battle royale de obstáculos caóticos y coloridos.', 1),
('FIFA 24', 'fifa24.jpg', '2023-09-29', 'Sports', 'Simulación de fútbol con licencias oficiales.', 1),
('Fortnite', 'fortnite.jpg', '2017-07-25', 'Battle Royale', 'Lucha para ser el último en pie en un mundo colorido.', 1),
('Mario Kart 8 Deluxe', 'mariokart8.jpg', '2017-04-28', 'Racing', 'Compite con tus personajes favoritos de Nintendo.', 1),
('Mario Strikers: Battle League', 'mariostrikers.jpg', '2022-06-10', 'Sports', 'Fútbol al estilo caótico del universo Mario.', 1),
('Mario Tennis Aces', 'mariotennis.jpg', '2018-06-22', 'Sports', 'Tennis arcade con personajes de Mario.', 1),
('Call of Duty: Warzone', 'warzone.jpg', '2020-03-10', 'FPS', 'Battle royale militar de alta intensidad.', 1),
('League of Legends', 'lol.jpg', '2009-10-27', 'MOBA', 'Juego de estrategia en equipo con campeones únicos.', 1),
('Minecraft', 'minecraft.jpg', '2011-11-18', 'Sandbox', 'Construcción, supervivencia y creatividad infinita.', 1),
('Valorant', 'valorant.jpg', '2020-06-02', 'FPS', 'Shooter táctico por equipos con habilidades.', 1);
```