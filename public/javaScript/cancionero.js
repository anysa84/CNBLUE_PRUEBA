const form = document.getElementById('formCancion');
const botonSubmit = form.querySelector('button[type="submit"]');
const tarjetasCanciones = document.getElementById('tarjetasCanciones');
let editandoID = null;

// Definir la URL base según el entorno
const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://cnblue-prueba.onrender.com';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cancion = {
    titulo: document.getElementById('titulo').value,
    album: document.getElementById('album').value,
    año: document.getElementById('año').value,
    urlPortada: document.getElementById('urlPortada').value,
    urlYoutube: document.getElementById('urlYoutube').value,
  };

  if (editandoID) {
    const res = await axios.put(`${baseURL}/canciones/${editandoID}`, cancion);
    actualizarTarjeta(res.data);
    editandoID = null;
    botonSubmit.textContent = "Añadir Canción";
  } else {
    const res = await axios.post(`${baseURL}/canciones`, cancion);
    agregarTarjeta(res.data);
  }

  form.reset();
});

async function cargarCanciones() {
  const res = await axios.get(`${baseURL}/canciones`);
  res.data.forEach(cancion => agregarTarjeta(cancion));
}

function agregarTarjeta(cancion) {
  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarjeta');
  tarjeta.setAttribute('data-id', cancion.id);

  tarjeta.innerHTML = `
    <h3>ID: ${cancion.id}</h3>
    <h2>${cancion.titulo}</h2>
    <p><strong>Álbum:</strong> ${cancion.album}</p>
    <p><strong>Año:</strong> ${cancion.año}</p>
    <img src="${cancion.urlPortada}" alt="Portada">
    <p><a href="${cancion.urlYoutube}" target="_blank">Ver en YouTube</a></p>
    <div class="acciones">
      <button onclick="eliminarCancion('${cancion.id}')">Eliminar</button>
      <button onclick="cargarCancionEnFormulario('${cancion.id}')">Modificar</button>
    </div>
  `;

  tarjetasCanciones.appendChild(tarjeta);
}

function actualizarTarjeta(cancion) {
  const tarjeta = document.querySelector(`[data-id='${cancion.id}']`);
  tarjeta.querySelector('h2').textContent = cancion.titulo;
  tarjeta.querySelectorAll('p')[0].innerHTML = `<strong>Álbum:</strong> ${cancion.album}`;
  tarjeta.querySelectorAll('p')[1].innerHTML = `<strong>Año:</strong> ${cancion.año}`;
  tarjeta.querySelector('img').src = cancion.urlPortada;
  tarjeta.querySelector('a').href = cancion.urlYoutube;
}

async function eliminarCancion(id) {
  await axios.delete(`${baseURL}/canciones/${id}`);
  document.querySelector(`[data-id='${id}']`).remove();
}

function cargarCancionEnFormulario(id) {
  const tarjeta = document.querySelector(`[data-id='${id}']`);
  document.getElementById('titulo').value = tarjeta.querySelector('h2').textContent;
  document.getElementById('album').value = tarjeta.querySelectorAll('p')[0].innerHTML.split('Álbum:</strong> ')[1];
  document.getElementById('año').value = tarjeta.querySelectorAll('p')[1].innerHTML.split('Año:</strong> ')[1];
  document.getElementById('urlPortada').value = tarjeta.querySelector('img').src;
  document.getElementById('urlYoutube').value = tarjeta.querySelector('a').href;

  editandoID = id;
  botonSubmit.textContent = "Modificar Canción";
}

cargarCanciones();
