const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true,
    }
});
const Users = mongoose.model("Users", userSchema)
module.exports = Users;