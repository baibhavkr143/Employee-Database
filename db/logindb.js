const express=require("express");
const mongoose=require("mongoose");
const validator=require("validator");

mongoose.connect("mongodb://localhost:27017/CustomerDetail", {  
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
    useFindAndModify: false
 }).then(() => {
    console.log("connection sucessful");
}).catch((err) => {
    console.log(err);
})


const loginschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new error("email is wrong");
        },
        unique:true
    },
    pasword:{
        type:String,
        required:true,
        minlength:6
    },
    conformPasword:{
      type:String,
      required:true,
      validate(value){
          if(pasword!=conformPasword)
          throw new error("pasword does not match");
      }
    }

})

const Logindetail=new mongoose.model("Logindetail",loginschema);

module.exports=Logindetail;

