const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const jwt_key = "mt-15"

require('./db')();
const User = require('./model/User')


const PORT = process.env.PORT || 7070

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.json())

app.listen(PORT, () => {
    console.log("Auth service is running on PORT : 7070");
})
app.get("/", (req, res) => {
    return res.send("asdffg")
})

app.post('/register', async (req, res) => {
    console.log("in register requestt");
    const { email, password, name } = req.body;

    const userExists = await User.findOne({ email: email })
    if (userExists) {
        return res.json({message: "user already exists plzz login"})
    }
    else {
        const newUser = new User({
            email,
            name,
            password
        })

        newUser.save()
        return res.json({newUser})

    }
})
app.post('/login', async (req, res) => {
    console.log("in login requestt");
    const { email, password } = req.body;

    const user = await User.findOne({email})
    if(!user){
        return res.json({message: "user dosen't exists plzz sign up first !!"})
    }else{
        if(password !== user.password){
            return res.json({message: "incorrect password"})
        }
        else{
            const payload ={
                email,
                name:user.name
            }
            jwt.sign(payload , jwt_key , (err, token) => {
                if(err){
                    console.log(err);
                }
                else{
                    return res.json({
                        message: "login successful !!",
                        token: token
                    })
                }
            })
        }

    }

    
})








