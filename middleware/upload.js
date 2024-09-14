const util = require("util");
const multer = require("multer");
const maxSize = 2 * 3024 * 3024;

let storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array("files");

let uploadFileMiddleware = util.promisify(uploadFile);
const upl=async (req,res)=>{
  await uploadFileMiddleware(req,res)
  const fileNames = req.files.map((file) => ({name:file.originalname, type:file.mimetype.split('/')}));
  return fileNames;
}
module.exports = upl;
