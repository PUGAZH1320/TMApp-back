const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    company: {
        type:String
    },
    website: {
        type:String
    },
    location: {
        type:String
    },
    status: {
        type:String,
        required: true
    },
    skills: {
        type:[String],
        required: true
    },
    bio: {
        type:String,
        required: true
    },
    githubusername: {
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Profile = mongoose.model('profile',ProfileSchema);