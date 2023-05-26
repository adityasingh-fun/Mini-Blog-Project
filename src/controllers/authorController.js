const authorModel = require("../models/author");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    const data = req.body;
    const author = await authorModel.create(data);
    res.status(201).send({ status: true, data: author });
  } catch (error) {
    res.status(400).send({ status: false, msg: error.message });
  }
};

const loginAuthor = async function (req, res) {
  let authorEmail = req.body.email;
  let password = req.body.password;

  let emailAuthor = await authorModel.findOne({ email: authorEmail });
  if (!emailAuthor)
    return res.status(404).send({
      status: false,
      msg: "Email is incorerct",
    });
  let passAuthor = await authorModel.findOne({password:password });
  if (!passAuthor)
    return res.status(404).send({
      status: false,
      msg: "Email is Correct but Password is not correct",
    });
  let token = jwt.sign({ authorId: author._id }, "blogging-group-10");
  res.setHeader("x-api-key", token);
  res.send({ status: true, data: { token: token } });
};

module.exports = { createAuthor, loginAuthor };
