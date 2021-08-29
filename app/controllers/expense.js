const Expense = require('../models/expense.js');
const User = require('../models/user.js');
const expenseHelper = require('../helpers/expense.js');

// Create a new Expense
exports.create = (req, res) => {
    if(!req.body) { 
        return res.status(400).send({
            message: "Expense data can not be empty"
        });
    }
    checkTotal = parseInt(0)
    var flatmates = [req.body.newExpense.payee] 
    req.body.newExpense.flatmates.forEach(flatmate => {
        flatmates.push(flatmate.name);
        checkTotal = checkTotal + parseInt(flatmate.expense);
    });
    
    if(req.body.newExpense.totalBillAmount != checkTotal){
        return res.status(400).send({message: "Total not matching"})
    }

    const promises = []
    const usersNotFound = []
    flatmates.forEach((flatmate) => {
        promises.push(expenseHelper.UserExist(flatmate));
    })
    Promise.all(promises)
    .then((users)=>{
        users.forEach(user => {
            if(user){
                usersNotFound.push(user)
            }
        });

        if(usersNotFound.length > 0){
            return res.send({message: usersNotFound + " not found"})
        }
        else {
            // Create an expense
            const expense = new Expense({
                userId : req.userId,
                newExpense : req.body.newExpense,
                    });
            
            expense.save()
            .then(data => {
                expenseHelper.divideExpense(data);
                res.status(200).send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Expense not created."
                });
            });
        }
    }).catch((err) => {
        res.status(500).send(err)
    })
};

// Get all Expenses
exports.findAll = (req, res) => {
    Expense.find()
    .then(expenses => {
        if (expenses.length > 0) {            
            var expArr = Array();
            var expense = {};
            for(const ind in expenses){
                expense.payee = expenses[ind].newExpense.payee
                expense.totalamt = expenses[ind].newExpense.totalBillAmount;
                var flatmates = expenses[ind].newExpense.flatmates;
                expense.flatmates = Array();
                for(const index in flatmates ){ 
                    if(flatmates[index].name!=expense.payee)                   
                    expense.flatmates.push(flatmates[index].name +" owes "+ expense.payee+" :" +flatmates[index].owes);
                }
            }
            expArr.push(expense);
            res.status(200).send(expArr);

        } else { res.status(400).send({ message: "No Expense found"})}
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving expenses."
        });
    });
};


exports.findOne = (req, res) => {
    Expense.findOne({ _id:req.params.expenseId})
    .then(expense => {
        console.log(expense);
            
            var expensedata = {};  
            expensedata.id =  expense._id;         
            expensedata.payee = expense.newExpense.payee
            expensedata.totalamt = expense.newExpense.totalBillAmount;
            var flatmates = expense.newExpense.flatmates;
            expensedata.flatmates = Array();
            for(const index in flatmates ){ 
                if(flatmates[index].name!=expensedata.payee)                   
                expensedata.flatmates.push(flatmates[index].name +" owes "+ expensedata.payee+" :" +flatmates[index].owes);
            }
            res.status(200).send(expensedata);
        
        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving expenses for" + req.param.expenseId
        });
    });
}
