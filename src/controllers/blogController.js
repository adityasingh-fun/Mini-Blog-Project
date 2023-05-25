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
        const updateData = req.body;

        // Check if the blogId exists and is not deleted

        const existingBlog = await blogModel.findOne({ _id: blogId });
        if (!existingBlog) {
            return res.status(404).send({ error: "Blog not found" });
        }


        // Update the blog fields
        const updateBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { title: updateData.title, body: updateData.body, tags: updateData.tags, subcategory: updateData.subcategory, isPublished: true, publishedAt: new Date() },
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
        let blogData = await blogModel.findOne({ _id: bId, isDeleted: false });
        if (!blogData) {
            return res.status(404).send({ status: false, msg: "Document not found" })
        }
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: bId }, { isDeleted: true });
        res.status(200).send("Deleted");
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like

const deleteBlogByQueryParam = async (req, res) => {
    try {
        let filterData = req.query;
        if (!filterData) {
            return res.status(404).send({ status: false, msg: "Blog not Found" });

        }
        let deletedBlog = await blogModel.updateMany(filterData, { isDeleted: true }, { new: true });
        res.status(200).send("Deleted")
    }
    catch (err) {
        res.status(500).send({ status: false, ErrorMsg: err.message });
    }
}

module.exports = { createBlog, getBlogData, deleteBlogByPathParam, deleteBlogByQueryParam,updatedBlog }