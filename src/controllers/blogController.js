const blogModel = require("../models/blog");

function checkTags(tags) {
  let arr = [];
  for (let i = 0; i < tags.length; i++) {
    let c = 1;
    for (let j = 0; j < tags[i].length; j++) {
      if (tags[i][j] != " ") 
      c = 0;
    }
    if (!(tags[i] == "" || c)) {
      arr.push(tags[i]);
    }
  }
  return arr;
}
const createBlog = async function (req, res) {
  try {
    let data = req.body;
    // taking authorId from body
    const authdata = data.authorId;
    // accessing authorId from token
    let authId = req.decodedToken.authorId;
    if (authdata != authId) 
      return res.status(404).send({ status: false, msg: "not a valid author to create a blog" });
    
      data.tags = checkTags(data.tags);
      data.subcategory=checkTags(data.subcategory);

    const blog = await blogModel.create(data);
    res.status(201).send({ status: true, data: blog });
  } catch (error) {
    res.status(400).send({ status: false, msg: error.message });
  }
};

const getBlogData = async (req, res) => {
  try {
    let query = req.query;
    // accessing authorId from token
    let authId = req.decodedToken.authorId;
    // authorization of author 
    if (query["authorId"] != authId && query["authorId"])
      return res.status(404).send({ status: false, msg: "blog not found" });
    query.authorId = authId;
    // requirement:- isDeleted(false) and isPublished(true)
    query.isDeleted = false;
    query.isPublished = true;
// checking if the blog is present with that query(key-value);
    let doc = await blogModel.find(query);
    if (doc.length == 0) {
      return res.status(404).send({ status: false, msg: "Document not found" });
    }
    // return the all the data that matches the conditions
    res.status(200).send({ status: true, msg: doc });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updatedBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    let { title, body, tags, subcategory } = req.body;
    tags = checkTags(tags);
    // updating blog contents that are provided in req.body
    let updateContent = {
      title: title,
      body: body,
      $push: { tags: tags, subcategory: subcategory },
      isPublished: true,
      publishedAt: `${Date.now()}`,
    };
    // Update the blog fields

    const updateBlog = await blogModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      updateContent,
      { new: true }
    );
// checking if the document isDeleted(true) and is not present in database
    if (!updateBlog)
      return res.status(404).send({ status: false, msg: "No such data present" });
//removing duplicate values from tags and subcategory
    let tagSet = new Set([...updateBlog.tags]);
    let subSet = new Set([...updateBlog.subcategory]);
    updateBlog.tags = Array.from(tagSet);
    updateBlog.subcategory = Array.from(subSet);

  //pushing and updating new and distinct values of tags and subcategory  
    let pushData = await blogModel.findOneAndUpdate(
      { _id: blogId },
      {$set:updateBlog},
      {new:true}
    );

    // Return the updated blog document in the response
    res.status(200).send({status: true,
        message: "Blog updated successfully",
        data: pushData,
      });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const deleteBlogByPathParam = async (req, res) => {
  try {
    let bId = req.params.blogId;

    // fetching data from DB under below conditions
    let blogData = await blogModel.findOne({ _id: bId, isDeleted: false });
// if blog is not present  
    if (!blogData)
      return res.status(404).send({ status: false, msg: "Document not found" });

    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: bId },
      { isDeleted: true, deletedAt: `${Date.now()}` }
    );
    res.status(200).send({ status: true, message: "" });
  } catch (err) {
    res.status(500).send({ status: false, Error: err.message });
  }
};

const deleteBlogByQueryParam = async (req, res) => {
  try {
    let filterData = req.query;
    let authId = req.decodedToken.authorId;
    if (filterData.authorId != authId && filterData["authorId"])
      return res.status(404).send({status: false,msg: "Filter AuthorID is not matched with login Author"});

    // filterData["authorId"] = authId;
    let existData = await blogModel.findOne(filterData);

    if (!existData) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog not Found of login Author" });
      //   if isDeleted true in database or we are passing different attributes in query params
    }
    if (existData.isDeleted)
      return res
        .status(400)
        .send({ status: false, msg: "Blog is already deleted" });

    let deletedBlog = await blogModel.updateMany(
      filterData,
      { isDeleted: true, deletedAt: `${Date.now()}` },
      { new: true }
    );

    res.status(200).send({ status: true, message: "" });
  } catch (err) {
    res.status(500).send({ status: false, ErrorMsg: err.message });
  }
};

module.exports = {
  createBlog,
  getBlogData,
  updatedBlog,
  deleteBlogByPathParam,
  deleteBlogByQueryParam,
};