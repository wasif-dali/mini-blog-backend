const authorModel = require("../models/authorModel");

const jwt = require("jsonwebtoken");

//createAuthor

const createAuthor = async function (req, res) {


    try {
        const data = req.body;
        const fnameData = data.fname;
        if (!data.fname)return res.status(400).send({ msg: "fname is mandatory in the request" }); 

        const lnameData = data.lname;
        if (!data.lname) return res.status(400).send({ msg: "lname is mandatory in the request" }); 

        const  titleData = data.title;
        if (!data.title == "mr||mrs||miss") return res.status(400).send({ msg: `title is mandatory in the request` }); 
         
        const emailData = data.email;
        if (!data.email.match(/^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/))   return res.send({ msg: "email is mandatory in the request" }); 
        
        const passwordData = data.password;
        if (!data.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,99}$/))   return res.send({ msg: "password is mandatory in the request with alphanumerical,higher-lower case values" }); 

        let savedData = await authorModel.create(data);
       res.status(200).send({ data: savedData });
    } catch (error) {
        console.log(error);res.status(500).send({ msg: error.message }); 

    }
}

//loginAuthor


const loginAuthor = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;
         if (!(email &&  password))
            return res.status(400).send({status: false, msg: "please provide emailid and password",})
            if (!email.match(/^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/)) 
            return res.status(400).send({ status: false, msg: "Wrong Email format" })
            if(!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,99}$/))
            return res.status(400).send({ status: false, msg: "Wrong passowrd" })

            let author = await authorModel.findOne({ email: email, password: password });
            if (!author)
            return res.status(400).send({status: false,msg: "username or the password is not corerct",});
            const token = jwt.sign ({  
                authorId: author._id.toString(),
                email: author.email,
            },
            "70-group-secretkey",
            {
                expiresIn:"24h"
            }
             );
            res.setHeader("x-api-key", token);
            res.status(200).send({ status: true, token: token });
          } catch (error) {
            res.status(500).send({ error: error.message })
          }
        };
                   

        module.exports.createAuthor = createAuthor;
        module.exports.loginAuthor= loginAuthor;