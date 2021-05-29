function Dot(x, y, size, range) {
    this.pos =
        x && y
            ? { x, y }
            : {
                  x: Math.random() * width,
                  y: Math.random() * height,
              }
    this.range = range || 80
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
        ctx.arc(this.pos.x, this.pos.y, size || 3, 0, 2 * Math.PI)
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
            if(n.distance > this.range/2) {
                line(ctx, `rgba(${255*scale(n.distance/this.range, 0, 1, 1, 0)}, 255, ${255*scale(n.distance/this.range, 0, 1, 1, 0)}, ${scale(n.distance/this.range, 0, 1, 1, 0)})`, 1, this.pos.x, this.pos.y, n.dot.pos.x, n.dot.pos.y)
            }else {
                line(ctx, `rgba(255, ${255*scale(n.distance/this.range, 0, 1, 1, 0)}, 255, ${scale(n.distance/this.range, 0, 1, 1, 0)})`, 1, this.pos.x, this.pos.y, n.dot.pos.x, n.dot.pos.y)
            }
        })
    }
}