// Seleciona o canvas e o contexto WebGL
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('2d'); // Usaremos 2D para simular WebGL básico

// Variáveis de estado e configuração
let startX = 0, startY = 0, endX = 0, endY = 0;
let vertices = []; // Armazena os vértices para o triângulo
let drawing = false;
let color = 'blue';
let thickness = 1;
let mode = 'line'; // Modo inicial: 'line' para linha, 'triangle' para triângulo
let changeColorMode = false;
let changeThicknessMode = false;

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

// Algoritmo de Bresenham para desenhar uma linha com espessura
function drawLine(x0, y0, x1, y1, thickness) {
    gl.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    gl.fillStyle = color; // Define a cor

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        for (let i = 0; i < thickness; i++) {
            for (let j = 0; j < thickness; j++) {
                gl.fillRect(x0 + i, y0 + j, 1, 1); // Desenha um ponto com espessura
            }
        }

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

// Função para desenhar um triângulo com espessura
function drawTriangle(vertices, thickness) {
    gl.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    gl.fillStyle = color; // Define a cor

    // Traça as três linhas que formam o triângulo
    drawLine(vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y, thickness);
    drawLine(vertices[1].x, vertices[1].y, vertices[2].x, vertices[2].y, thickness);
    drawLine(vertices[2].x, vertices[2].y, vertices[0].x, vertices[0].y, thickness);
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
                drawLine(startX, startY, endX, endY, thickness); // Desenha a linha
            }
        } else if (mode === 'triangle') {
            vertices.push({ x: e.offsetX, y: e.offsetY });
            if (vertices.length === 3) {
                drawTriangle(vertices, thickness); // Desenha o triângulo
                vertices = []; // Reseta os vértices para o próximo triângulo
            }
        }
    }
});

// Captura a tecla pressionada para mudar a cor, a espessura ou o modo de desenho
document.addEventListener('keydown', (e) => {
    if (changeColorMode && colorMap[e.key] !== undefined) {
        color = colorMap[e.key];
        if (!drawing && mode === 'line') {
            drawLine(startX, startY, endX, endY, thickness);
        } else if (!drawing && mode === 'triangle' && vertices.length === 0) {
            drawTriangle(vertices, thickness);
        }
    } else if (changeThicknessMode && e.key >= '1' && e.key <= '9') {
        thickness = parseInt(e.key, 10);
        if (!drawing && mode === 'line') {
            drawLine(startX, startY, endX, endY, thickness);
        } else if (!drawing && mode === 'triangle' && vertices.length === 0) {
            drawTriangle(vertices, thickness);
        }
    } else if (e.key === 'r' || e.key === 'R') {
        mode = 'line';
        drawing = false;
        vertices = [];
        gl.clearRect(0, 0, canvas.width, canvas.height);
        drawLine(0, 0, 0, 0, thickness); // Desenha a linha inicial
    } else if (e.key === 't' || e.key === 'T') {
        mode = 'triangle';
        drawing = false;
        vertices = [];
        gl.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.key === 'k' || e.key === 'K') {
        changeColorMode = true;
        changeThicknessMode = false;
    } else if (e.key === 'e' || e.key === 'E') {
        changeThicknessMode = true;
        changeColorMode = false;
    }
});

// Desenha a linha inicial de coordenadas (0,0) - (0,0)
drawLine(0, 0, 0, 0, thickness);
