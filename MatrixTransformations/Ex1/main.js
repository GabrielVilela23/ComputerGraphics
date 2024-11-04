// Seleciona o canvas e o contexto WebGL
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('2d'); // Usaremos 2D para simular WebGL básico

// Variáveis para armazenar os pontos da linha
let startX = 0, startY = 0, endX = 0, endY = 0;
let drawing = false;
let color = 'blue';

// Mapeamento de teclas para cores
const colorMap = {
    '0': 'blue',
    '1': 'red',
    '2': 'green',
    '3': 'purple',
    '4': 'orange',
    '5': 'yellow',
    '6': 'cyan',
    '7': 'magenta',
    '8': 'pink',
    '9': 'brown'
};

// Algoritmo de Bresenham para desenhar a linha
function drawLine(x0, y0, x1, y1) {
    gl.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    gl.fillStyle = color; // Define a cor da linha

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        gl.fillRect(x0, y0, 1, 1); // Desenha um ponto

        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

// Captura o clique do mouse para definir os pontos da linha
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Botão esquerdo do mouse
        if (!drawing) {
            startX = e.offsetX;
            startY = e.offsetY;
            drawing = true;
        } else {
            endX = e.offsetX;
            endY = e.offsetY;
            drawing = false;
            drawLine(startX, startY, endX, endY); // Desenha a linha
        }
    }
});

// Captura a tecla pressionada para mudar a cor
document.addEventListener('keydown', (e) => {
    if (colorMap[e.key] !== undefined) {
        color = colorMap[e.key];
        // Redesenha a linha com a nova cor, se já estiver desenhada
        if (!drawing) {
            drawLine(startX, startY, endX, endY);
        }
    }
});

// Desenha a linha inicial entre os pontos (0,0) e (0,0)
drawLine(startX, startY, endX, endY);
