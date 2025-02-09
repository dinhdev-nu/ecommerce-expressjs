"use strict"

const multer = require('multer')


const upload = multer({
    dest: "./src/uploads",
})

const uploadMemory = multer({
    storage: multer.memoryStorage()
})

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        },
    },),
    limits: {fileSize: 5* 1024 * 1024}
})

module.exports = {
    upload,
    uploadMemory,
    uploadDisk
}