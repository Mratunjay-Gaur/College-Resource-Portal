const Mongoose = require("mongoose")
const validator = require("validator");

const MemberSchema = new Mongoose.Schema({
    name : {
    type : String,
    required  :true,
    trim : true,
    maxlength : 50,
    },
    email : {
        type: String,
        required  :true,
        unique : true,
        lowercase : true,
        validate : [validator.isEmail," Invalid Email"],
    },
    branch:{
     type : String,
     trime:true,
    },
})
module.exports = Mongoose.model("Member",MemberSchema);

