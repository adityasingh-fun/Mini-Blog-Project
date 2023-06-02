const authorModel = require('../models/authorModel');
const jwt = require('jsonwebtoken');

const isValid = function(value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidTitle = function(title){
    return ['Mr','Miss','Mrs'].indexOf(title) !== -1
}

const isVaidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const registerAuthor = async function(req,res){
    try{
        const requestBody = req.body;
        if(!isVaidRequestBody(requestBody)){
            return res.status(400).send({status:false,message:"Invalid request parameters.Please provide author details"})
        }

        // Extract params
        const {fname, lname, title, email, password} = req.body; // Object destructuring

        // Validation Starts
        if(!isValid(fname)){
            return res.status(400).send({status:false,message:'First name is required'})
        } 

        if(!isValid(lname)){
            return res.status(400).send({status:false,message:"Last name is required"})
        }

        if(!isValid(title)){
            return res.status(400).send({status:false,message:"Title is required"})
        }

        if(!isValidTitle(title)){
            return res.status(400).send({status:false,message:"title should be among Mr, Miss and Mrs"})
        }

        if(!isValid(email)){
            return res.status(400).send({status:false,message:"Email is required"})
        }

        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).send({status:false,message:"Email should be a valid email"})
        }

        if(!isValid(password)){
            return res.status(400).send({status:false,message:"Password is required"})
        }

        const isemailAlreadyUsed = await authorModel.findOne({email})

        if(isemailAlreadyUsed){
            return res.status(400).send({status:false,message:`${email} email address is already registered`})
        }
        // Validation Ends
        const newAuthor = await authorModel.create(req.body);
        res.status(201).send({status:true,message:"Author created successfully",data:newAuthor})
    }
    catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}

const loginAuthor = async function(req,res){
    try{
        const requestBody = req.body;
        if(!isVaidRequestBody(requestBody)){
            return res.status(400).send({status:false,message:"Invalid request parameters. Please provide login details"})
        }

        // Extract params
        const {email,password} = req.body;

        // Validation starts
        if(!isValid(email)){
            return res.status(400).send({status:false,message:"Email is required"})
        }

        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).send({status:false,message:"Email should be a valid email address"})
        }

        if(!isValid(password)){
            return res.send({status:false,message:"Password is required"})
        }
        // Validation ends
        const author = await authorModel.findOne({email:email,password:password})

        if(!author){
            return res.status(401).send({status:false,message:"Invalid login credentials"})
        }

        const token = jwt.sign({
            authorId:author._id,
            name: "Aditya Singh",
            Designation: "Software Developer"
        },"Aditya's secret key to generate token when author passes all the validations when login API is hit")

        res.setHeader("x-api-key",token);
        res.status(200).send({status:true,token:token})
    }
    catch(error){
        res.status(500).send({status:false,message: error.message})
    }
}

module.exports = {registerAuthor,loginAuthor}