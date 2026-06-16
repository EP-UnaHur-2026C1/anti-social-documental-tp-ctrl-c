const Comment = require('../models/Comment');

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id)
        res.status(200).json(comment);
    } catch (error){
        res.status(500).json({error: error.message})
    }
}




const createComment = async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getCommentsByPost = async (req, res) => {
    try {
        const monthsLimit = parseInt(process.env.MONTHS_LIMIT ?? '6');
        const limitDate = new Date();
        limitDate.setMonth(limitDate.getMonth() - monthsLimit);

        const comments = await Comment.find({
            post: req.params.postId,
            createdAt: { $gte: limitDate }
        }).populate('user', 'nickName').sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    getComments,
    getCommentById

};