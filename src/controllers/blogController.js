const authorModel = require('../models/authorModel');
const blogModel = require('../models/blogModel');
const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createBlog = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request params. Please provide blog details" })
        }

        // Extract params
        const { title, body, authorId, tags, category, subcategory, isPublished } = req.body;

        // Validation starts
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: "Blog title is required" })
        }

        if (!isValid(body)) {
            res.status(400).send({ status: false, message: "Blog body is required" })
        }

        if (!isValid(authorId)) {
            return res.status(400).send({ status: false, message: "Author id is required" })
        }

        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: `${authorId} author id is not a valid id` })
        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Blog category is required" })
        }

        const author = await authorModel.findById(authorId);
        if (!author) {
            return res.status(400).send({ status: false, message: "Author doesnot exist" })
        }
        // Validations end

        const blogData = {
            title,
            body,
            authorId,
            category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null
        }
        if (tags) {
            if (Array.isArray(tags)) {
                blogData['tags'] = [...tags]
            }
            if (Object.prototype.toString.call(tags) === "[object string]") {
                blogData['tags'] = [tags]
            }
        }
        if (subcategory) {
            if (Array.isArray(subcategory)) {
                blogData['subcategory'] = [...subcategory]
            }
            if (Object.prototype.toString.call(subcategory) === "[object string]") {
                blogData['subcategory'] = [subcategory]
            }
        }

        const newBlog = await blogModel.create(blogData);
        res.status(201).send({ status: true, message: "New blog successfully created", data: newBlog })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const listBlog = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null, isPublished: true };
        const queryParams = req.query;
        if (isValidRequestBody(queryParams)) {
            const { authorId, category, tags, subcategory } = queryParams;
            if (isValid(authorId) && isValidObjectId(authorId)) {
                filterQuery['authorId'] = authorId
            }

            if (isValid(category)) {
                filterQuery['category'] = category.trim()
            }

            if (isValid(tags)) {
                const tagsArr = tags.trim().split(',').map(tag => tag.trim());
                filterQuery['tags'] = { $all: tagsArr }
            }

            if (isValid(subcategory)) {
                const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
                filterQuery['subcategory'] = { $all: subcatArr }
            }

            const blogs = await blogModel.find(filterQuery);

            if (Array.isArray(blogs) && blogs.length == 0) {
                return res.status(404).send({ status: false, message: "No blogs found" })
            }
            res.status(201).send({ status: true, message: "Blogs list", data: blogs })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const updateBlog = async function (req, res) {
    try {
        const requestBody = req.body;
        const params = req.params;
        const blogId = params.blogId;
        const authorIdFromToken = req.authorId;

        // Validation starts
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: `${blogId} is not a valid blod Id` })
        }

        if (!isValidObjectId(authorIdFromToken)) {
            return res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token Id` })
        }

        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null });
        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found" })
        }

        if (blog.authorId.toString() !== authorIdFromToken) {
            return res.status(401).send({ status: false, message: "Unauthorized access! Author's information doesnot match" })
        }

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "No parameters passed. blog unmodified", data: blog })
        }

        // Extract params
        const { title, body, tags, category, subcategory, isPublished } = requestBody;
        const updatedBlogData = {}

        if (isValid(title)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['title'] = title
        }

        if (isValid(body)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['body'] = body
        }

        if (isValid(category)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['category'] = category
        }

        if (isPublished !== undefined) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['isPublished'] = isPublished
            updatedBlogData['$set']['publishedAt'] = isPublished ? new Date() : null
        }

        if (tags) {
            if (!Object.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}

            if (Array.isArray(tags)) {
                updatedBlogData['$addToSet']['tags'] = { $each: [...tags] }
            }
            if (typeof tags === 'string') {
                updatedBlogData['$addToSet']['tags'] = tags
            }
        }

        if (typeof subcategory !== 'undefined') {
            if (!Object.hasOwnProperty.call(updatedBlogData, '$addToSet')) {
                updatedBlogData['$addToSet'] = {};
            }

            if (Array.isArray(subcategory)) {
                updatedBlogData['$addToSet']['subcategory'] = { $each: [...subcategory] };
            }

            if (typeof subcategory === 'string') {
                updatedBlogData['$addToSet']['subcategory'] = subcategory;
            }
        }

        // if (subcategory) {
        //     if (!Object.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}

        //     if (Array.isArray(subcategory)) {
        //         updatedBlogData['$addToset']['subcategory'] = { $each: [...subcategory] }
        //     }

        //     if (typeof subcategory === 'string') {
        //         updatedBlogData['$addToSet']['subcategory'] = subcategory
        //     }
        // }

        const updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            updatedBlogData,
            { new: true }
        )
        res.status(200).send({ status: true, message: "Blog updated successfully", data: updatedBlog })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const deleteBlogById = async function (req, res) {
    try {
        const params = req.params;
        const blogId = params.blogId;
        const authorIdFromToken = req.authorId;

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: `${blogId} is not a vlaid blog id` })
        }

        if (!isValidObjectId(authorIdFromToken)) {
            return res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid id` })
        }

        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null })
        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found" })
        }

        if (blog.authorId.toString() !== authorIdFromToken) {
            return res.status(401).send({ status: false, message: "Unauthorized access! Author information doesnot match" })
        }

        await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { isDeleted: true, deletedAt: new Date() } }
        )
        res.status(200).send({ status: true, message: "Blog deleted successfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

const deleteBlogByParams = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null };
        const queryParams = req.query;
        const authorIdFromToken = req.authorId;

        if (!isValidObjectId(authorIdFromToken)) {
            return res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid id` })
        }

        if (!isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "No query params recieved. aborting delete operation" })
        }

        const { authorId, category, tags, subcategory, isPublished } = queryParams;
        if (isValid(authorId) && isValidObjectId(authorId)) {
            filterQuery['authorId'] = authorId
        }

        if (isValid(category)) {
            filterQuery['category'] = category.trim()
        }

        if (isValid(isPublished)) {
            filterQuery['isPublished'] = isPublished
        }

        if (isValid(tags)) {
            const tagsArr = tags.trim().split(',').map(tag => tag.trim())
            filterQuery['tags'] = { $all: tagsArr }
        }

        if (isValid(subcategory)) {
            const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim())
            filterQuery['subcategory'] = { $all: subcatArr }
        }

        const blogs = await blogModel.find(filterQuery)

        if (Array.isArray(blogs) && blogs.length === 0) {
            return res.status(404).send({ status: false, message: "No blogs found" })
        }

        const idsOfBlogsToDelete = blogs.map(blog => {
            if (blogs.authorId === authorIdFromToken) return blog._id
        })

        if (idsOfBlogsToDelete.length === 0) {
            return res.status(404).send({ status: false, message: "No blogs found" })
        }

        await blogModel.updateMany(
            { _id: { $in: idsOfBlogsToDelete } },
            { $set: { isDeleted: true, deletedAt: new Date() } }
        )
        res.status(200).send({ status: true, message: "Blog(s) deleted successfully" })
    }
    catch (error) {
        res.status(500).send({ status: true, message: error.message })
    }
}

module.exports = { createBlog, updateBlog, listBlog, deleteBlogById, deleteBlogByParams }