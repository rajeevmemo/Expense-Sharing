const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: {type: String, 
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,},
    phoneNumber: Number,
    totalSpendAmount: { type: Number, defalt: 0 },
    totalPaidAmount: { type: Number, defalt: 0 },
    finalStatus: { type: Number, defalt: 0 } 
});
module.exports = mongoose.model('User', UserSchema);