const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./public")));

// Conectar a MongoDB
const miURL = process.env.MONGODB_URI;
mongoose.connect(miURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch((error) => console.error("Error al conectar con MongoDB Atlas:", error));

// Esquema de Canciones
const songSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  album: { type: String, required: true },
  year: { type: Number, required: true },
  coverUrl: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
});

const Song = mongoose.model("Song", songSchema);

// Rutas
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

app.post("/songs", async (req, res) => {
  const newSong = new Song(req.body);
  await newSong.save();
  res.json(newSong);
});

app.delete("/songs/:id", async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.json({ message: "Canción eliminada" });
});

// Modelo de usuario
const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  apodo: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  try {
      const { nombre, apellido, apodo, email, password } = req.body;
      const user = new User({ nombre, apellido, apodo, email, password });
      await user.save();
      res.status(201).send('Usuario registrado con éxito');
  } catch (error) {
      res.status(500).send('Error al registrar el usuario');
  }
});

// Endpoint para verificar login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email, password });
      if (user) {
          res.json({ success: true, message: 'El usuario existe' });
      } else {
          res.json({ success: false, message: 'Lo siento, ese usuario o contraseña no son válidos' });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error en el servidor', error });
  }
});

// Inicializar el servidor en el puerto asignado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
