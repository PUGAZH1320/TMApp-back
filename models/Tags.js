const mongoose = require('mongoose');

const TagsSchema = new mongoose.Schema ({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    id:{
        type: String,
        required: true
    },
    label:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Tags = mongoose.model('tags', TagsSchema);