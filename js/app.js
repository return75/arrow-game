let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

let animationFrame = null,
    ballNumbers = 6,
    centerBallRadius = 70,
    shotBallVelocityVector = vector.create(0, -10),
    centerPageVector = vector.create(width / 2, height / 2),
    rotationVelocity = 5,
    shotBall = null,
    bottomBallsSpace = 5,
    ballConnectionDistance = 200,
    ballRadius = 20

let bottomBalls = []
let connectedBalls = []



let startAnimationFrames = function () {
    context.clearRect(0, 0, width, height)
    drawShotBall()
    drawCenterBall()
    drawBottomBalls()
    rotateConnectedBalls()
    drawConnectedBalls()

    let collided = checkShotBallCollision()
    if (collided) {
        resetGame()
        return
    }
    let status = checkSuccess()
    if (status) {
        return
    }
    checkShotBallConnection()
    animationFrame = requestAnimationFrame(startAnimationFrames)
}


function keyboardHandling () {
    document.addEventListener('keydown', event => {
        if (event.code === 'Space') {
            shootBall()
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
function mouseHandling () {
    document.addEventListener('mouseup', event => {
        shootBall()
    })
}
function initBottomBalls () {
    bottomBalls = []
    for (let i = 0; i < ballNumbers; i++) {
        let newBall = ball.create(vector.create(width / 2, height - 100 + i * (2 * ballRadius + bottomBallsSpace)), shotBallVelocityVector)
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
    bottomBalls.forEach((ball, index) => {
        context.beginPath()
        context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
        context.fillStyle = '#000'
        context.fill()

        context.font="bold 20px Roman";
        context.fillStyle = '#fff'
        context.fillText((ballNumbers - bottomBalls.length + index + 1).toString(), ball.position.getX() - ballRadius / 4 , ball.position.getY() + ballRadius / 3);
    })
}
function drawConnectedBalls () {
    connectedBalls.forEach((ball, index) => {
        context.beginPath()
        context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
        context.fillStyle = '#000'
        context.fill()

        // draw line to centerBall
        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(ball.position.getX(), ball.position.getY());
        context.stroke();

        // draw number in center of ball
        context.font="bold 20px Roman";
        context.fillStyle = '#fff'
        context.fillText((index + 1).toString(), ball.position.getX() - ballRadius / 4 , ball.position.getY() + ballRadius / 3);
    })
}
function drawShotBall () {
    if (!shotBall) return
    let ballNewPosition = shotBall.getPosition().addTo(shotBallVelocityVector)
    shotBall.setPosition(ballNewPosition)
    context.beginPath()
    context.arc(shotBall.getPosition().getX(), shotBall.getPosition().getY(), ballRadius, 0, 2 * Math.PI)
    context.fillStyle = '#000'
    context.fill()
}
function shootBall () {
    shotBall = bottomBalls.splice(0, 1)[0]
    playShootSound()
    // move remained balls to top
    bottomBalls.map(ball => ball.position.setY(ball.position.getY() - (2 * ballRadius + bottomBallsSpace)))
}
function checkShotBallConnection () {
    if (!shotBall) return
    if ((shotBall.getPosition().getY() - height / 2 ) <= ballConnectionDistance) {
        shotBall.setConnection(true)
        connectedBalls.push(shotBall)
        shotBall = null
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
function checkShotBallCollision () {
    if (connectedBalls.length) {
        let lowestBall = connectedBalls.reduce((accumulator, element) => {
            return accumulator.position.getY() > element.position.getY() ? accumulator : element
        })
        if (shotBall) {
            let distance = calculateBallsDistance(lowestBall, shotBall)
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
function resetGame () {
    cancelAnimationFrame(animationFrame)
    document.querySelector('body').style.backgroundColor = '#ff0c00d6'
    playLossSound()
    setTimeout(() => {
        document.querySelector('body').style.backgroundColor = 'white'
        initBottomBalls()
        connectedBalls = []
        startAnimationFrames()
    }, 1000)

}
function checkSuccess () {
    if (bottomBalls.length === 0) {
        document.querySelector('body').style.backgroundColor = 'rgba(3,198,71,0.84)'
        playWinSound()
        loadNextLevel()
        setTimeout(() => {
            document.querySelector('body').style.backgroundColor = 'white'
            initBottomBalls()
            connectedBalls = []
            startAnimationFrames()
        }, 1000)
        return true
    }
}
function loadNextLevel () {
    rotationVelocity += .5
    ballNumbers += 1
}


initBottomBalls()
startAnimationFrames()
playBackgroudSound()
keyboardHandling()
mouseHandling()