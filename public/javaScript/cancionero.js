const form = document.getElementById('formCancion');
const botonSubmit = form.querySelector('button[type="submit"]');
const tarjetasCanciones = document.getElementById('tarjetasCanciones');
let editandoID = null;

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
    // Modo de edición: actualizar la canción existente
    const res = await axios.put(`http://localhost:5000/canciones/${editandoID}`, cancion);
    actualizarTarjeta(res.data);
    editandoID = null;
    botonSubmit.textContent = "Añadir Canción";
  } else {
    // Modo de adición: crear una nueva canción
    const res = await axios.post('http://localhost:5000/canciones', cancion);
    agregarTarjeta(res.data);
  }

  form.reset();
});

async function cargarCanciones() {
  const res = await axios.get('http://localhost:5000/canciones');
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
  await axios.delete(`http://localhost:5000/canciones/${id}`);
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
