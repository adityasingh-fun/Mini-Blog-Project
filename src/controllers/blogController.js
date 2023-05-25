const blogModel = require('../models/blog');

const createBlog = async function (req, res) {
    try {
        const data = req.body;
        const blog = await blogModel.create(data);
        res.status(201).send({ status: true, vlogData: blog })
    }
    catch (error) {
        res.status(400).send({ status: false, msg: error.message })
    }
}

const getBlogData = async (req, res) => {

    let query = req.query;
    console.log(query);
    query["isDeleted"] = false;
    query["isPublished"] = true;
    try {

        let doc = await blogModel.find(query);
        if (doc.length == 0) {
            return res.status(404).send({ status: false, msg: "Document not found" })
        }
        res.status(200).send({ status: true, msg: doc });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return res.status(500).send({
            error: 'An error occurred while retrieving data.'
        });
    }
}

const updatedBlog = async function (req, res) {

    try {
        const blogId = req.params.blogId;
        const { title, body, tags, subcategory } = req.body;


        // Update the blog fields
        const updateBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { title:title, body: body, tags:tags, subcategory:subcategory, isPublished: true, publishedAt:Date.now() },
            { new: true }
        );

        // Return the updated blog document in the response
        res.status(200).send({
            status: true,
            message: "Blog updated successfully",
            data: updateBlog
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Server error" });
    }
};

const deleteBlogByPathParam = async (req, res) => {
    try {
        let bId = req.params.blogId;
        if(!bId){
            return res.status(400).send("path param must be present in url")
        }
        let blogData = await blogModel.findOne({ _id: bId, isDeleted: false });
        if (!blogData) {
            return res.status(404).send({ status: false, msg: "Document not found" })
        }
        let deletedBlog = await blogModel.findOneAndUpdate(
          { _id: bId },
          { isDeleted: true, deletedAt: Date.now() }
        );
        res.status(200).send("Deleted");
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

const deleteBlogByQueryParam = async (req, res) => {
    try {
        let filterData = req.query;
        if (!filterData) {
            return res.status(404).send({ status: false, msg: "Blog not Found" });

        }
        let deletedBlog = await blogModel.updateMany(
          filterData,
          { isDeleted: true, deletedAt: Date.now() },
          { new: true }
        );
        res.status(200).send("Deleted")
    }
    catch (err) {
        res.status(500).send({ status: false, ErrorMsg: err.message });
    }
}

module.exports = { createBlog, getBlogData,updatedBlog, deleteBlogByPathParam, deleteBlogByQueryParam }