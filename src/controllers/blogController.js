const blogsModel = require("../models/blogmodel");
const authorModel = require("../models/authorModel");

//createblog
const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    let authorId = req.body.authorId;
    if (!authorId)
      return res.status(400).send({ status: false, msg: "please provide authorId" }); 
    if (Object.keys(data).length != 0) // when body is empty then show error line 21
    {
      let authorId = await authorModel.findOne({ _id: data.authorId });
    if (!authorId)return res.status(400).send({ status: false, msg: "please provide invalid auhtor id " }); 

      let savedData = await blogsModel.create(data);  // when every thing is fine and then blog is create  
      return res.status(201).send({ status: true, data: savedData }); //return creating blog


    } else {
      return res.status(400).send({ status: false, msg: "body is empty" });  // object key error 11
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message }); 
  }
};

//getBlog

const getblogs = async function (req, res) {
  try {
    let data = req.query  // jo bhi query me save hoga vo data se use kr sakte hai line 34
    const check = await blogsModel.find({
      data,
      isDeleted: false,
      isPublished: true,
    });
    if (check.length == 0)  // when no blog in data base give error 
      return res.status(404).send({ status: false, msg: "No blogs found" });

    return res.status(200).send({ status: true, data: check });  // when condtion is true
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

//updateBlog
const updateBlog = async function (req, res){
  try {
    let getId = req.params.blogId;
    let data = req.body;
    
    if(!data)
    return res.status(404).send({ status: false, msg:"data is not provide" });

    let checkId = await blogsModel.findOne({ _id: getId });
  
    if (checkId) //  asume the is gud
    {
      if (checkId.isDeleted === false)  // check into checkit me jake check kare gya ki isdeleted false hai/nahi 
      {
        let check = await blogsModel.findByIdAndUpdate(
          getId,
          {
            $push: { tags: data.tags,
           subcategory: data.subcategory }, // becoz model me hai iss leye {}
            title: data.title,
            body: data.body,
            category: data.category,
             isPublished: true, 
             publishedAt: Date.now()
          },
          { new: true } // update documt shows in finall result 
        );
        return res.status(200).send({ status: true, msg: check }); /// every thing gud then give is status 200
      } else {
        return res.status(404).send("CANT UPDATE , IT IS DELETED");  // checkid.isdeleted == true
      }
    } else {
      res
        .status(401)
        .send({ status: false, msg: "Please enter valid Blog id" });  /// error hai if (checkId)
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};




//deleteBlog  
//// delete the documnet by blogID

const deleteBlog = async function (req, res) {
  try{
  let blogId = req.params.blogId

  if (!blogId) 
  { return res.status(404).send("KINDLY ADD BLOG ID") }

  let blog = await blogsModel.findById(blogId)

  if (!blog) { return res.status(404).send("NOT A VALID BLOG ID") }

  if (blog.isDeleted == false) // if the key is delete == false in the blog collection
   
  {
      let save = await blogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

      return res.status(200).send({ msg: save }) // ok report hai toh status 200 done
  } 
  
  else {
      res.status(404).send({ status: false, msg: "already deleted" }) /// when blog.deleted aagr false nhi hai toh error 
  }
}  
catch (error) {
  res.status(500).send(error.message);
}
}


//deletequery

/// delete the document by query 

const deletebyquery = async function (req, res) {
  try{
  let data = req.query; // query me jo bhi hai vo data me save
  let find = await blogsModel.findOne(data);  
 
  if (!find) {
    return res.status(404).send({ status: false, msg: "Blog is not created" });
  }
  if (find.isDeleted == true) {
    return res.status(400).send({ status: false, msg: "THIS DOCUMENT Is deleted" }); // when is delete true hoga toh error 
  }

  let saved = await blogsModel.findOneAndUpdate(
    data, // data = req.query vaaha use huya hai
    { $set: { isDeleted: true, deletedAt: Date.now() } },
    { new: true } /// show the finally doucnment jo bhi chnage hau hai

  );
  res.status(200).send({ status: true, msg: saved }); /// all code done then give status 200
  }
  catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.deletebyquery = deletebyquery;
module.exports.deleteBlog = deleteBlog;
module.exports.updateBlog = updateBlog;
module.exports.createBlogs = createBlogs;
module.exports.getblogs = getblogs;