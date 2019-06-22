const mongoose = require('../db/mongoose').mongoose;

var imageTiffSchema = new mongoose.Schema({
    tiffName: {
        type: String,
        required: true,
        index: true
    },

    totalPairs:{
        type: Number,
    },

    totalClassified:{
        type: Number,
    }
});

var imagePairSchema = new mongoose.Schema({
    tiffName: {
        type: String,
        required: true
    },
    pairNumber: {
        type: String,
        required: true 
    },
    preimg: String,
    postimg: String,
    class: String,
    classified: {
        type: Boolean,
        required: true
    }
});

imagePairSchema.index({tiffName:1, pairNumber:1});

var ImageTiff = mongoose.model('ImageTiff', imageTiffSchema);
var ImagePair = mongoose.model('ImagePair', imagePairSchema);

module.exports = {ImageTiff, ImagePair};