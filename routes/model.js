var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var users=new mongoose.Schema({
	email:String,
	username:String,
	password:String,
	resetPasswordToken: String,
  resetPasswordExpires: Date
	
});
users.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

users.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};
//mongodb://username:password@host:port/database?options...
var  url="mongodb://2589a76fe7508b7c803f7756d3cfc84c:zainali@4a.mongo.evennode.com:27017/2589a76fe7508b7c803f7756d3cfc84c";

//mongodb://2589a76fe7508b7c803f7756d3cfc84c:zainali@a.mongo.evennode.com:27017,4b.mongo.evennode.com:27017/2589a76fe7508b7c803f7756d3cfc84c
//mongodb://81a53a3458f1ae98c22e36923c5b2c3b:zainali@4a.mongo.evennode.com:27017/81a53a3458f1ae98c22e36923c5b2c3b

mongoose.connect("mongodb://localhost:27017/hadramout");
//mongoose.connect('mongodb://81a53a3458f1ae98c22e36923c5b2c3b:zainali@4a.mongo.evennode.com:27017/81a53a3458f1ae98c22e36923c5b2c3b');
var personal=new mongoose.Schema({
	 name:String,
		  state:String,
		  serial:Number,
		  address:String,
		  gorver:String,
		  city:String,
		  card:Number,
		  sex:String,
		  phone:Number,
		  user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
		  langs:[{type:mongoose.Schema.Types.ObjectId,ref:'lang'}],
		  exps:[{type:mongoose.Schema.Types.ObjectId,ref:'exp'}],
		  learns:[{type:mongoose.Schema.Types.ObjectId,ref:'learn'}],
		  increase:[{type:mongoose.Schema.Types.ObjectId,ref:'increase'}]
	
});
var learn=new mongoose.Schema({
	 company:String,
	  good:String,
	  spical:String,
	  counter:String,
	  city:String,
	  deg:String,
	  date:Date,
	  avg:Number,
	  personal:{type:mongoose.Schema.Types.ObjectId,ref:'personal'}
	
});
var exp=new mongoose.Schema({
	company:String,
	   start:Date,
	   end:Date,
	   address:String,
	   discribe:String,
	   typeCompany:String,
	   work:String,
	   yourWork:String,
	 personal:{type:mongoose.Schema.Types.ObjectId,ref:'personal'}
});
var increase=new mongoose.Schema({
	 name:String,
		  value:Number,
	 personal:{type:mongoose.Schema.Types.ObjectId,ref:'personal'}
});

var lang=new mongoose.Schema({
	 lang:String,
		  value:String,
	 personal:{type:mongoose.Schema.Types.ObjectId,ref:'personal'}
	
});
var upload=new mongoose.Schema({
	 title:String,
		  describe:String,
	file:String,
	 personal:{type:mongoose.Schema.Types.ObjectId,ref:'personal'}
	
})


var human=new mongoose.Schema({
	name:String,
	lastName:{type:mongoose.Schema.Types.ObjectId,ref:'lastName'}
	
});

var lastName=new mongoose.Schema({
	name:String
	
});
exports.lastName=mongoose.model('lastName',lastName);
exports.human=mongoose.model('human',human);
exports.users=mongoose.model('user',users);
exports.upload = mongoose.model('upload', upload);
exports.lang = mongoose.model('lang', lang);
exports.increase = mongoose.model('increase', increase);
exports.personal = mongoose.model('personal', personal);
exports.exp = mongoose.model('exp', exp);
exports.learn = mongoose.model('learn', learn);

/*
Chat.findById(req.params.id, function (err, post) {
Chat.create(req.body, function (err, post) {
Chat.create(req.body, function (err, post) {
hat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
 Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {*/
