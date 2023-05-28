const customerModel = require('../models/customerModel');

const createCustomer = async function(req,res){
    let data = req.body;
    let savedData = await customerModel.create(data);
    res.status(201).send({status:true,message:savedData})
}

const getActiveCustomers = async function(req,res){
    let data = await customerModel.find({status:"ACTIVE"});
    return res.status(200).send({status:true,msg:data})
}

const deleteCustomer = async function(req,res){
    let deleteUser = await customerModel.findByIdAndUpdate(
        {_id:req.params.customerID},
        {$set: {isDeleted:true}},
        {new:true}
    )
    res.status(200).send({status:true,message:"Customer is deleted",data:deleteUser})
}

module.exports = {createCustomer,getActiveCustomers, deleteCustomer}