const awt = require("jsonwebtoken");
module.exports=function(req,res,next){
    const toke=req.headers.authorization;

    if(!token){
      return res.send("Access Denied");
    }

    try{
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;

        next();

    }
    catch(err){

        res.send("Invalid Token");

    }

}