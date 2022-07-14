const { json } = require("express");
const express = require("express");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
require("C:/web project/dynamic website/db/db.js")
db = require("C:/web project/dynamic website/db/db.js");
const auth=require("C:/web project/dynamic website/middleware.js");
const JsonParser = require('body-parser');





const app = express();


hbs.registerPartials("C:/web project/dynamic website/views/partials");
app.set("view engine", "hbs");
app.use(express.static("C://web project/dynamic website/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());




app.get("/", (req, res) => {
    res.render("loginform");
})

//signIn page work
app.post("/signIn",async(req,res)=>{
    try {
       const email=req.body.email;
       const pasword=req.body.pasword;
       const data=await db.Logindetail.find({email:email});
      const result=await bcrypt.compare(pasword,data[0].pasword);
      const token =await data[0].createToken();

      res.cookie("jwt",token,{expires:new Date(Date.now()+10000*60000),httpOnly:true})

     

       if(result)
       res.redirect("/home");
       else res.render("loginform",{sucess2:1})
    } catch (error) {
        console.log(error);
    }
})

//SignUp work  in db
app.post("/logindetail", async (req, res) => {
    try {
        if (req.body.pasword == req.body.conformPasword) {
            const logindata = new db.Logindetail(req.body);
            const savedata = await logindata.save();
            console.log(savedata);
            res.render("loginform", { sucess1: 1 });
        }

        else {
            res.render("loginform", { sucess2: 1 });
        }
    } catch (error) {
        console.log(error);
        res.send(error);

    }
})



app.get("/home",auth ,(req, res) => {

    res.render("index", { sucess: 0 });

})

app.get("/customer",auth ,(req, res) => {
    res.render("addcustomer");
})
app.get("/clients",auth, (req, res) => {
    res.render("clientsdata", { sucess: 0 });
})

app.get("/logout",auth,(req,res)=>{
    res.clearCookie("jwt");
    res.render("loginform",{sucess4:1})
})


//db work
//POST OPERATION
//customer data saving 
app.post("/register", async (req, res) => {

    try {

        const data = new db.Customer(req.body);
        const save = await data.save();
        console.log(save);
        res.render("index", { sucess: 1 });


    } catch (error) {
        res.status(404).send("error in hendling file");
        console.log(error);
    }


})

//GET OPERATION

app.get("/register",auth, async (req, res) => {

    try {
        const data = await db.Customer.find();
        res.send(data);

    } catch (error) {
        res.send("error in file");
        console.log(error);
    }


})

//GET OPERATION ON PARTICULAR PERSON

app.get("/register/one/:id",auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await db.Customer.find({ _id });

        res.render("particularClient", {
            name: data[0].name,
            DOB: data[0].DOB,
            mobile: data[0].mobile,
            email: data[0].email,
            adhar: data[0].adhar,
            adress: data[0].adress,
            pan_id: data[0].pan_id,
            it_pasword: data[0].it_pasword,
            balanceSheet: data[0].Balance_sheet,
            GSTNo: data[0].GstNo,
            Registration: data[0].Registration,
            GST_id: data[0].GstId,
            GSTpasword: data[0].GstPasword

        }
        );

    } catch (error) {
        console.log(error);
        res.status(404).send("data not found");
    }
})

//UPDATE Clients Page

app.get("/register/api/:id",auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await db.Customer.find({ _id });


        res.render("updateclient", {
            id: data._id,
            fileno: data.file_No,
            name: data[0].name,
            DOB: data[0].DOB,
            mobile: data[0].mobile,
            email: data[0].email,
            adhar: data[0].adhar,
            adress: data[0].adress,
            pan_id: data[0].pan_id,
            it_pasword: data[0].it_pasword,
            balanceSheet: data[0].Balance_sheet,
            GSTNo: data[0].GstNo,
            Registration: data[0].Registration,
            GST_id: data[0].GstId,
            GSTpasword: data[0].GstPasword

        }
        );

    } catch (error) {
        console.log(error);
        res.status(404).send("data not found");
    }
})

//delete clints page
app.get("/register/delete/:id",auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await db.Customer.findByIdAndDelete({ _id });
        res.render("clientsdata", { sucess1: 1 });
    } catch (error) {
        res.send(`error in handling file ${error}`);
        console.log(error);

    }

})

//for updating customer
// app.put("/register/update/",async(req,res)=>{
//     try {
//         const _id=req.params.id;

//         const data=await db.Customer.updateOne(req.body.id,req.body);
//         res.render("clientsdata",{sucess:1});
//     } catch (error) {
//         res.send(`error in handling file ${error}`);
//         console.log(error);

//     }

// })

app.put("/register/update/:id", (req, res) => {
    const data=req.body;
    const body={
            fileno: data.file_No,
            name: data.name,
            DOB: data.DOB,
            mobile: data.mobile,
            email: data.email,
            adhar: data.adhar,
            adress: data.adress,
            pan_id: data.pan_id,
            it_pasword: data.it_pasword,
            balanceSheet: data.Balance_sheet,
            GSTNo: data.GstNo,
            Registration: data.Registration,
            GST_id: data.GstId,
            GSTpasword: data.GstPasword
            
            }
    db.Customer.updateOne({_id:req.params.id},body).then(result=>res.status(200).json(result)).then(data=>console.log(data))



})

//creting Restful api using name;
app.get("/register/person/:name",auth ,async (req, res) => {
    try {
        const name = req.params.name;
        const data = await db.Customer.findOne({ name });
        console.log(`person detail is ${data}`);
    } catch (error) {
        res.send(error);

    }
})







app.get("*", (req, res) => {
    res.send("404 error page");
})

app.listen(5000, () => {
    console.log("listning to server");
})
