const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const [width, height] = [window.innerWidth, window.innerHeight]
;(function init() {
    canvas.width = width
    canvas.height = height
})()

const population = 300
const dots = new Array(population).fill(0).map((e) => new Dot())
const mouseDot = new Dot(0, 0)

canvas.onmousemove = (e) => {
    let x = e.layerX
    let y = e.layerY
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

function Dot(x, y) {
    this.pos =
        x && y
            ? { x, y }
            : {
                  x: Math.random() * width,
                  y: Math.random() * height,
              }
    this.range = 70
    this.vel = {
        x: 0,
        y: 0,
    }
    this.acc = {
        x: random(-2, 1),
        y: random(-2, 1),
    }
    this.draw = function (ctx) {
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.arc(this.pos.x, this.pos.y, 3, 0, 2 * Math.PI)
        ctx.fill()
    }
    this.update =
        x && y
            ? (x, y) => {
                  this.pos = { x, y }
              }
            : function () {
                  this.pos.x += this.vel.x
                  this.pos.y += this.vel.y
                  if (this.pos.x > width) this.pos.x = 0
                  if (this.pos.x < 0) this.pos.x = width
                  if (this.pos.y > height) this.pos.y = 0
                  if (this.pos.y < 0) this.pos.y = height
                  this.vel = {
                      x: limit(this.vel.x + this.acc.x, -5, 5),
                      y: limit(this.vel.y + this.acc.y, -5, 5),
                  }
                  this.acc = {
                      x: random(-2, 1),
                      y: random(-2, 1),
                  }
              }
    this.neighbors = function (dots) {
        let n = []
        dots.forEach((dot) => {
            let d = Math.sqrt(
                Math.pow(this.pos.x - dot.pos.x, 2) +
                    Math.pow(this.pos.y - dot.pos.y, 2)
            )
            if (d < this.range && d != 0) n.push({dot, distance: d})
        })
        return n
    }
    this.drawNeighbors = function(ctx, dots){
        let ns = this.neighbors(dots)
        ns.forEach((n) => {
            line(ctx, `rgba(255, 255, 255, ${scale(n.distance/this.range, 0, 1, 1, 0)})`, 1, this.pos.x, this.pos.y, n.dot.pos.x, n.dot.pos.y)
        })
    }
}
function clearCanvas() {
    ctx.beginPath()
    ctx.fillStyle = "black"
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
