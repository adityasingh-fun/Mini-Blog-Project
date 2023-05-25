const authorModel = require('../models/author')

const createAuthor = async function (req, res) {
    try {
        const data = req.body;
        const author = await authorModel.create(data);
        res.status(201).send({ status:true, authorData: author })
    }
    catch(error){
        res.status(400).send({status:false, msg:error.message})
    }
}

module.exports = { createAuthor }