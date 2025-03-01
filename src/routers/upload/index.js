'use strict';

const { Router } = require('express');
const router = Router()
const cloudinary = require('../../configs/cloudinary.config')
const fs = require('fs')
// const { fileTypeFromBuffer } = require("file-type")

const { uploadDisk } = require('../../configs/multer.config')

router.post('/thumb', uploadDisk.single('file'), async(req, res) => {
    try {
        const { file } = req
        // check file image
        // const buffer = fs.readFileSync(file.path)
        // const fileType = await fileTypeFromBuffer(buffer)
        // if (!fileType || ![ 'image/jpeg', 'image/png', 'image/gif'].includes(fileType.mime)) {
        //     res.status(400).json({ message: 'File not image' })
        // }
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }
        const upload = await cloudinary.uploader.upload(file.path, {
            folder: 'test',
            public_id: `${Date.now()}-${file.originalname}`
        })
        fs.unlinkSync(file.path)
        return res.status(200).json({
            message: 'File uploaded', 
            url: upload.secure_url,
            url_fix: await cloudinary.url(upload.public_id, {
                width: 200, 
                height: 200, 
                format: 'jpg',
            })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/images', uploadDisk.array('files', 5), async(req, res) => {
    try {
        const { files  } = req
        if (!files ) {
            return res.status(400).json({ message: 'No files  uploaded' })
        }
        const upload = await Promise.all(files.map(async (file) => {
            return await cloudinary.uploader.upload(file.path, {
                folder: 'test',
                public_id: `${Date.now()}-${file.originalname}`
            })
        }))
        return res.status(200).json({
            message: 'File uploaded', 
            url: upload.map((item) => item.secure_url),
            url_fix: await Promise.all(upload.map(async i => {
                return await cloudinary.url(i.public_id, {
                    width: 200, 
                    height: 200, 
                    format: 'jpg',
                })
            }))
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/remove', async(req, res) => {
    try {
        const { url } = req.body
        if (!url) {
            return res.status(400).json({ message: 'No url uploaded' })
        }

        const get_public_id = url.split('/').slice(7).join('/')
                                .split('.').slice(0, -1).join('.')

        const remove = await cloudinary.uploader.destroy(get_public_id)
        
        return res.status(200).json({
            message: 'File removed', 
            result: remove
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/multiple', uploadDisk.fields({'thumb': 1}, {'images': 5}), async(req, res) => {})


module.exports = router
