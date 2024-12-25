const { default: mongoose } = require("mongoose")


const MONGO_URL = process.env.MONGO_URL


class ConnectMongoDB {
    constructor() {
        this.connect()
    }

    connect() {
        mongoose.connect(MONGO_URL, {
            maxPoolSize: 50
        }).then(() => {
            console.log('Connected to MongoDB successfully')
        }).catch(()=> {
            console.log('Connect to MongoDB failed')
        })
    }

    static getInstance() {
        if(!ConnectMongoDB.intance){
            ConnectMongoDB.intance = new ConnectMongoDB
        }
        return ConnectMongoDB.intance
    }

}

const connectMongoDB = ConnectMongoDB.getInstance()

module.exports = connectMongoDB