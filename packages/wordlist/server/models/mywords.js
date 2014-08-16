'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * MyWord Schema
 */
var MyWordSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    word: {
        type: String,
        required: true,
        trim: true
    },
    serial:{
        type: Number,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: false,
        trim: true
    },
    phonetic: {
        type: String,
        required: false,
        trim: true
    },
    examples : [String],
    tags: [{
        type: String,
        required: false,
        trim: true
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
MyWordSchema.path('word').validate(function(title) {
    return !!title;
}, 'Hello...where is the word?');

// MyWordSchema.path('content').validate(function(content) {
//     return !!content;
// }, 'Content cannot be blank');

/**
 * Statics
 */
MyWordSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('MyWord', MyWordSchema);
