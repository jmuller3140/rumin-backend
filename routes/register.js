var express = require('express');
var router = express.Router();
var app = express();
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token');
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
require('dotenv').config('./.env');

const User = require('../models/user');


/* GET users listing. */


router.post(process.env.URL_REGISTER, function(req, res){

// var table = "user";
// var params = {
//     TableName:table,
//     Key:{
//         "email": req.body.email,
//         }
// };

//   console.log("Fetching user...");
//  docClient.get(params, function(err, data){
//  	if()
//  })
// docClient.put(params, function(err, data){
// 	if (err) {
//         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Added item:", JSON.stringify(data, null, 2));
//     }
// })

User.find({email: req.body.email})
.exec()
.then(user => {
	if(user.length >= 1){
		res.status(409).json({
			message: 'email already exists'
		});
	} else {
		bcrypt.hash(req.body.password, 10, (err, hash) => {
    	if(err){
    		return res.status(500).json({
    			error: err
    		});
    	} else {
    		if (req.body.email && req.body.firstName && req.body.lastName && req.body.password) {
			  	var user = new User({
			  	_id: mongoose.Types.ObjectId(),
			    email: req.body.email,
			    firstName: req.body.firstName,
			    lastName: req.body.lastName,
			    password: hash,
			    created_At: new Date()
			    });
			    user.
			    save()
			    .then(result => {
			    	console.log('YES');
			    	res.status(201).json({
			    		message: 'user created'
			    	});
			    })
			    .catch(err => {
			    	console.log(err);
			    	res.status(500).json({
			    		error: err
			    		});
			   	 	});
    				}

				}
			})
		}

	})
.catch(err => {
	console.log(err);
	res.status(500).json({
		error: err
		});
	});
});


router.delete("/:userId", (req, res, next) => {
	User.remove({_id: req.params.userId})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'User successfully deleted'
		})
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
});

module.exports = router;
