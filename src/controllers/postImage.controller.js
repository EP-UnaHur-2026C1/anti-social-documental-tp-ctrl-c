const postImageService = require('../services/postImage.service');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs').promises;
const path = require('path');

const getPostImages = catchAsync(async (req, res) => {
    const postImages = await postImageService.getAllPostImages();
    res.status(200).json(postImages);
})

const getPostImageById = catchAsync(async (req, res) => {
    const postImage = await postImageService.getPostImageById(req.params.id);
    res.status(200).json(postImage);
});

const createPostImage = catchAsync(async (req, res) => {
    const { post } = req.body;

    const PORT = process.env.PORT || 4002;
    const urlLocal = `http://localhost:${PORT}/imagenes/${req.file.filename}`;

    const newPostImage = await postImageService.createPostImage({
        url: urlLocal,
        post
    });

    res.status(201).json(newPostImage);
});

const updatePostImage = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    if (!req.file) {
        return res.status(400).json({ message: "No se proporcionó ninguna imagen nueva." });
    }

    const currentImage = await postImageService.getPostImageById(id);
    
    if (currentImage && currentImage.url) {
        const oldFilename = currentImage.url.split('/').pop();
        const oldFilePath = path.join(__dirname, '../imagenes', oldFilename);
        
        try {
            await fs.unlink(oldFilePath);
        } catch (err) {
            console.error("No se pudo borrar el archivo viejo:", err.message);
        }
    }

    const PORT = process.env.PORT || 4002;
    const urlLocal = `http://localhost:${PORT}/imagenes/${req.file.filename}`;

    const updatedPostImage = await postImageService.updatePostImage(id, { url: urlLocal });
    
    res.status(200).json(updatedPostImage);
});



const deletePostImage = catchAsync(async (req, res) => {
    const deletedPostImage = await postImageService.deletePostImage(req.params.id);

    if (deletedPostImage && deletedPostImage.url) {
        
        const filename = deletedPostImage.url.split('/').pop(); 
        
        const filePath = path.join(__dirname, '../imagenes', filename);

        try {
            await fs.unlink(filePath);
        } 
        catch (err) {
            console.error(`Aviso: No se pudo borrar el archivo físico ${filename}:`, err.message);
        }
    }
    
    
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
});




module.exports = {
    getPostImages,
    getPostImageById, 
    updatePostImage, 
    createPostImage,
    deletePostImage
};