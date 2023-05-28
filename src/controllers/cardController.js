const cardModel = require('../models/cardModel');

const createCard = async function(req,res){
    let data = req.body;
    let savedData = await cardModel.create(data);
    res.status(201).send({status:true,message:savedData})
}

const getAllCards = async function(req,res){
    let data = await cardModel.find();
    res.status(200).send({status:true,message:data})
}

module.exports = {createCard, getAllCards}