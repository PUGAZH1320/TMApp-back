const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema ({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type: String,
        required: true
    },
    markdown:{
        type: String,
        required: true,
    },
    tagIds:{
        type: [String],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Task = mongoose.model('task', TaskSchema);