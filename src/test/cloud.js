

const uploadImageByURL = async (  img = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32' ) => {
    try {
        const cloud_url = await cloudinary.uploader.upload(img, {
            folder: 'Product'
        })
        console.log(cloud_url.secure_url)
    } catch (error) {
        console.log(error)
    }
}

uploadImageByURL()