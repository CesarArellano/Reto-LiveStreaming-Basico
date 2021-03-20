let imgPlay = document.querySelector('#play');
let imgBlackScreen = document.querySelector('#blackScreen');
let socket = io();

// Ocultamos la img hasta que recibamos el flujo de imágenes.
imgPlay.style.display = 'none';

// Se llama hasta que se emita el directo.
socket.on('stream', (image) => {
  imgBlackScreen.style.display = 'none';  
  imgPlay.style.display = 'block'; 
  imgPlay.src = image; 
});

