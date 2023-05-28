const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cardSchema = new mongoose.Schema({
    cardNumber: String,
    cardType: {
        type: String,
        enum: ["REGULAR","SPECIAL"]
    },
    customerName: String,
    status:{
        type:String,
        enum:["ACTIVE","INACTIVE"],
        default: "ACTIVE"
    },
    vision:String,
    customerID:{
        type: ObjectId,
        ref: Customer
    }
},{timestamps:true});

module.exports = mongoose.model('Card',cardSchema);