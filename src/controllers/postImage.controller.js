const  PostImage = require('../models/PostImage');

const getPostImages = async (req, res) => {
    try {
        const postImage = await PostImage.find();
        res.status(200).json(postImage);
    }catch (error) {
        res.status(500).json({message: `${error.message}`});
    }
};


const getPostImageById = async (req, res) => {
    try {
        const id = req.params.id;
        const postImage = await PostImage.findById(id);

        res.status(200).json(postImage);
    }catch (error) {
        res.status(500).json({message: `Error al obtener el post`});
    }
};

const updatePostImage = async (req, res) => {
    try {
        const id = req.params.id;
        const {url} = req.body;
        const newPostImage = await PostImage.findByIdAndUpdate(id, {url}, {new: true});
        res.status(200).json(newPostImage);
    }catch (error) {
        res.status(500).json({message: 'Error al actualizar el post'});
    }
}

const createPostImage = async (req, res) => {
    try {
        const {post} = req.body;

        if(!req.file){
            return res.status(400).json({message: 'No se ha proporcionado una imagen'});
        }
        const urlLocal = `http://localhost:3000/${req.file.filename}`;
        const newPostImage = await PostImage.create({
            url: urlLocal,
            post
        });
        
        res.status(201).json(newPostImage);
    }
    catch (error) {
        res.status(500).json({message: 'Error al crear el post'});
    }
};




const deletePostImage = async (req, res) => {
    try {
        const id = req.params.id;
        await PostImage.findByIdAndDelete(id);
        res.status(200).json({message: 'Post eliminado'});
    }catch (error) {
        res.status(500).json({message: 'Error al eliminar el post'});
    }
}

module.exports = {
    getPostImages,
    getPostImageById, 
    updatePostImage, 
    createPostImage,
    deletePostImage
};