const User = require('../models/user.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../../config/database.config.js');

// New user
exports.register = (req, res) => {    
    if(!req.body) {
        return res.status(400).send({
            message: "User data can not be empty"
        });
    }
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);     
    const user = new User({
        username: req.body.username,
        password : hashedPassword,
        email: req.body.email || 'default@email.com',
        phoneNumber: req.body.phoneNumber,
        totalSpendAmount: 0,
        totalPaidAmount: 0,
        finalStatus: 0,
    });
    
    user.save()
    .then(data => {
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 1 day
          });
          res.status(200).send({ auth: true, token: token, data });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Creating the User failed."
        });
    });
};

// Login
exports.login = (req, res) => {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 1 day
        });
        res.status(200).send({ auth: true, token: token });
      });
}

// Logout 
exports.logout = (req, res) => {
    res.status(200).send({ auth: false, token: null });
}

// Get all users.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

exports.me = (req,res, next) => {
    var token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        User.findById(decoded.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            
            res.status(200).send(user);
          });
    });
}