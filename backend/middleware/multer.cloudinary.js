import multer from 'multer';

//configure multer
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, "/uploads"); //this tells multer to save files(photo) into backend/uploads that is comint from frontend
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round
        (Math.random() * 1E9)
        cb(null, file.originalname);
    }
});

export const upload = multer({storage,});

