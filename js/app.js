let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

let animationFrame,
    ballNumbers = 10,
    ballShootVelocity = 10,
    shootedBall = null,
    ballRadius = 20

let bottomBalls = []
let connectedBalls = []
initBottomBalls()


let startAnimationFrames = function () {
    context.clearRect(0, 0, width, height)
    drawCenterBall()
    drawBottomBalls()
    animationFrame = requestAnimationFrame(startAnimationFrames)
}
function drawBall (ball, color) {
    context.beginPath()
    context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
    context.fillStyle = color
    context.fill()
}
function keyboardHandling () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            shootedBall = bottomBalls.splice(-1)[0]
        }
    })
}
function initBottomBalls () {
    for (let i = 0; i < ballNumbers; i++) {
        let newBall = ball.create(vector.create(width / 2, height - 100 + i * (2 * ballRadius + 5)), vector.create(0, ballShootVelocity))
        bottomBalls.push(newBall)
    }
}
function drawCenterBall () {
    context.beginPath()
    context.arc(width / 2, height / 2, 70, 0, 2 * Math.PI)
    context.fillStyle = '#000'
    context.fill()
}
function drawBottomBalls () {
    bottomBalls.forEach(ball => {
        context.beginPath()
        context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
        context.fillStyle = '#000'
        context.fill()
    })
}

startAnimationFrames()
keyboardHandling()