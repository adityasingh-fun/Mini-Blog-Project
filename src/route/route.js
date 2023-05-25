const express = require('express');
const authorCtrl=require('../controllers/authorController');
const blogCtrl=require('../controllers/blogController');
const middleware = require('../middlewares/middleware')

const router = express.Router();


router.get('/test-me' , (req,res)=>{
    console.log("workinggg")
    res.send("working");
});

router.post('/authors',middleware.reqBodyCheck,authorCtrl.createAuthor);//aditya
router.post('/blogs',middleware.reqBodyCheck, middleware.validAuthor, blogCtrl.createBlog);//Aditya
// router.get('/blogs',blogCtrl.getBlogData);//pallavi
router.put('/blogs/:blogId',);//preeti
router.delete('/blogs/:blogId',);//swarnendu

module.exports = router;