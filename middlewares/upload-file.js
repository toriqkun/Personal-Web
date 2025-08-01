// const multer = require("multer");
// const path = require("path");
// require("dotenv").config({ path: ".env.local" });

// let upload;

// if (String(process.env.USE_CLOUDINARY).trim().toLowerCase() === "true") {
//   // ======= Cloudinary storage =======
//   const { v2: cloudinary } = require("cloudinary");
//   const { CloudinaryStorage } = require("multer-storage-cloudinary");

//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: "portfolio_uploads",
//       format: async (req, file) => {
//         // Pertahankan ekstensi sesuai mimetype, bisa disesuaikan
//         const ext = file.mimetype.split("/")[1];
//         return ext === "jpeg" ? "jpg" : ext;
//       },
//       public_id: (req, file) => `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}`,
//     },
//   });

//   upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//       const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
//       if (allowed.includes(file.mimetype)) cb(null, true);
//       else cb(new Error("Jenis file tidak diizinkan! Hanya .png, .jpg, .jpeg, .webp yang diperbolehkan."), false);
//     },
//     limits: { fileSize: 5 * 1024 * 1024 },
//   });
// } else {
//   // ======= Local disk fallback (development) =======
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname, "../uploads"));
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Jenis file tidak diizinkan! Hanya .png, .jpg, .jpeg, .webp yang diperbolehkan."), false);
//     }
//   };

//   upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 },
//   });
// }

// module.exports = upload;

const { v2: cloudinary } = require("cloudinary");
require("dotenv").config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "portfolio_uploads",
    use_filename: true,
    unique_filename: false,
  });
};

module.exports = uploadToCloudinary;
