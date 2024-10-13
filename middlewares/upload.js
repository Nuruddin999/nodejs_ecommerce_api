const util = require("util");
const multer = require("multer");
const maxSize = 2 * 3024 * 3024;

let storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array("file",20);

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;