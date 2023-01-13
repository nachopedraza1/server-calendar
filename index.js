const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");
require("dotenv").config();

//Crear servidor de Express
const app = express();

//Directorio Publico
app.use(express.static("public"));

//Base de datos
dbConnection();

//Leer y parsear body
app.use(express.json())

//Cors
app.use(cors());

//Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

//Puerto escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en ${process.env.PORT}`);
});