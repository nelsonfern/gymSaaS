import 'dotenv/config';
import { sendMail } from './services/sendMail.js';

sendMail({
    to: process.env.MAIL_USER,
    subject: "Test correo GymSaaS",
    html: "<h1>Prueba exitosa</h1>"
}).then(() => {
    console.log("¡Correo enviado con éxito localmente!");
    process.exit(0);
}).catch(err => {
    console.error("Falló:", err);
    process.exit(1);
});
