const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const {
    getPostImages,
    getPostImageById,
    updatePostImage,
    createPostImage,
    deletePostImage
} = require('../controllers/postImage.controller');

router.get('/', getPostImages);
router.get('/:id', getPostImageById);

router.post('/', upload.single('url'), createPostImage);

router.put('/:id', upload.single('url'), updatePostImage);
router.delete('/:id', deletePostImage);

module.exports = router;