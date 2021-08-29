const User = require('../models/user.js')
const Expense = require('../models/expense.js')

exports.UserExist = (username) => {
    return new Promise((resolve, reject)=>{
      User.find({username : username}).then(docs => {
        if (!docs.length){
            resolve(username)
        }
        else {
            resolve(false);
        }
        }).catch(err => {
            reject(err)
        });
    })
  }

exports.divideExpense = (data) => {  
    payee = data.newExpense.payee;  
    // Adding expense to flatmates accs
    flatmatesArray = data.newExpense.flatmates;
    flatmatesCount = flatmatesArray.length
    share = data.newExpense.totalBillAmount / flatmatesCount
    for(const ind in flatmatesArray) {
        if(flatmatesArray[ind].name!=payee) {
            data.newExpense.flatmates[ind].owes = share;
        }
        User.findOne({username : flatmatesArray[ind].name}).then((userProfile => {
            if(userProfile.username==payee){
                userProfile.totalPaidAmount += data.newExpense.totalBillAmount;
                
            }

            if (data.newExpense.splitEqual) {                
                userProfile.totalSpendAmount += share; 
            } else {
                userProfile.totalSpendAmount += flatmatesArray[ind].expense; 
            }
            userProfile.finalStatus = userProfile.totalPaidAmount - userProfile.totalSpendAmount            
            userProfile.save()
            
        })
        
    ).catch(err => {console.log(err);
        })
    }
    data.save()   

}
