const { Router } = require('express');
const router = Router();
const {
    getPostImages,
    getPostImageById, 
    updatePostImage, 
    createPostImage,
    deletePostImage
} = require('../controllers/post_image.controller');

router.get('/', getPostImages);
router.get('/:id', getPostImageById);
router.post('/', createPostImage); // Nota: Aquí luego agregarás el middleware de Multer (ej: upload.single('image'))
router.put('/:id', updatePostImage);
router.delete('/:id', deletePostImage);

module.exports = router;