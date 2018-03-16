var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeAuth')
var db = mongoose.connection;
var bcrypt = require('bcrypt');

//user schema

 var  UserSchema = mongoose.Schema({
      username:{
          type:String,
          index:true
      },
      password:{
          type:String, required: true ,bcrypt:true
      },
      email:{
        type:String
    },
    name:{
        type:String
    },
    files:{
        type:String
    }
 });

 var User = module.exports = mongoose.model('User',UserSchema);

 module.exports.comparePassword = function(candidatePassword, hash, callback){
     bcrypt.compare(candidatePassword, hash, function(err, isMatch){
         if(err) return callback(err);
         callback(null, isMatch);
     })
 } 

  module.exports.getUserById= function(id, callback){
      User.findById(id, callback);
  } 

  module.exports.getUserByUsername= function(username, callback){
      var query = {username: username};
      User.findOne(query, callback);
  } 

 module.exports.createUser = function(newUser,callback){
     bcrypt.hash(newUser.password, 10, function(err,hash){
            if(err) throw err;
            //set hashed pw
            newUser.password=hash;
            //create user
            newUser.save(callback);
     });
    
 }