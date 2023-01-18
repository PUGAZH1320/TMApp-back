const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema ({
    personId:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    markdown:{
        type: String,
        required: true,
        unique: true
    },
    tags:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Task = mongoose.model('task', TaskSchema);