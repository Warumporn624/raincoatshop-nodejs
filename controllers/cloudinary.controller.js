const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image,
            {
                public_id: Date.now(),
                resource_type: "auto",
            }
        );
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send('upload image error!')
    }
}

exports.removeImage = async (req, res) => {
    try {
        let image_id = req.body.public_id
        cloudinary.uploader.destroy(image_id, (result)=>{
            res.send(result);
        });
    } catch (error) {
        console.log(error)
        res.status(500).send('remove image error!')
    }
}
