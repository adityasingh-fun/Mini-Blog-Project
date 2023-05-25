const mongoose=require('mongoose');

const authorModel=new mongoose.Schema({
    fname:{
        type: String,
        required:true
    },
    lname :{
        type:String,
        required:true
    },
    title:{
        type : String,
        enum : ["Mr", "Mrs", "Miss"],
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('authorData',authorModel);