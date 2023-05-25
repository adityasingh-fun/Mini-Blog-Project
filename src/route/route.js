const express = require('express');
const authorCtrl=require('../controllers/authorController');
const blogCtrl=require('../controllers/blogController');
const router = express.Router();


router.get('/test-me' , (req,res)=>{
    console.log("workinggg")
    res.send("working");
});

router.post('/authors',);
router.post('/blogs',);
router.get('/blogs',);
router.put('/blogs/:blogId',);
router.delete('/blogs/:blogId',);

module.exports = router;