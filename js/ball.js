let ball = {
    position: null,
    connected: false,
    velocity: null,
    create: function (position, velocity) {
        let object = Object.create(this)
        object.setPosition (position)
        object.setVelocity (velocity)
        return object
    },
    setPosition: function (position) {
        this.position = position
    },
    getPosition: function (position) {
        return this.position
    },
    setVelocity: function (velocity) {
        this.velocity = velocity
    },
    getVelocity () {
        return this.velocity
    }
}
