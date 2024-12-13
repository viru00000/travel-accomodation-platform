const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret:  process.env.CLOUD_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'wanderlust_DEV', // Optional: Folder name in Cloudinary
  allowedFormats: ['jpg', 'png' , "jpeg"],
});

// const upload = multer({ storage });

// Example route for handling file uploads
// app.post('/upload', upload.single('image'), (req, res) => {
//   res.send(`File uploaded to: ${req.file.path}`);
// });


module.exports = {cloudinary , storage};