const mongoose = require('mongoose');
const db=mongoose.connect("mongodb://localhost:27017/nsdc").then(()=>{
    console.log("Database connected successfully")
})
module.exports=db