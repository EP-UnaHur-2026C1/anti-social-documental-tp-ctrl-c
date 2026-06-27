const User = require('../models/User')
const Comment = require('../models/Comment')

const getAllUsers = async () => await User.find()
    .select('-createdAt -updatedAt -__v')
    .populate('nickName followers')
    .populate('nickName following')

const getUserById = async (id) => await User.findById(id)
    .select('-createdAt -updatedAt -__v')
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
    .select('-createdAt -updatedAt -__v')
    .populate('user', 'nickName')
    .populate('post', 'description');




const getPostsByUserId = async (userId) => {
    const user = await User.findById(userId).populate('posts', 'description -createdAt -updatedAt -__v');
    return user ? user.posts : [];
}

const followUser = async (userId, followId) => {
    await User.findByIdAndUpdate(userId, { $addToSet: { following: followId } });
    await User.findByIdAndUpdate(followId, { $addToSet: { followers: userId } });
    return { message: 'Comenzaste a seguir a este usuario exitosamente' };
}

const unfollowUser = async (userId, followId) => {
    await User.findByIdAndUpdate(userId, { $pull: { following: followId } });
    await User.findByIdAndUpdate(followId, { $pull: { followers: userId } });
    return { message: 'Dejaste de seguir a este usuario exitosamente' };
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getCommentsByUserId,
    getPostsByUserId,
    followUser,
    unfollowUser
};