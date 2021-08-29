module.exports = (app) => {
    const users = require('../controllers/user.js');
    const middleware = require('../controllers/middleware.js');
    const verifyToken = middleware.verifyToken;
    const isAdmin = middleware.isAdmin;

    // New User
    app.post('/register', users.register);

    // Login user
    app.post('/login', users.login);

    // Logout user
    app.get('/logout',users.logout);

    //Me api
    app.get('/me',verifyToken,users.me);

    // Retrieve all Users
    app.get('/users',[verifyToken, isAdmin],users.findAll);

}