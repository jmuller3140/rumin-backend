var express = require('express');
var router = express.Router();
var app = express();
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var AWS = require('aws-sdk');
require('dotenv').config('./.env');

const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');


// /* GET users listing. */
router.post(process.env.URL_LOGIN, (req, res, next) => {
	if(!req.body || req.body.length === 0) {
	   console.log('request body not found');
	    return res.status(400);
  }


  User.find({ email: req.body.email })
  	.exec()
  	.then(user => {
  		if(user.length < 1){
  			console.log('login failed');
  			return res.status(401).json({
  				message: 'Auth failed'
  			})
  		}
  		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
  			if(err){
  				return res.status(401).json({
  					message: 'Auth Failed'
  				});
  			}
  			if(result){
  				const token = jwt.sign({email: user[0].email,
  										userId: user[0]._id,
  										firstName: user[0].firstName,
  										lastName: user[0].lastName
  									},
  									process.env.SECRET_KEY,
  									{
  										expiresIn:'2hr'
  									});

  				return res.status(200).json({
  					message: 'Auth successful',
  					token: token
  				});
  			}
  			res.status(401).json({
  					message: 'Auth Failed'
  				});
  		});
  	})
  	.catch(err => {
  		res.status(500).json({
  			error: err
  		})
  	})


 });


module.exports = router;






// AWS.config.update(awsConfig);

// var docClient = new AWS.DynamoDB.DocumentClient();

//   var table = "user";
//   var params = {
//       TableName:table,
//       Key:{
//           "email": req.body.email,
//           }
//   };

//   console.log("Fetching user...");
//   docClient.get(params, function(err, data) {
//       if (err) {
//           console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//       } else {
//           console.log("GetItem successful:", JSON.stringify(data, null, 2));
//           bcrypt.compare(req.body.password, data.Item.password, (err, result) => {
//            if(err){
//             console.log("hi");
//              return res.status(401).json({
//                message: 'Auth Failed'
//              });
//            }
//            console.log(result);
//            if(result){
//            const token = jwt.sign({email: data.Item.email,
//                        firstName: data.Item.firstName,
//                        lastName: data.Item.lastName
//                      },
//                      process.env.SECRET_KEY,
//                      {
//                        expiresIn:'2hr'
//                      });

//            return res.status(200).json({
//              message: 'Auth successful',
//              token: token
//            });
//          }
//          console.log("hi2");
//            res.status(401).json({
//            message: 'Auth Failed'
//          });
//            });
//           }
//   });
