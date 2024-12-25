const { default: mongoose } = require("mongoose");


const numberConects = async() => {
    const number = await mongoose.connections.length
    console.log(`Number of connections MongoDB: ${number}`)
}

module.exports = numberConects()
