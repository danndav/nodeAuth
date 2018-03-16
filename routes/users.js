var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
    'title':'Register'
  })
});

router.get('/login', function(req, res, next) {
  res.render('login',{
    'title':'login'
  })
});

router.post('/register',multer({ dest: './uploads/'}).single(), function(req,res,next){
          //get form value
        var name=  req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;

        


        //check for image field
        if(req.files){
          console.log('uplaoding file...');

            //file info
            var profileImageOriginalName= req.files.files.originalname;
            var profileImageName =req.files.files.name;
            var profileImageMime =req.files.files.mimetype
            var profileImagePath =req.files.files.path
            var profileImageExt =req.files.files.extension
            var profileImageSize =req.files.files.size
          } else{
          //set a default image
          var profileImageName ='noimage.jpg'; 
        }

    //form validation
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').isEmail();
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('username',' username field is required').notEmpty();
    req.checkBody('password','password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password); 
    
    //check for errors

    var errors = req.validationErrors();

    if(errors){
      res.render('register',{
        errors: errors, 
        name: name,
        email:email,
        username:username,
        password:password,
        password2:password2
      });
    } else{
      var newUser = new User({
        name: name,
        email:email,
        username:username,
        password:password,
        files: profileImageName

      });

      //create User
      User.createUser(newUser,function(err, user){
        if(err) throw err;
        console.log(user);
      });
      //success message
      req.flash('success','you are now registered and may log in');

      res.location('/');
      res.redirect('/');
    }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username,password, done){
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log('unknown user')
        return done(null, false,{message: 'unknown user'});
      }

      User.comparePassword(password,user.password, function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else{
          console.log('invalid password');
          return done(null, false,{message:'Invalid Password'});
        };
      });
    });

  }
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'invalid username or password'}), function(req,res){
  console.log('Authentication successful');
  req.flash('success','you are logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success','you have logged out');
  res.redirect('/users/login');
});

module.exports = router;




















