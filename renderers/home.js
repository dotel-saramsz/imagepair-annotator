const models = require('../models/models');
const mongoose = require('../db/mongoose').mongoose;
const fs = require('fs');
const config = require('../config');


const executeLogic = async (req,res,records) => {
    let details = await Promise.all(records.map( async (record) => {
        let total =  await models.ImagePair.countDocuments({tiffName: record.tiffName});
        let classified = await models.ImagePair.countDocuments({tiffName: record.tiffName,classified: true});
        return {total: total, classified:classified, percentage: 100*classified/total, record: record};
    }));
    res.render('home.hbs',{
        details: details,
    });
}

const render = (req,res) => {
    folder_path = config.TIFF_URL;
    //fetch the existing tiff_folder records from mongodb
    models.ImageTiff.find().then((records) => {
        //if no records, then add records by reading the directory
        if (records.length == 0) {
            fs.readdir(folder_path, async (err,folders) => {
                if(err) {
                    return console.log('Error in reading the directory: '+ err);
                }
                // for each tiff_folder, add a record in the database.
                
                for (i=0;i<folders.length;i++){
                    tiffFolder = new models.ImageTiff({
                        tiffName: folders[i],
                    });
                    await tiffFolder.save().then((savedDoc) => {
                        console.log("Inserted a tiff folder record: "+ savedDoc)
                    },(err) => {
                        console.log("Error in inserting the tiff folder record: " + err);
                        res.status(500).send("Error in inserting the tiff folder record: " + err);
                    });
                }

                render(req,res);
            });
        }
        else {
            //TODO- Records are already present in the database but still check for any refreshes
            //send the obtained records to client side via a function
            executeLogic(req,res,records);
        }
    }).catch((err) => {
        console.log('Error in fetching the tiff folder records from database: '+ err);
        res.status(400).send('Error in fetching the tiff folder records from database: '+ err);
    });
}

module.exports.render = render;