const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const homeRenderer = require('./renderers/home');
const imageFetcher = require('./renderers/imageFetcher');
const classUpdater =  require('./renderers/classUpdater');
const labelServer = require('./renderers/labelServer');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/static'));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('receiveObj', (obj) => {
    return JSON.stringify(obj);
})

app.get('/',(req,res) => {
    homeRenderer.render(req,res);
});

app.get('/:tiffName',(req,res) => {
    res.render('annotation.hbs',{
        tiffName:req.params.tiffName
    });
});

app.get('/:tiffName/images',(req,res) => {
    imageFetcher.fetch(req,res);
});

app.get('/:tiffName/labels',(req,res) => {
    labelServer.serve(req,res);
})

app.post('/:tiffName/update',(req,res) => {
    //TODO- After getting the pairNumber and selectedClass values, update the database accordingly
    classUpdater.update(req,res);
});

app.listen(config.PORT, () => {
    console.log(`Listening at PORT: ${config.PORT}`);
});

