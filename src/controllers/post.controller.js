const Post = require('../models/Post')
const PostImage = require('../models/PostImage')
cacheManager = require('../managers/CacheManager')

const getPosts = async (req, res) => {
    try {

        const limiteMeses = parseInt(process.env.MONTHS_LIMIT ?? '6')
        const fechaLimite = new Date()
        fechaLimite.setMonth(fechaLimite.getMonth() - limiteMeses)

        const posts = await Post.find()
            .populate('user', 'nickName')
            .populate('tags', 'name')
            .populate('images', 'url')
            .populate({
                path: 'comments',
                match: { createdAt: { $gte: fechaLimite } },
                populate: { path: 'user', select: 'nickName' },
                options: { sort: { createdAt: -1 } }
            })
            .sort({ createdAt: -1 })

        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}



const getPostByID = async (req, res) => {
    try {
        const id = req.params.id
        const limiteMeses = parseInt(process.env.MONTHS_LIMIT ?? '6')
        const fechaLimite = new Date()
        fechaLimite.setMonth(fechaLimite.getMonth() - limiteMeses)

        const post = await Post.findById(id)
            .populate('user', 'nickName')
            .populate('tags', 'name')
            .populate('images', 'url')
            .populate({
                path: 'comments',
                match: { createdAt: { $gte: fechaLimite } },
                populate: { path: 'user', select: 'nickName' },
                options: { sort: { createdAt: -1 } }
            })
            .sort({ createdAt: -1 })



        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

const createPost = async (req, res) => {
    const { description, user, tags } = req.body
    try {
        const newPost = new Post({
            description,
            user,
            tags: tags ?? []
        })
        await newPost.save()
        cacheManager.clear()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ error: error.message })

    }

}

const updatePost = async (req, res) => {
    try {
        const id = req.params.id
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true })
        cacheManager.clear()
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}





const deletePost = async (req, res) => {
    try {
        const id = req.params.id
        const deletedPost = await Post.findByIdAndDelete(id)
        cacheManager.clear()
        res.status(200).json(deletedPost)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}


const agregarTagAPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const tagId = req.params.tagId;

        const post = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { tags: tagId } },
            { new: true }
        );
        cacheManager.clear()
        res.status(200).json(post)



    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addImageToPost = async (req, res) => {
    try {
        const postId = req.params.id
        const { url } = req.body

        const newImage = new PostImage({ url, post: postId })
        await newImage.save()
        cacheManager.clear()
        res.status(201).json(newImage)

    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}








module.exports = {
    getPosts,
    getPostByID,
    createPost,
    updatePost,
    deletePost,
    addImageToPost,
    agregarTagAPost
}

