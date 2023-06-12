const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({

    title : {
        type : String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    userId : {
        type : Number,
        ref: "User",
        required: true
    },phoneno : {
        type : Number,
        
        
    }
    ,sub_total : {
        type : Number,
        required: true
        
    }


}, {timestamps : true});

module.exports = mongoose.model("Order", OrderSchema);