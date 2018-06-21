var express = require('express');
var router = express.Router();
var app = express();
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
require('dotenv/config');

const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');


/* GET users listing. */
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
