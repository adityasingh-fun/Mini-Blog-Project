
const authorModel = require('../models/author');

const reqBodyCheck = async function (req, res, next) {
    try {
        let data = req.body;
        if (!data) {
            return res.status(400).send({ status: false, msg: "Request body is not present" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const validAuthor = async function (req, res, next) {
    try {
        let authId = req.body.authorId;
        let validAuthor = await authorModel.findById({ _id: authId });
        if (!validAuthor) {
            return res.status(404).send({ staus: false, msg: "Author does not exist" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { reqBodyCheck, validAuthor };