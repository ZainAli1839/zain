var express = require('express');
var model=require('./model');
var jwt = require('jwt-simple');
var moment = require('moment');
var fs=require('fs');
var multer = require('multer');
var DIR = '../uploads/';
var uploade = multer({dest: DIR}).single('photo');


function getId(req){
	
var token = req.header('Authorization');
 var payload = null;
 
    payload = jwt.decode(token, "secret");
  
 	
	return payload;
}
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization');
  var payload = null;
  try {
    payload = jwt.decode(token, "secret");
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}


function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, "secret");
}







var human=model.human;
var lastName=model.lastName;
var lang=model.lang;
var upload=model.upload;
var increase=model.increase ;
var personal=model.personal ;
var exp=model.exp ;
var learn=model.learn;
var users=model.users;
var router = express.Router();
router.get("/rest/:token/:pass",function (req,res){
	users.findOne({resetPasswordToken:req.params.token, resetPasswordExpires: { $gt: Date.now() }},(err,data)=>{
		if(data) {
			data.password=req.params.pass;
			data.save();
			  res.json({message:'تم التغيير بنجاح   ',err:false});
		
	}
		else {
			 res.json({message:'خطاء ',err:true});
		}
		

	});


});
router.get("/token/:token",(req,res)=>{
	users.findOne({resetPasswordToken:req.params.token, resetPasswordExpires: { $gt: Date.now() }},(err,data)=>{
		if(data) {res.json(data).status(200)}
		else {
			res.json(null).status(404)
		}
		

	});


});
router.post('/toUpload', function (req, res, next) {
	
	 var path = '';
	 uploade(req, res, function (err) {
		fs.rename(req.file.destination+""+req.file.filename, req.file.destination+""+req.file.originalname);
		//:
		 
	    if (err) {
	      // An error occurred when uploading
	      console.log(err);
	      return res.status(422).send("an Error occured")
	    }  
		 console.log(req.file);
	    path = req.file.path;
		 
	    return res.send("Upload Completed for "+path); 
  });	 
})
router.delete('/LastName/:id',ensureAuthenticated,function(req,res){
	
	LastName.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
router.delete('/human/:id',ensureAuthenticated,function(req,res){
	
	human.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});

router.post('/LastName',ensureAuthenticated,function(req,res){
	
	lastName.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});


router.get('/lastName',ensureAuthenticated,function(req,res){
	
	lastName.find({},function (err,data){
			res.json(data);
		
	})

	
});
router.post('/human',ensureAuthenticated,function(req,res){
	
	human.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});


router.get('/human',ensureAuthenticated,function (req,res){
	console.log(getId(req));
	human
	.find({})
	.populate('lastName')
	.sort("name")
	
.exec(function(err,project) {
		res.json(project)
	})
	

	
});


router.get('/getSubject/:id',ensureAuthenticated,function(req,res){
	
	classes
.findById( req.params.id)

.populate('subject')
.exec(function(err,project) {
		console.log(project);
		for(var i=0;i<project.subject.length;i++){
			delete project.subject[i].name;
			delete project.subject[i].__v;
			project.subject[i].value=null;
			
			
		}
		res.json(project);
		
	});

});
//start REST
router.get('/personal',ensureAuthenticated,function(req,res){
	
	personal.findOne({user:getId(req).sub},function (err,data){
			res.json(data);
		
	})

	
});
router.get('/personal/:id',ensureAuthenticated,function(req,res){
	
	personal.findOne({_id:req.params.id},function (err,data){
			res.json(data);
		
	})

	
});

router.post("/login",function (req,res){
	
	users.findOne({ email: req.body.email }, function(err, data) {
  
    if (!data) {
      return res.status(401).send({ message: 'Invalid User Name and/or password' });
    }
    data.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch) {console.log(' mache!!!!!!!!');}
      if (!isMatch) {
          console.log('not mache');
        return res.status(401).send({ message: 'Invalid User Name and/or password' });
      }
      res.send({ token: createJWT(data) });
    });
  });

	/*
	users.find({password:req.body.password,email:req.body.email},function (err,data){
		if(err) {res.status(500).send(err);}
		if(data.length>=1){
			req.session.user=data[0];
			
			res.status(200).send({ token: createJWT(data[0])});
		}
		else{res.status(401).send({message:"userName and password are invalid"});}
		
	});
	*/
});
router.post("/logout",function (req,res){
	req.session.destroy(function(err) {
  	if(err){console.log(err);}
		
})
res.status(200).send;});
router.post('/users',function(req,res){
	users.findOne({email:req.body.email},function(err,data){
	if(data){res.status(409).send("username is token ");}	
		else{
			users.create(req.body, function (err, post) {
		res.json(post);
	});
		}
	});
	
	
	
});
router.post('/personal',ensureAuthenticated,function(req,res){
	req.body.user=getId(req).sub;
	personal.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});
router.put('/personal/:id',ensureAuthenticated,function(req,res){
	
	personal.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
router.delete('/personal/:id',ensureAuthenticated,function(req,res){
	
	personal.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
//end REST

router.get('/learn',ensureAuthenticated,function(req,res){
	
	learn.find({},function (err,data){
			res.json(data);
		
	})

	
});

router.get('/learns',ensureAuthenticated,function(req,res){	
	
	learn
	.find({personal:getId(req).sub})
	
	.sort("-_id")
	
.exec(function(err,project) {
		res.json(project)
	})

	
});
router.get('/learn/:id',ensureAuthenticated,function(req,res){
	
	learn.findOne({_id:req.params.id},function (err,data){
			res.json(data);
		
	})

	
});
router.post('/learn',ensureAuthenticated,function(req,res){
	req.body.personal=getId(req).sub;
	learn.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});
router.put('/learn/:id',ensureAuthenticated,function(req,res){
	console.log(req.body);
	learn.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
router.delete('/learn/:id',ensureAuthenticated,function(req,res){
	
	learn.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});

router.get('/exp',ensureAuthenticated,function(req,res){
	
	exp.find({},function (err,data){
			res.json(data);
		
	})

	
});

router.get('/exps',ensureAuthenticated,function(req,res){
	
	exp
	.find({personal:getId(req).sub})
	
	.sort("-_id")
	
.exec(function(err,project) {
		res.json(project)
	})

	
});
router.get('/exp/:id',ensureAuthenticated,function(req,res){
	
	exp.findOne({_id:req.params.id},function (err,data){
			res.json(data);
		
	})

	
});
router.post('/exp',ensureAuthenticated,function(req,res){
	req.body.personal=getId(req).sub;
	exp.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});
router.put('/exp/:id',ensureAuthenticated,function(req,res){
	
	exp.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
router.delete('/exp/:id',ensureAuthenticated,function(req,res){
	
	exp.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});

router.get('/increases',ensureAuthenticated,function(req,res){
	
	increase
		.find({personal:getId(req).sub})
	
	.sort("-_id")
	
.exec(function(err,project) {
		res.json(project)
	})
		
	
});
router.get('/increase/:id',ensureAuthenticated,function(req,res){
	
	increase.findOne({_id:req.params.id},function (err,data){
			res.json(data);
		
	})

	
});
router.post('/increase',ensureAuthenticated,function(req,res){
	req.body.personal=getId(req).sub;
	increase.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});
router.put('/increase/:id',ensureAuthenticated,function(req,res){
	
	increase.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
router.delete('/increase/:id',ensureAuthenticated,function(req,res){
	
	increase.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});

router.get('/langs',ensureAuthenticated,function(req,res){
	lang
	.find({personal:getId(req).sub})
	
	.sort("-_id")
	
.exec(function(err,project) {
		res.json(project)
	})
	
});
router.get('/lang/:id',ensureAuthenticated,function(req,res){
	
	lang.findOne({_id:req.params.id},function (err,data){
			res.json(data);
		
	})

	
});
router.post('/lang',ensureAuthenticated,function(req,res){
	req.body.personal=getId(req).sub;
	lang.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});
router.put('/lang/:id',ensureAuthenticated,function(req,res){
	
	lang.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
router.delete('/lang/:id',ensureAuthenticated,function(req,res){
	
	lang.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});

router.get('/uploads',ensureAuthenticated,function(req,res){
	
	upload
	.find({personal:getId(req).sub})
	
	.sort("-_id")
	
.exec(function(err,project) {
		res.json(project)
	})

	
});
router.get('/upload/:id',ensureAuthenticated,function(req,res){
	
	upload.findOne({_id:req.params.id},function (err,data){
			res.json(data);
		
	})

	
});
router.post('/upload',function(req,res){
	console.log(req.body);
	req.body.personal=getId(req).sub;
	upload.create(req.body, function (err, post) {
		res.json(post);
	});
	
	
});
router.put('/upload/:id',ensureAuthenticated,function(req,res){
	
	upload.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
router.delete('/upload/:id',ensureAuthenticated,function(req,res){
	
	upload.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		
	});
	res.end();
	
});
module.exports = router;
