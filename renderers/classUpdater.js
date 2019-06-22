const models = require('../models/models');
const mongoose = require('../db/mongoose').mongoose;
const config = require('../config');

const update = (req,res) => {
    updateInfo = req.body;
    models.ImagePair.findOneAndUpdate(
        {pairNumber:req.body.pairNumber},
        {
            $set: {
                class: req.body.selectedClass,
                classified: true
            }
        },
        { new: true})
        .then((doc) => {
            console.log(doc);
            res.send(doc);
        })
        .catch((err) => {
            console.log(`Error in updating the database: ${err}`);
            res.status(500).send({
                err: true,
                message: `Error in updating the database: ${err}`
            });
        });
}

module.exports.update = update;