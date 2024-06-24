import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    callback(null, `${id}.${extName}`);
  },
});

export const singleUpload = multer({ storage }).single("photo");

// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/temp");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//         //print this file , see what is in it 
//         //giving originalname here is not a good practise , because many files can be of same name . but we can do this here because at server the file is goining to be for a very less time 
        
//     },
// });

// export const singleUpload = multer({
//     storage, // can also write it as { storage : storage}
// });
