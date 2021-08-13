let backgroundSound = document.getElementById("backgroundSound")
let shootSound = document.getElementById("shoot")
let winSound = document.getElementById("win")
let lossSound = document.getElementById("loss")


function playShootSound() {
    shootSound.play()
}
function pauseShootSound() {
    shootSound.pause()
}
function resetShootSound() {
    shootSound.currentTime = 0
}
function playWinSound() {
    winSound.play()
}
function playLossSound() {
    lossSound.play()
}
function playBackgroudSound() {
    backgroundSound.volume = 1
    backgroundSound.play()
    backgroundSound.addEventListener('ended', () => {
        backgroundSound.currentTime = 0
        backgroundSound.play()
    })
}
function pauseBackgroudSound() {
    backgroundSound.pause()
}
function resetBackgroudSound() {
    backgroundSound.currentTime = 0
}
