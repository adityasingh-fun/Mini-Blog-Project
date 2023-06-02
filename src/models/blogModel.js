const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Blog title is requird',
        trim: true
    },
    body: {
        type: String,
        required: 'Blog body is required',
        trim: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Author',
        required: 'Blog Id is required'
    },
    tags: [{type: String,trim:true}],
    category: {
        type: String,
        trim: true,
        required: 'Blog category is required'
    },
    subcategory: [{type: String,trim:true}],
    isPublished:{
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
},{timestamps:true})

module.exports = mongoose.model('Blog',blogSchema)