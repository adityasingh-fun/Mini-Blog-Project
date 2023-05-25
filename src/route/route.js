const express = require('express');
const authorCtrl=require('../controllers/authorController');
const blogCtrl=require('../controllers/blogController');
const router = express.Router();


router.get('/test-me' , (req,res)=>{
    console.log("workinggg")
    res.send("working");
});

router.post('/authors',);//aditya
router.post('/blogs',);//Aditya
router.get('/blogs',);//pallavi
router.put('/blogs/:blogId',);//preeti
router.delete('/blogs/:blogId',);//swarnendu

module.exports = router;