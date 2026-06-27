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
        toObject: { virtuals: true },
        id: false,
        toJSON: { 
            virtuals: true,
            transform: function(doc, ret) {
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.__v;
                return ret;
            }
        }
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