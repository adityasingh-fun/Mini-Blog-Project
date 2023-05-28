const customerModel = require('../models/customerModel');

const createCustomer = async function(req,res){
    let data = req.body;
    let savedData = await customerModel.create(data);
    res.status(201).send({status:true,message:savedData})
}

module.exports = {createCustomer}