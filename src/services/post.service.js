const Post = require('../models/Post')
const PostImage = require('../models/PostImage')


const getFechaLimite = () => {
    const limiteMeses = parseInt(process.env.MONTHS_LIMIT || process.env.FECHA_LIMITE_MESES || '6')
    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() - limiteMeses)
    return fechaLimite
}

const getAllPosts = async () => await Post.find()
    .select('-createdAt -updatedAt -__v')
    .populate('user', 'nickName')
    .populate('tags', 'name')
    .populate('images', 'url')
    .populate({
        path: 'comments',
        match: { createdAt: { $gte: getFechaLimite() } },
        populate:{path: 'user', select: 'nickName'},
        options: { sort: { createdAt: -1 } }
    })
    .sort({ createdAt: -1 })



const getPostById = async (id) => await Post.findById(id)
    .select('-createdAt -updatedAt -__v')
    .populate('user', 'nickName')
    .populate('tags', 'name')
    .populate('images', 'url')
    .populate({
        path: 'comments',
        match: { createdAt: { $gte: getFechaLimite() } },
        populate:{path: 'user', select: 'nickName'},
        options: { sort: { createdAt: -1 } }
    })
    .sort({ createdAt: -1 })


const createPost = async (postData) => {
    const {description,user,tags} = postData
    const newPost = new Post({
        description,
        user,
        tags
    })
    return await newPost.save()
}

const updatePost = async (id, postData) => await Post.findByIdAndUpdate(id, postData, { new: true })

const deletePost = async (id) => await Post.findByIdAndDelete(id)

const addTagToPost = async (postId, tagId) => await Post.findByIdAndUpdate(
    postId, 
    { $push: { tags: tagId } }, 
    { new: true }
)



const addImageToPost = async (postId, url) => {
    const newImage = new PostImage({ url, post: postId });
    return await newImage.save();
}



module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    addTagToPost,
    addImageToPost
}