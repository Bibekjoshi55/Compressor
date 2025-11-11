const mongoose = require('mongoose');



const ImageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    originalName: {
        type: String,
       
    },
    originalSize: {
        type: Number,
        
    },
    compressedSize: {
        type: Number
    },
    mimeType: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    },
    originalPath: {
        type: String,
        
    },
    compressedPath: {
        type: String
    },
    compressionRatio: {
        type: Number,
        default: 1
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Image', ImageSchema);


