const { model } = require('mongoose');
const Tag = require('../models/Tag')

const getTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTagById = async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await Tag.findById(id)
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const updateTag = async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const tagActualizada = await Tag.findByIdAndUpdate(id, data, { new: true });
        res.status(201).json(tagActualizada)
    }catch(error){
        res.status(500).json({error: error.message})

    }
}

const createTag = async (req, res) => {
    try {
        const tag = req.body
        const newTag = new Tag(tag);
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTag = async (req,res) => {
    try {
        const id = req.params.id
        await Tag.findByIdAndDelete(id);
        res.status(200).json({message:'El Tag a sido eliminado correctamente '})

    } catch (error) {
        res.status(500).json({message:'No se pudo eliminar el tag '});
    }
}

module.exports = {
    getTags,
    getTagById,
    updateTag,
    createTag,
    deleteTag
}