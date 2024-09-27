const speed = 2;
const pallete = [
    "#ff8800", "#e124ff", "#6a19ff", "#ff2188", "#00ff00",
    "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff4500",
    "#8a2be2", "#7fff00", "#d2691e", "#cd5c5c", "#4682b4",
    "#5f9ea0", "#ff69b4", "#b0c4de", "#ff1493", "#ffa500",
    "#1e90ff", "#ffb6c1", "#a52a2a", "#ffd700", "#add8e6",
    "#90ee90", "#9370db"
];
let prevColorChoiceIndex = 0;
const dvds = []; // Arreglo para guardar las imágenes de DVD

// Traducciones para el contador según el idioma
const translations = {
    en: "Balls: ",
    es: "Bolas: ",
    fr: "Boules: ",
    de: "Bälle: ",
    it: "Palle: ",
    pt: "Bolas: ",
    // Agrega más idiomas según sea necesario
};

// Obtener el idioma del navegador
const userLang = navigator.language || navigator.userLanguage; 
const langCode = userLang.split('-')[0]; // Obtener solo el código del idioma (por ejemplo, "en" de "en-US")

// Obtener un nuevo color aleatorio
function getNewRandomColor() {
    let colorChoiceIndex;

    do {
        colorChoiceIndex = Math.floor(Math.random() * pallete.length);
    } while (colorChoiceIndex === prevColorChoiceIndex);

    prevColorChoiceIndex = colorChoiceIndex;

    return pallete[colorChoiceIndex];
}

// Función para crear una nueva imagen
const createDvdImage = () => {
    const dvd = document.createElement('img'); // Crear una nueva imagen
    dvd.src = 'obama.gif'; // Cambia esto a la ruta de tu imagen
    dvd.className = 'moving-image'; // Añadir clase para estilos
    document.body.appendChild(dvd); // Añadir la imagen al cuerpo
    dvds.push(dvd); // Agregar la imagen al arreglo

    // Si hay más de 100 pelotas, eliminar la más antigua
    if (dvds.length > 100) {
        const oldestDvd = dvds.shift(); // Eliminar la imagen más antigua
        oldestDvd.remove(); // Eliminarla del DOM
    }

    // Inicializar variables de dirección y posición para esta imagen
    let x = Math.random() * (window.innerWidth - 100); // Posición aleatoria dentro del ancho de la pantalla
    let y = Math.random() * (window.innerHeight - 100); // Posición aleatoria dentro de la altura de la pantalla
    let dirX = Math.random() > 0.5 ? 1 : -1; // Dirección aleatoria en el eje X
    let dirY = Math.random() > 0.5 ? 1 : -1; // Dirección aleatoria en el eje Y
    let collisionCount = 0; // Contador de colisiones

    function animate() {
        const screenHeight = document.body.clientHeight;
        const screenWidth = document.body.clientWidth;

        // Cambiar dirección y color al llegar a los bordes
        if (y + dvd.clientHeight >= screenHeight || y < 0) {
            dirY *= -1; // Cambiar dirección vertical
            collisionCount++; // Incrementar el contador de colisiones

            if (collisionCount < 3) {
                createDvdImage(); // Crear una nueva imagen si no ha chocado 3 veces
            }
        }
        if (x + dvd.clientWidth >= screenWidth || x < 0) {
            dirX *= -1; // Cambiar dirección horizontal
            collisionCount++; // Incrementar el contador de colisiones

            if (collisionCount < 3) {
                createDvdImage(); // Crear una nueva imagen si no ha chocado 3 veces
            }
        }

        // Si el contador de colisiones es 3, aplicar el efecto de explosión y eliminar la imagen
        if (collisionCount >= 3) {
            dvd.classList.add('explode'); // Añadir la clase de explosión

            // Esperar a que termine la animación antes de eliminar la imagen
            setTimeout(() => {
                dvd.remove(); // Eliminar la imagen después del efecto
                dvds.splice(dvds.indexOf(dvd), 1); // Eliminarla del arreglo
            }, 500); // Tiempo de espera debe coincidir con la duración de la animación
            return; // Salir de la función
        }

        // Si la imagen sale de la pantalla, eliminarla
        if (x + dvd.clientWidth < 0 || x > screenWidth || y + dvd.clientHeight < 0 || y > screenHeight) {
            dvd.remove(); // Eliminar la imagen si sale de la pantalla
            dvds.splice(dvds.indexOf(dvd), 1); // Eliminarla del arreglo
            return; // Salir de la función
        }

        // Actualizar la posición
        x += dirX * speed;
        y += dirY * speed;
        dvd.style.left = x + "px";
        dvd.style.top = y + "px";

        // Solicitar el siguiente frame
        window.requestAnimationFrame(animate);
    }

    animate(); // Iniciar la animación
}

// Función para explotar todas las imágenes
const explodeAll = () => {
    dvds.forEach(dvd => {
        dvd.classList.add('explode'); // Añadir la clase de explosión
        setTimeout(() => {
            dvd.remove(); // Eliminar la imagen después del efecto
        }, 500); // Tiempo de espera debe coincidir con la duración de la animación
    });
    dvds.length = 0; // Vaciar el arreglo
    updateCounter(); // Actualizar el contador
}

// Detección del código Konami
let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            explodeAll(); // Explota todas las imágenes
            konamiIndex = 0; // Reiniciar el índice
        }
    } else {
        konamiIndex = 0; // Reiniciar si hay un error en la secuencia
    }
});

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.querySelector('audio'); // Selecciona el primer elemento <audio>

    // Escuchar el clic en el botón
    document.getElementById('checkVideoButton').addEventListener('click', function() {
        // Ocultar el botón
        this.style.display = 'none';

        // Reproducir la música
        audioElement.play().catch(function(error) {
            console.log('Error al intentar reproducir el audio:', error);
        });

        // Crear la imagen de DVD
        createDvdImage();

        // Cambiar el color del fondo
        setInterval(() => {
            document.body.style.backgroundColor = getNewRandomColor();
        }, 500);
    });
});
