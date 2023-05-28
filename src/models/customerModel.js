const mongoose  = require('mongoose');

const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: String,
    DOB: Date,
    emailID: String,
    address: String,
    customerID: String,
    status:{
        type: String,
        enum: ["ACTIVE","INACTIVE"]
    }
},{timestamps:true});

module.exports = mongoose.model('Customer',customerSchema);