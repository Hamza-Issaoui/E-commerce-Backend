const multer = require("multer");
const path = require("path")
//le moteur de stockage sur disque vous donne un controle total sur le stockage des fichiers sur le disque.

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./storages"); // toujours null car c'est un parametre
//   },
//   filename: (req, file, cb) => {
//     //for mac
//     // cb(null, new Date().toISOString() + file.originalname);
//     const images = Date.now() + '-' + file.originalname//          cb(null,file.fieldname + Date.now() + images)

//     // for windows
//     //cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './storages')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
  }
})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image upload is not of type jpg/jpeg or png"), false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { _fileSize: 1024 * 1024 * 1024 * 10 },
}); // key: value

