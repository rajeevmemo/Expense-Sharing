var jwt = require('jsonwebtoken');
var config = require('../../config/database.config.js');
const User = require('../models/user.js');


exports.verifyToken =  function verifyToken(req, res, next) {
  var token = req.headers['x-auth-token'];
  if (!token)
    return res.status(401).send({ auth: false, message: 'Please provide token.' });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });    
    req.userId = decoded.id;
    next();
  });
}

exports.isAdmin = function isAdmin( req, res, next) {
  User.findById(req.userId)
  .then(user => {
      if(user.username === "administrator"){
        next()
      } 
      else {
        res.status(401).send({message:"You are not authorized to do this"});
      }
  }).catch(err => res.status(400).send(err))
}
