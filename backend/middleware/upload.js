const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// 1. Configure Cloudinary with your secure credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up the Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'samye_travels', // All images will go into this folder in your Cloudinary dashboard
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp','mp4', 'mov', 'avi'],
    transformation: [{ width: 1920, crop: 'limit' }] // Automatically prevents massive file sizes from slowing down your site
  }
});

// 3. Initialize Multer
const upload = multer({ storage: storage });

module.exports = upload;