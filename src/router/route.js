const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const auth  = require('../middleware/auth');

router.post("/authors",authorController.createAuthor);
router.post('/login',authorController.loginAuthor)
router.post("/blog", blogController.createBlogs);
//get//
router.get("/getblog",auth.authentication,blogController.getblogs);
//update//
router.put('/blogs/:blogId',auth.authentication,auth.authorization,blogController.updateBlog);
//delete//
router.delete('/blogs/:blogId',auth.authentication,auth.authorization, blogController.deleteBlog);
router.delete('/blogs',auth.authentication, auth.authorization,blogController.deletebyquery);

module.exports = router;