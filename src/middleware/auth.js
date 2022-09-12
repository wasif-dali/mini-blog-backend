const jwt = require("jsonwebtoken");
const blogmodel = require("../models/blogmodel");


const authentication = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"];

    if (!token) return res.status(400).send({ status: false, msg: "Enter token in header" });

    jwt.verify(token,"70-group-secretkey",function(error,decoded){

      if(error)return res.status(401).send({ status: false, msg: "Invalid Token" });

      else 
      req.authorId = decoded.authorId;
      next()
   });   
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const authorization = async function (req, res, next) {
  try {

    let blogId = req.params.blogId;
    
    if(blogId){

   

      let findBlog = await blogmodel.findById(blogId);
      if (!findBlog) 
      return res.status(403).send({ status: false, msg:"blog nhi hai"});
      {
        
      }
      if(req.authorId != findBlog.authorId)
      return res.status(403).send({ status: false, msg:"author is not authorized to access this blog"});
       
    }

    next();  

  } catch (error) {
    
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { authentication, authorization};