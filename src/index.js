const express = require('express');
const app = express();
const route = require('./router/route.js');
const mongoose = require('mongoose');
app.use(express.json())



mongoose.connect("mongodb+srv://wasif_wasif:mongo_mongo@cluster0.xyph1rq.mongodb.net/mini_blog",
    {
        useNewUrlParser: true     // refresh the data 
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));



app.use('/', route);

app.listen(3000, () => console.log("done"));