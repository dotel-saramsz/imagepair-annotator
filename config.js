const path = require('path');

module.exports.PORT = process.env.PORT || 3000;
module.exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/AnnotatorDB';
module.exports.TIFF_URL = path.join(__dirname,'static','tiffs');
module.exports.LABELS_URL = path.join(__dirname,'static','labels');