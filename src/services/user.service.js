const User = require('../models/User')
const Comment = require('../models/Comment')

const getAllUsers = async () => await User.find()
    .populate('nickName followers')
    .populate('nickName following')

const getUserById = async (id) => await User.findById(id)
    .populate('comentarios') 
    .populate('posts', 'description createdAt') 
    .populate('followers', 'nickName');





const createUser = async (userData) => await User.create(userData);

const updateUser = async (id, userData) => await User.findByIdAndUpdate(
    id, 
    userData, 
    { new: true }
);

const deleteUser = async (id) => await User.findByIdAndDelete(id);

const getCommentsByUserId = async (userId) => await Comment.find({ user: userId })
    .populate('user', 'nickName')
    .populate('post', 'description');




const getPostsByUserId = async (userId) => {
    const user = await User.findById(userId).populate('posts', 'description createdAt');
    return user ? user.posts : [];
}

const followUser = async (userId, followId) => {
    await User.findByIdAndUpdate(userId, { $addToSet: { followers: followId } });
    await User.findByIdAndUpdate(followId, { $addToSet: { followers: userId } });
    return { message: 'Comenzaste a seguir a este usuario exitosamente' };
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getCommentsByUserId,
    getPostsByUserId,
    followUser
};