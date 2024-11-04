// Seleciona o canvas e o contexto WebGL
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('2d'); // Usaremos 2D para simular WebGL básico

// Variáveis para armazenar o estado e configurações
let startX = 0, startY = 0, endX = 0, endY = 0;
let vertices = []; // Armazena os vértices para o triângulo
let drawing = false;
let color = 'blue';
let mode = 'line'; // Modo inicial: 'line' para linha, 'triangle' para triângulo

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

// Algoritmo de Bresenham para desenhar uma linha
function drawLine(x0, y0, x1, y1) {
    gl.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    gl.fillStyle = color; // Define a cor

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

// Função para desenhar um triângulo (usa Bresenham para cada aresta)
function drawTriangle(vertices) {
    gl.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    gl.fillStyle = color; // Define a cor

    // Traça as três linhas que formam o triângulo
    drawLine(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y);
    drawLine(vertices[1].x, vertices[1].y, vertices[2].x, vertices[2].y);
    drawLine(vertices[2].x, vertices[2].y, vertices[0].x, vertices[0].y);
}

// Evento de clique do mouse para definir pontos para a linha ou triângulo
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Botão esquerdo do mouse
        if (mode === 'line') {
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
        } else if (mode === 'triangle') {
            vertices.push({ x: e.offsetX, y: e.offsetY });
            if (vertices.length === 3) {
                drawTriangle(vertices); // Desenha o triângulo
                vertices = []; // Reseta os vértices para o próximo triângulo
            }
        }
    }
});

// Captura a tecla pressionada para mudar a cor ou o modo de desenho
document.addEventListener('keydown', (e) => {
    if (colorMap[e.key] !== undefined) {
        color = colorMap[e.key];
        // Redesenha a figura atual com a nova cor
        if (!drawing && mode === 'line') {
            drawLine(startX, startY, endX, endY);
        } else if (!drawing && mode === 'triangle' && vertices.length === 0) {
            drawTriangle(vertices);
        }
    } else if (e.key === 'r' || e.key === 'R') {
        mode = 'line';
        drawing = false;
        vertices = [];
        gl.clearRect(0, 0, canvas.width, canvas.height);
        drawLine(0, 0, 0, 0); // Desenha a linha inicial
    } else if (e.key === 't' || e.key === 'T') {
        mode = 'triangle';
        drawing = false;
        vertices = [];
        gl.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// Desenha a linha inicial de coordenadas (0,0) - (0,0)
drawLine(0, 0, 0, 0);