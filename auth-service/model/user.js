const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name :{
        type: String
    },
    email :{
        type: String
    },
    password :{
        type: String
    },
    created_at:{
        type : Date,
        default: Date.now()
    }
})

module.exports = User = mongoose.model('user', userSchema)