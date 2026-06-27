const Tag = require('../models/Tag')

const getAllTags = async () => await Tag.find().select('-createdAt -updatedAt -__v');

const getTagById = async (id) => await Tag.findById(id).populate('posts').select('-createdAt -updatedAt -__v');

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