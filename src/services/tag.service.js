const Tag = require('../models/Tag')

const getAllTags = async () => await Tag.find();

const getTagById = async (id) => await Tag.findById(id).populate('posts')

const createTag = async (tagData) => await Tag.create(tagData);

const updateTag = async (id, tagData) => await Tag.findByIdAndUpdate(id, tagData, { new: true });

const deleteTag = async (id) => await Tag.findByIdAndDelete(id);


module.exports = {
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag
};