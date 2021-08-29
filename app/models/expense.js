const mongoose = require('mongoose');

// SubSchemas
const FlatmateSchema = mongoose.Schema({
    name: { type: String, required: true },
    expense: { type: Number },
    owes: { type: Number , default: 0}
},{ _id : false })

exports.newExpenseSchema = NewExpenseSchema = mongoose.Schema(
    {
        payee: { type: String, required: true },
        flatmates: [FlatmateSchema],
        totalBillAmount: { type: Number, required: true },
        splitEqual : { type: Boolean, required: true },
    },{ _id : false }
);

// Main Schema
ExpenseSchema = mongoose.Schema({
    userId : { type: String, required: true },
    newExpense :{type: NewExpenseSchema, required: true} 
},{ timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);