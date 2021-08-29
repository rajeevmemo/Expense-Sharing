module.exports = (app) => {
    const expense = require('../controllers/expense.js');
    const middleware = require('../controllers/middleware.js');
    const verifyToken = middleware.verifyToken;
    const isAdmin = middleware.isAdmin;

    // Create a new Expense
    app.post('/expenses', verifyToken, expense.create);

    // Get all expenses 
    app.get('/expenses', verifyToken, expense.findAll);

    // Get a expense with expenseId
    app.get('/expenses/:expenseId', verifyToken, expense.findOne);

}