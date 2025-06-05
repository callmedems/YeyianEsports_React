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
SMTP_HOST=smtp.gmail.com #Cambiar a smtp.office365.com si usan outlook o investiguen el de su extensión de correo
SMTP_PORT=465
SMTP_USER= #Pongan aquí su correo
SMTP_PASS= #Pongan aquí su contraseña (si su cuenta tiene autenticación en 2 pasos hagan una app password aquí: https://myaccount.google.com/apppasswords y la ponen en este apartado)
EMAIL_FROM="Yeyian Arena" <no-reply@yeyianarena.com>

(Obviamente no añado el archivo porque quedaría en el repositorio público de git y contiene mi correo y contraseña lol)

Sin más que decir les dejo con las indicaciones del uso de React con Vite:

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
