const express = require('express');
const router = express.Router();


router.get('/test-me' , (req,res)=>{
    console.log("workinggg")
    res.send("working");
});

// router.use('/', (req,res)=>{
//     res.send("working")});

module.exports = router;