const express=require('express')
const app=express()
const bcrypt=require('bcrypt')
const User=require('./models/user')
const jwt=require('jsonwebtoken')
const db=require('./config/db')
require('dotenv').config()
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))
app.set("view engine","ejs")
app.get('/',(req,res)=>{
    res.render("index")
})

app.get('/signup',(req,res)=>{
    res.render("signup")
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.get('/home',(req,res)=>{
    res.render("home")
})

app.post('/signup',async(req,res)=>{
    try {
        const {username,email,password}=req.body
        const hashPassword=await bcrypt.hash(password,10)
        await User.create({username,email,password:hashPassword})
        res.render("login")
    } catch (error) {
        res.send("error in sign-up")
    }
})
app.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.send("invalid email")
        }   
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.send("invalid password")
        }   
        const token=jwt.sign(
            {userId:user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:"1d"})
    console.log(token)
        res.cookie("token",token,{httpOnly:true})
        res.redirect("/home")
    } catch (error) {
        res.send("error in login")
    }

})
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})