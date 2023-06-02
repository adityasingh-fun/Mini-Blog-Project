const jwt = require('jsonwebtoken');

const authorAuthentication = async function(req,res,next){
    try{
        const token = req.headers['x-api-key'];
        if(!token){
            return res.status(403).send({status:false,message:"Missing authentication token in request"})
        }

        const decoded = jwt.verify(token,"Aditya's secret key to generate token when author passes all the validations when login API is hit")
        if(!decoded){
            return res.status(403).send({status:false,message:"Invalid authentication token in request"})
        }
        req.authorId = decoded.authorId
        next()
    }
    catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}

module.exports = {authorAuthentication}