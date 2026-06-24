const tagService = require('../services/tag.service')
const catchAsync = require('../utils/catchAsync')

const getTags = catchAsync(async (req, res) => {
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
});

const getTagById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const tag = await tagService.getTagById(id);
    res.status(200).json(tag);
});

const createTag = catchAsync(async (req, res) => {
    const tagData = req.body;
    const tag = await tagService.createTag(tagData);
    res.status(201).json(tag);
});

const updateTag = catchAsync(async (req, res) => {
    const id = req.params.id;
    const tagData = req.body;
    const tag = await tagService.updateTag(id, tagData);
    res.status(200).json(tag);
});

const deleteTag = catchAsync(async (req, res) => {
    const id = req.params.id;
    await tagService.deleteTag(id);
    res.status(200).json({ message: 'Tag eliminado correctamente' });
});







module.exports = {
    getTags,
    getTagById,
    updateTag,
    createTag,
    deleteTag
}