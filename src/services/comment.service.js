const Comment = require('../models/Comment')

const getFechaLimite = () => {
    const monthsLimit = parseInt(process.env.MONTHS_LIMIT ?? '6');
    const limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() - monthsLimit);
    return limitDate;
};

const getAllComments = async () => await Comment.find().populate('user', 'nickName') .select('-createdAt -updatedAt -__v')

const getCommentById = async (id) => await Comment.findById(id).populate('user', 'nickName') .select('-createdAt -updatedAt -__v')

const createComment = async (commentData) => await new Comment(commentData).save()

const updateComment = async (id, commentData) => await Comment.findByIdAndUpdate(id, commentData, { new: true })

const deleteComment = async (id) => await Comment.findByIdAndDelete(id)

const getCommentsByPost = async (postId) => {
    return await Comment.find({
        post: postId,
        createdAt: { $gte: getFechaLimite() }
    })
    .populate('user', 'nickName')
    .select('-createdAt -updatedAt -__v')
    .sort({ createdAt: -1 });
};


module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPost
}