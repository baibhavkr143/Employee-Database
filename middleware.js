const jwt=require("jsonwebtoken");

const auth=async(req,res,next)=>{
    try {
        const verify=jwt.verify(req.cookies.jwt,"mynameisbaibhavkumarbadalandiamsoftwareengineer");

        next();
    } catch (error) {
        res.status(201).render("loginform",{sucess3:1});
    }
}

module.exports=auth;