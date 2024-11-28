const form = document.getElementById("songForm");
const tableBody = document.getElementById("songsTable").querySelector("tbody");

// Cargar canciones
async function loadSongs() {
  const response = await fetch("http://localhost:3000/songs");
  const songs = await response.json();
  tableBody.innerHTML = "";
  songs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${song.id}</td>
        <td>${song.title}</td>
        <td>${song.album}</td>
        <td>${song.year}</td>
        <td><img src="${song.coverUrl}" alt="${song.title}" width="100"></td>
        <td><a href="${song.youtubeUrl}" target="_blank">Ver en YouTube</a></td>
        <td>
          <button class="modify-button" data-id="${song.id}">Modificar</button>
          <button onclick="deleteSong('${song._id}')">Eliminar</button>
          </td>
    `;
    tableBody.appendChild(row);
  });
  
}

// Guardar canción
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const song = {};
  formData.forEach((value, key) => {
    song[key] = value;
  });

   const response = await fetch("http://localhost:3000/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song),
  });

  if (response.ok) {
    alert('Usuario registrado con éxito');
    form.reset();
    loadSongs();
} else {
    alert('Hubo un error al registrar al usuario');
}

  form.reset();
  loadSongs();
});


// Eliminar canción
async function deleteSong(id) {
  await fetch(`http://localhost:3000/songs/${id}`, { method: "DELETE" });
  loadSongs();
}



// Inicializar
loadSongs();
