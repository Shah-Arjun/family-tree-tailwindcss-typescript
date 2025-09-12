// import multer from "multer";
// import path from 'path';

// //configure multer
// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//     cb(null, "public/uploads/"); //this tells multer to save files(photo) into backend/uploads that is comming from frontend
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname); // unique file name with extension
//   },
// });

// export const upload = multer({ storage });