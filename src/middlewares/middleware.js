
const authorModel = require('../models/author');
const blogModel = require('../models/blog');

const validEmail = async function (req, res, next) {

    try {
        const email = req.body.email;

        const pattern =
          /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        const found = email.match(pattern);
        if (!found) {
            return res.status(400).send({ status: false, msg: "You give wrong Email format" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
    
}

const uniqueEmail=async function(req,res,next){
   try {
     const uEmail = req.body.email;
     let checkEmail = await authorModel.findOne({ email: uEmail });
     if (checkEmail) {
      return res.status(401).send({status:false,msg:"emailId already exist"});
     }
     next();
   } catch (error) {
     return res.status(500).send({ status: false, msg: error.message });
   }

}

const reqBodyCheck = async function (req, res, next) {
    try {
        let data = req.body;
        if (Object.keys(data).length === 0) {
          return res
            .status(400)
            .send({ status: false, msg: "Request body is not present" });
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
        if(authId.length!==24){
            return res.status(400).send({status:false,msg:"provide valid author ID"})
        };
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
      if (id.length !== 24) {
        return res
          .status(400)
          .send({ status: false, msg: "provide valid blog ID" });
      }
      let validBlog = await blogModel.findById({ _id:id});
      if (!validBlog) {
        return res.status(404).send({ status: false, msg: "invalid blog ID" });
      }
       let validBlog1 = await blogModel.findOne({ _id: id, isDeleted: false });
      if (!validBlog1) {
        return res
          .status(404)
          .send({ status: false, msg: "Blog is already deleted" });
      }
      next();
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}





module.exports = {
  reqBodyCheck,
  validAuthor,
  validBlogId,
  validEmail,
  uniqueEmail
};