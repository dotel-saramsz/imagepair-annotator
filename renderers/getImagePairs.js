const models = require('../models/models');
const mongoose = require('../db/mongoose').mongoose;
const fs = require('fs');
const path = require('path');
const config = require('../config');

const executeLogic = (req,res,imagePairs) => {
    console.log(`The length of image pair array from db is ${imagePairs.length}`);
    res.send(imagePairs);
}

const fetch = (req,res)=>{
    tiffName = req.params.tiffName;
    //search the database for any documents(i.e. Image Pairs) with tiffName
    models.ImagePair.find({tiffName:tiffName}).then((imagePairs) => {
        if(imagePairs.length == 0) {
            console.log(`No existing record for tiff ${tiffName}`);
            //read the images from the directory and insert into the mongodb database
            pre_imgs_path = path.join(config.TIFF_URL,tiffName,'pre');
            fs.readdir(pre_imgs_path, async (err,images) => {
                if(err) {
                    return console.log('Error in reading the image pair directory: '+ err);
                }

                for (i=0;i<images.length;i++) {
                    pairNumber = images[i].match(/pre_(\d{5})/)[1];
                    preimg = `/tiffs/${tiffName}/pre/${images[i]}`;
                    postimg = `/tiffs/${tiffName}/post/${images[i].replace('pre','post')}`;
                    imagePair = new models.ImagePair({
                        tiffName: tiffName,
                        pairNumber: pairNumber,
                        preimg: preimg,
                        postimg: postimg,
                        classified: false
                    });
                    await imagePair.save().catch((err)=>{
                        console.log('Error in inserting data into the imagepair collection: '+ err);
                        res.status(500).send('Erro in inserting data into the imagepair collection: '+ err);
                    });
                }
                fetch(req,res);
            });
        }
        else{
            executeLogic(req,res,imagePairs);
        }
    }).catch((err) => {
        console.log('Error in fetching the tiff pair records from database: '+ err);
        res.status(400).send('Error in fetching the pair folder records from database: '+ err);
    }); 
}

module.exports.fetch = fetch;