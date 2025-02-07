"use strict"

const multer = require('multer')


const upload = multer({
    dest: "./src/public",
    
})

const uploadMemory = multer({
    storage: multer.memoryStorage()
})

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/public/')
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
})

module.exports = {
    upload,
    uploadMemory,
    uploadDisk
}