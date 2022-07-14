const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

mongoose.connect("mongodb://localhost:27017/CustomerDetail", { useNewUrlParser: true }).then(() => {
    console.log("connection sucessful");
}).catch((err) => {
    console.log(err);
})



const Customerschema = new mongoose.Schema({
    file_No: Number,
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    DOB: {
        type: String,

    },
    adhar: {
        type: String,
        minlength: 12
    },
    mobile: {
        type: String,
        minlength: 10,
        unique:true

    },
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value))
                throw new error("email is wrong");
        },
        unique:true
        
    },
    adress: {
        type: String,
        minlength: 3
    },
    // pandetail

    pan_id:{
     type:String,
     minlength:10,
     unique:true
    },

    it_pasword:String,

    Balance_sheet:String,

    // GST detail 

    GstNo:String,
    Registration:String,
    GstId:String,
    GstPasword:String,

    // TAN info 
    tanNo:String,
    Tanid:String,
    tanPasword:String



})

const Customer=new mongoose.model("Customer",Customerschema);

//loginDetails
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
        
    },
    conformPasword:{
      type:String,
      required:true,
    //   validate(value){
    //       if(pasword!=conformPasword)
    //       throw new error("pasword does not match");
    //   }
    }

})

//creating token
loginschema.methods.createToken=async function(){
    try {
        const token =await jwt.sign({_id:this._id},"mynameisbaibhavkumarbadalandiamsoftwareengineer");

        console.log(`token is ${token}`);
        return token;
    } catch (error) {
        console.log(`token error is ${error}`);
    }
}


//hashing of pasword
loginschema.pre("save",async function(next){
    this.pasword=await bcrypt.hash(this.pasword,10);
    this.conformPasword=undefined;

    next();
})

const Logindetail=new mongoose.model("Logindetail",loginschema);


module.exports.Logindetail=Logindetail;

module.exports.Customer=Customer;
        





