const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        text:{
            type:String,
            required:[true, "El texto es obligatorio"]

        },
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post",
            required:true

        },
        user:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true

        }

    },
    {
        timestamps:true,    
        toJSON: {
            transform: function(doc, ret) {
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.__v;
                return ret;
            }
        }

    }
)

module.exports = mongoose.model('Comment', commentSchema)