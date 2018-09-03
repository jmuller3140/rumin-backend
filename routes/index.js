var express = require('express');
var router = express.Router();
var app = express();
var jwt = require('jsonwebtoken');
var moment = require('moment');
var mongoose = require('mongoose');
require('dotenv').config('./.env');

const Entry = require('../models/entry');
const checkAuth = require('../middleware/check-auth');


/* GET home page. */
router.get(process.env.URL_HOME, checkAuth, (req, res, next) => {

   // Entry.remove({}).exec();
   // console.log("success in deletion");
  Entry.find({userId: req.userData.userId})
  .exec()
  .then(entries => {
        console.log(entries);
        const data = [];
        for(var i=0; i< entries.length; i++){
          data.push({timestamp: entries[i].date, id: entries[i]._id, entry: entries[i].entry});
        }
        data.reverse();
        res.status(200).json(data);

    })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });

});


router.post(process.env.URL_HOME, checkAuth, function(req, res) {

    if(!req.body || req.body.length === 0) {
      console.log('request body not found');
      return res.sendStatus(400);
  }
  console.log(req.body.id);
    Entry.findByIdAndRemove(req.body.id, function(err, entry) {
      console.log("Deleting Entry");
      if(err){
        throw err;
      }
    })
    .then(result => {
      console.log(result);
      res.json({success: "Your entry deleted successfully", status: 200});
  })
  .catch(err => console.log("The error is " + err));

});


router.put(process.env.URL_HOME, checkAuth, function(req, res) {
      if(!req.body || req.body.length === 0) {
      console.log('request body not found');
      return res.sendStatus(400);
  }
   console.log(req.body.id);
   Entry.findByIdAndUpdate(req.body.id, {entry: req.body.editorStateConverted}, (err, todo) => {
    // Handle any possible database errors
        if (err){
          throw err;
        }
    })
    .then(result => {
      console.log(result);
      res.json({success: "Your entry updated successfully", status: 200});
  })
  .catch(err => console.log("The error is " + err));
});




module.exports = router;
