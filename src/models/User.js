const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        nickName: {
            type: String,
            required: [true, "El nickname es obligatorio"],
            unique: true,
            trim: true
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user'
});

userSchema.virtual('comentarios', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'user'
});

module.exports = mongoose.model('User', userSchema);