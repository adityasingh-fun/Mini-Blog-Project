const blogModel = require('../models/blog');

const createBlog = async function (req, res) {
    try {
        const data = req.body;
        const blog = await blogModel.create(data);
        res.status(201).send({ status:true, vlogData: blog })
    }
    catch(error){
        res.status(400).send({status:false, msg:error.message})
    }
}

// const getBlogData = async (req,res) =>{
//     const { authorId, category,tags, subcategory } = req.query;
  
//       try {
//         let data = await blogModel.find({$or:[tags.includes(tags)]});
//         let blogFilter = data.filter(data => {
//           if (authorId && data.authorId !== authorId) {
//             return res.status(404).send({
//           status:false , message:"authorId invalid"
//           });
//           }
//           if (category && data.category !== category) {
//             return res.status(404).send({
//           status:false , message:"category invalid"
//           });
//            }
//           if (tags && !data.tags.includes(tags)) {

//             return res.status(404).send({
//           status:false , message:"this tags not present"
//           });
//           }
        
//           if (subcategory && data.subcategory !== subcategory) {
//             return res.status(404).send({
//           status:false , message:"subcategory not found"
//           });
//           }
//           return true;
//         });
//         if(blogFilter.length === 0) {
//           return res.status(404).send({
//           status:false , message:"No data found"
//           });
//         }
//         return res.status(200).send({status :  true , 
//            message : "datas Lists" , data:blogFilter,
//         });
//       } catch (error) {
//         console.error('Error retrieving data:', error);
//         return res.status(500).send({
//           error: 'An error occurred while retrieving data.'
//         });
//       }
//     }

module.exports = {createBlog,getBlogData}