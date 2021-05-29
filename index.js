const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const [width, height] = [window.innerWidth, window.innerHeight]
;(function init() {
    canvas.width = width
    canvas.height = height
})()

const population = 300
const dots = new Array(population).fill(0).map((e) => new Dot())
const mouseDot = new Dot(1, 1, 0, 150)

window.onmousemove = (e) => {
    let x = e.clientX
    let y = e.clientY
    // console.log(x, y)
    mouseDot.update(x, y)
}

function random(min, max) {
    return Math.random() * (max - min + 1) + min
}
function limit(value, min, max) {
    if (value > min && value < max) return value
    if (value < min) return min
    if (value > max) return max
}
function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


function clearCanvas() {
    ctx.beginPath()
    ctx.fillStyle = "rgba(0, 0, 0, .6)"
    ctx.rect(0, 0, width, height)
    ctx.fill()
}
function drawAllDots() {
    dots.forEach((dot) => {
        dot.draw(ctx)
    })
    mouseDot.draw(ctx)
}
function updateDots() {
    dots.forEach((dot) => {
        dot.update()
    })
}
function drawNeighbors() {
    dots.forEach((dot) => {
        dot.drawNeighbors(ctx, dots)
    })
    mouseDot.drawNeighbors(ctx, dots)
}

//draw a line on canvas
function line(ctx, stroke, width, x, y, nx, ny) {
    ctx.beginPath()
    ctx.strokeStyle = stroke
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.lineWidth = width
    ctx.moveTo(x, y)
    ctx.lineTo(nx, ny)
    ctx.stroke()
}
function draw() {
    clearCanvas()
    drawAllDots()
    updateDots()
    drawNeighbors()
    requestAnimationFrame(draw)
}

draw()
