const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUDE_KEY,
  api_secret: process.env.CLOUDE_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Rootely_DEV", 
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => file.originalname.split(".")[0] // optional: use original filename
  }
});


module.exports = {
  cloudinary,
  storage
};