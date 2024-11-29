require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./public")));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log(err));

const cancionSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true, index: true },
  titulo: String,
  album: String,
  año: Number,
  urlPortada: String,
  urlYoutube: String
});

const Cancion = mongoose.model('Cancion', cancionSchema);

app.get('/canciones', async (req, res) => {
  const canciones = await Cancion.find();
  res.json(canciones);
});

app.post('/canciones', async (req, res) => {
  const ultimaCancion = await Cancion.findOne().sort({ id: -1 });
  const nuevoID = ultimaCancion ? ultimaCancion.id + 1 : 1;

  const nuevaCancion = new Cancion({
    id: nuevoID,
    ...req.body
  });

  await nuevaCancion.save();
  res.json(nuevaCancion);
});

app.put('/canciones/:id', async (req, res) => {
  const { id } = req.params;
  const actualizadaCancion = await Cancion.findOneAndUpdate({ id: id }, req.body, { new: true });
  res.json(actualizadaCancion);
});

app.delete('/canciones/:id', async (req, res) => {
  const { id } = req.params;
  await Cancion.findOneAndDelete({ id: id });
  res.json({ message: 'Cancion eliminada' });
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
