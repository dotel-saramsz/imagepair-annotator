const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI,{useNewUrlParser: true}, ()=>{
    console.log('Database connection established');
});

module.exports = {mongoose};