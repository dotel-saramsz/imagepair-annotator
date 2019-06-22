const models = require('../models/models');
const mongoose = require('../db/mongoose').mongoose;
const fs = require('fs');
const path = require('path');
const config = require('../config');

const serve = (req,res) => {
    tiffName = req.params.tiffName;
    filePath = path.join(config.LABELS_URL,`${tiffName}.csv`);
    // get all the records of imagePairs
    models.ImagePair.find({tiffName:tiffName,classified:true}).then((records) => {
        writeableRecords = records.map((record) => {
            return `${record.tiffName}_pre_${record.pairNumber}.jpg,${record.tiffName}_post_${record.pairNumber}.jpg,${record.class}`;
        }).join('\n');
        fs.writeFile(filePath,writeableRecords,(err, result) =>{
            if(err) {
                console.log(err);
                return res.status(500).send('Error in writing labels to a file');
            }
            res.download(filePath);
        });
    }).catch((err) => {
        console.log(err);
        res.status(404).send(`No labels found for the tiff image: ${tiffName}`);
    });
}

module.exports.serve = serve;