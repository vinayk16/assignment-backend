const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    
    phoneno : {
        type : Number
    },
    password : {
        type: String
    },
    name : {
        type : String,
        required: true
    },
    email : {
        type:String
    },
    uno:{
        type:Number,
        unique:true
    }

}, {timestamps : true});

module.exports = mongoose.model("User", UserSchema);