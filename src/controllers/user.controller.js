const { model } = require('mongoose');
const { User, Comment,Post } = require('../models/User');


const getUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch (error) {
        res.status(500).json({message: 'Error al obtener los usuarios'});
    }
};


const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        
        
        const user = await User.findById(id)
            .populate('comentarios') 
            .populate('posts', 'texto fecha') 
            .populate('followers', 'nickName'); 


        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener el usuario: ${error.message}` });
    }
};

const createUser = async (req, res) => {
    try {
        const {nickName} = req.body;
        const newUser = await User.create({
            nickName
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({message: 'Error al crear el usuario'});
    }

};
const seguirUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const idASeguir = req.params.idASeguir;

        const miUsuario = await User.findByIdAndUpdate(id, {
            $addToSet: { following: idASeguir }
        });

        const usuarioAseguir = await User.findByIdAndUpdate(idASeguir, {
            $addToSet: { followers: id }
        });


        res.status(200).json({ message: 'Comenzaste a seguir a este usuario exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al seguir al usuario', error: error.message });
    }
};



module.exports = {
    getUsers,
    getUserById,
    createUser,
    seguirUsuario,
}
