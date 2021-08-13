let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

let animationFrame = null,
    ballNumbers = 10,
    centerBallRadius = 70,
    shootedBallVelocityVector = vector.create(0, -10),
    centerPageVector = vector.create(width / 2, height / 2)
    rotationVelocity = 10,
    shootedBall = null,
    bottomBallsSpace = 5,
    ballConnectionDistance = 200,
    ballRadius = 20

let bottomBalls = []
let connectedBalls = []



let startAnimationFrames = function () {
    context.clearRect(0, 0, width, height)
    drawCenterBall()
    drawBottomBalls()
    rotateConnectedBalls()
    drawConnectedBalls()
    drawShootedBall()
    let collided = checkShootedBallCollision()
    if (collided) return
    checkShootedBallConnection()
    animationFrame = requestAnimationFrame(startAnimationFrames)
}


function keyboardHandling () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            shootedBall = bottomBalls.splice(0, 1)[0]
            // move remained balls to top
            bottomBalls.map(ball => ball.position.setY(ball.position.getY() - (2 * ballRadius + bottomBallsSpace)))
        } else if (event.key === 'Escape') {
            if (!animationFrame) {
                requestAnimationFrame(startAnimationFrames)
            } else {
                cancelAnimationFrame(animationFrame)
                animationFrame = null
            }
        }
    })
}
function initBottomBalls () {
    for (let i = 0; i < ballNumbers; i++) {
        let newBall = ball.create(vector.create(width / 2, height - 100 + i * (2 * ballRadius + bottomBallsSpace)), shootedBallVelocityVector)
        bottomBalls.push(newBall)
    }
}
function drawCenterBall () {
    context.beginPath()
    context.arc(width / 2, height / 2, centerBallRadius, 0, 2 * Math.PI)
    context.fillStyle = '#000'
    context.fill()
    document.querySelector('#center-number').innerHTML = bottomBalls.length.toString()
}
function drawBottomBalls () {
    bottomBalls.forEach(ball => {
        context.beginPath()
        context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
        context.fillStyle = '#000'
        context.fill()
    })
}
function drawConnectedBalls () {
    connectedBalls.forEach(ball => {
        context.beginPath()
        context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
        context.fillStyle = '#000'
        context.fill()
    })
}
function drawShootedBall () {
    if (!shootedBall) return
    let newPositionForBall = shootedBall.getPosition().addTo(shootedBallVelocityVector)
    shootedBall.setPosition(newPositionForBall)
    context.beginPath()
    context.arc(shootedBall.getPosition().getX(), shootedBall.getPosition().getY(), ballRadius, 0, 2 * Math.PI)
    context.fillStyle = '#000'
    context.fill()
}
function checkShootedBallConnection () {
    if (!shootedBall) return
    if ((shootedBall.getPosition().getY() - height / 2 ) <= ballConnectionDistance) {
        shootedBall.setConnection(true)
        connectedBalls.push(shootedBall)
        shootedBall = null
    }
}
function rotateConnectedBalls () {
    connectedBalls.forEach(ball => {
        let ballCenterVector = ball.getPosition().subtractFrom(centerPageVector)
        let velocityVectory = getVelocityVector(ballCenterVector)
        let ballNextPosition = centerPageVector.addTo(ballCenterVector).addTo(velocityVectory)
        ball.setPosition(ballNextPosition)
    })

}
function getVelocityVector (vector) {
    let sourceVectorAngle = vector.getAngle()
    let angle = Math.acos(rotationVelocity / 2 / ballConnectionDistance)
    let velocityVector = vector.create(1, 1)
    velocityVector.setLength(rotationVelocity)
    velocityVector.setAngle(sourceVectorAngle + Math.PI - angle)
    return velocityVector
}
function checkShootedBallCollision () {
    if (connectedBalls.length) {
        let lowestBall = connectedBalls.reduce((accumulator, element) => {
            return accumulator.position.getY() > element.position.getY() ? accumulator : element
        })
        if (shootedBall) {
            let distance = calculateBallsDistance(lowestBall, shootedBall)
            if (distance <= 2 * ballRadius ) {
                window.cancelAnimationFrame(animationFrame)
                animationFrame = null
                return true
            }
        }
    }
}

function calculateBallsDistance (ball1, ball2) {
    let xDistance = ball1.position.getX() - ball2.position.getX()
    let yDistance = ball1.position.getY() - ball2.position.getY()
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}


initBottomBalls()
startAnimationFrames()
keyboardHandling()