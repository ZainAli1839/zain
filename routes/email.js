var express = require('express');
var cry=require('crypto');
var token;
cry.randomBytes(48, function(err, buffer) {
   token = buffer.toString('hex');
});
var email = require('mailer');
var model=require('./model');
var users=model.users;
var router = express.Router();

  
router.get("/:email",(req,res)=>{

  users.findOne({email:req.params.email},function(err,data){
      if(data) {
        console.log(data);
         data.resetPasswordExpires = Date.now() + 3000000;
        data.resetPasswordToken=token;
        var prom=data.save();
        prom.then((err,data2)=>{
          var url="";
        
var pr=email.send({
    host : "smtp.gmail.com",
    port : "465",
    ssl : true,
    domain : "i-visionblog.com",
    to : req.params.email,
    from : "hosyn963@gmail.com",
    subject : "change password",
    text: "السلام عليكم ",
    html: "<h2 style='color:green'> Hello World Mail sent from  mailer library</h2> <a href='http://localhost:4200/#/restPassword/"+token.toString()+"'> change passowrd </a>"  ,
    authentication : "login",        // auth login is supported; anything else $
    username : 'hosyn963@gmail.com',
    password : "735386814"
    },function (err,data){
      res.json({message:'ثم الإرسال بنجاح ',err:false});
   });
})}
else{
  res.json({message:'البريد غير موجود مسبقاً ',err:true});
}



  });});
 

module.exports = router;