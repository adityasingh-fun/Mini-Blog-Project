const authorModel = require("../models/author");
const jwt = require("jsonwebtoken");

const createAuthor = async (req, res)=>{
  try {
    const {fname,lname,title,email,password}= req.body;
    const data={fname:fname,lname:lname,title:title,email:email,password:password}
    const author = await authorModel.create(data);
    res.status(201).send({ status: true, data: author });
  } 
  catch (error) {
    res.status(400).send({ status: false, msg: error.message });
  }
};

const loginAuthor = async (req, res) =>{
  let {email,password} = req.body;

  let emailAuthor = await authorModel.findOne({ email: email });
  if (!emailAuthor)
    res.status(404).send({status: false, msg: "Email is incorerct"});

  let passAuthor = await authorModel.findOne({password:password });
  if (!passAuthor)
    res.status(404).send({status: false,msg: "Email is Correct but Password is not correct"});

  let token = jwt.sign({ authorId: emailAuthor._id }, "blogging-group-10");
  res.setHeader("x-api-key", token);
  res.status(200).send({ status: true, data: { token: token } });
};

module.exports = { createAuthor, loginAuthor };
