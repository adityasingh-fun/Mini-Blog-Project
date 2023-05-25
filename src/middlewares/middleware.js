
const authorModel = require('../models/author');
const blogModel = require('../models/blog');

const valiEmail = async function (req, res, next) {

    try {
        const email = req.body.email;
        const pattern = /^\w+@[a-z]+?\.[a-z]{2,3}$/;
        const found = email.match(pattern);
        if (!found) {
            return res.status(400).send({ status: false, msg: "Inavlid Email" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
    
}

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

const validBlogId = async function (req, res, next) {
    try {
        let id = req.params.blogId;
        let validBlog = await blogModel.findById({ _id: id });
        if (!validBlog) {
            return res.status(404).send({ status: false, msg: "Inavlid Blog Id" });
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { reqBodyCheck, validAuthor, validBlogId, valiEmail };