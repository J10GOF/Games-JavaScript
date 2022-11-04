const canvas = document.getElementById('juegoSnake');
const ctx = canvas.getContext('2d');

class ParteSerpiente{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

let velocidad = 7;
let posicionPx = 20;
let tamañoPx = canvas.width / posicionPx - 2;
let cabezaX = 10;
let cabezaY = 10;
let manzanaX = 5;
let manzanaY = 5;
let velocidadX = 0;
let velocidadY = 0;
const parteSerpiente = [];
let largoCola = 2;
let puntos = 0;

const sonidoComer = new Audio("Manzana.mp3");
const sonidoGolpe = new Audio("golpe.mp3");
const sonidoGameOver = new Audio("GameOver.mp3");

//Bucle para renderizar el juego
function dibujaJuego(){
	cambiarPosisonSerpiente();
	let resultado = GameOver();
	if(resultado) {
		return;
	}

	actualizaPantalla();
	comerManzana();
	dibujarManzana();
	dibujarSerpiente();
	mostrarPuntaje();
	// aumentar velocidad
	if(puntos > 4 ) velocidad = 9;
	if(puntos > 9 ) velocidad = 11;
	if(puntos > 14 ) velocidad = 15;
	if(puntos > 19 ) velocidad = 20;
	if(puntos > 24 ) velocidad = 25;
	if(puntos > 39 ) velocidad = 30;
	if(puntos > 49) velocidad = 36;

	setTimeout(dibujaJuego, 1000/velocidad);
}

function GameOver(){
	let perdiste = false;

	if(velocidadY === 0 && velocidadX === 0) return false;

	//Chocar contra las paredes
	if(cabezaX < 0){
	perdiste = true;
	sonidoGolpe.play();
	}
	else if(cabezaX === posicionPx){
		perdiste = true;
		sonidoGolpe.play();
	}
	else if(cabezaY < 0){
		perdiste = true;
		sonidoGolpe.play();
	}
	else if(cabezaY === posicionPx){
		perdiste = true;
		sonidoGolpe.play();
	}

	// Chocar con la cola
	for(let i = 0; i < parteSerpiente.length; i++){
		let part = parteSerpiente[i];
		if(part.x === cabezaX && part.y === cabezaY){
			perdiste = true;
			sonidoGolpe.play();
			break;
		}
	}

	if(perdiste){
		ctx.fillStyle = "white";
		ctx.font = "60px Agency FB";
		ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
		sonidoGameOver.play();
	}
	return perdiste;
}

function mostrarPuntaje(){
	ctx.fillStyle = "white";
	ctx.font = "15px consolas";
	ctx.fillText("Puntaje: " + puntos, canvas.width-100, 20);
}

function actualizaPantalla(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

function dibujarSerpiente(){
	ctx.fillStyle = 'green';
	for(let i = 0; i < parteSerpiente.length; i++){
		let part = parteSerpiente[i];
		ctx.fillRect(part.x * posicionPx, part.y * posicionPx, tamañoPx, tamañoPx);
	}

	parteSerpiente.push(new ParteSerpiente(cabezaX, cabezaY)); // coloco un elemento al final de lista al lado de la cabeza. 
	while (parteSerpiente.length > largoCola){
		parteSerpiente.shift(); // elimino el elemento mas alejado de las partes de la serpiente si se pasa del tamaño de la cola
	}

	ctx.fillStyle = 'orange';
	ctx.fillRect(cabezaX * posicionPx, cabezaY * posicionPx, tamañoPx, tamañoPx);
}

function cambiarPosisonSerpiente(){
	cabezaX = cabezaX + velocidadX;
	cabezaY = cabezaY + velocidadY;
}

function dibujarManzana(){
	ctx.fillStyle = 'red';
	ctx.fillRect(manzanaX * posicionPx, manzanaY * posicionPx, tamañoPx, tamañoPx);
}

function comerManzana(){
	if (manzanaX === cabezaX && manzanaY === cabezaY) {
		manzanaX = Math.floor(Math.random() * posicionPx);
		manzanaY = Math.floor(Math.random() * posicionPx);
		largoCola++;
		puntos++;
		sonidoComer.play();
	}
}

document.body.addEventListener("keydown", keyDown);

//Direcciones con las flechas
function keyDown(event) {
	//Arriba
	if(event.keyCode == 38 || event.keyCode == 87){
		if(velocidadY == 1) return;
		velocidadY = -1;
		velocidadX = 0;
	}

	//Abajo
	if(event.keyCode == 40 || event.keyCode == 83){
		if(velocidadY == -1) return;
		velocidadY = 1;
		velocidadX = 0;
	}

	//Izquierda
	if(event.keyCode == 37 || event.keyCode == 65){
		if(velocidadX == 1) return;
		velocidadY = 0;
		velocidadX = -1;
	}

	//Derecha
	if(event.keyCode == 39 || event.keyCode == 68){
		if(velocidadX == -1) return;
		velocidadY = 0;
		velocidadX = 1;
	}
}

// Boton replay
function Replay(){
	location.reload();
}

dibujaJuego();