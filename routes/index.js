var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var categoryModule = require('../modules/category');
var categorPasswordModule = require('../modules/password_details');
var bcrypt = require('bcryptjs');
/* GET home page. */
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { response } = require('express');
const { isValidObjectId } = require('mongoose');

// var catModule = categoryModule.find({});

function loginUserCheck(req,res,next)
{
  var token = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(token, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/', function(req, res, next) {
  var token = localStorage.getItem('userToken');
  if(token)
  {
    res.redirect('/dashboard');
  }
  else
  {
    res.render('index', { title: 'Login Form',msg:'' });
  }
});

router.post('/', function(req, res, next) {

  email = req.body.email;
  password = req.body.password;
  if(email !='' && password !="")
  { 
      var checkUser =  userModule.findOne({email: email});
      checkUser.exec((err,data)=>{
        if(err) throw err;
        var getUserId = data._id;
        var getpassword = data.password;
      
        if(bcrypt.compareSync(password,getpassword))
        {
          var token = jwt.sign({ userID: getUserId }, 'loginToken');
          localStorage.setItem('userToken', token);
          localStorage.setItem('userName', data.username);
          res.redirect('/dashboard');
        // res.render('index', { title: 'Login Form',msg:'Login done'});
        }
        else
        {
          res.render('index', { title: 'Login Form',msg:'invalid login details email and password'});
        }
      });
    }
    else
    {
      res.render('index', { title: 'Login Form',msg:'please add form fields'});
    }
  
});

router.get('/dashboard',loginUserCheck, function(req, res,next) {
  var username = localStorage.getItem('userName');
  res.render('dashboard', { title: 'Dashboard',username:username, msg:'' });
});

router.get('/signup', function(req, res, next) {
  var token = localStorage.getItem('userToken');
  if(token)
  {
    res.redirect('/dashboard');
  }
  else
  {
    res.render('signup', { title: 'Sign Up Forms',msg:'' });
  }
});


function checkEMail(req,resp,next)
{
  var email = req.body.email;
  var existemail =  userModule.findOne({email: email});
  existemail.exec((err, data)=>{
      if(err) throw err;
      if(data){
        return resp.render('signup', { title: 'Sign Up Form', msg:'Email already exist'});
      }
      next();
  });
}

function checkcategory(req,resp,next)
{
  var username = localStorage.getItem('userName');
  var category = req.body.category;
  var existemail =  categoryModule.findOne({category: category});
  existemail.exec((err, data)=>{
      if(err) throw err;
      if(data){
        return resp.render('add_category', { title: 'add category',username:username,msg:'Category already exist',error:''});
      }
      next();
  });
}

function checkcategorypass(req,resp,next)
{
  var username = localStorage.getItem('userName');
  var category = req.body.category;
  var existemail =  categorPasswordModule.findOne({password_category: category});
  existemail.exec((err, data)=>{
      if(err) throw err;
      if(data){
        var catModule = categoryModule.find({});
        catModule.exec((erro, doc)=>{
        //catModule.exec(function(err,data){
            if(erro) throw erro;
            console.log(doc);
        return resp.render('add_password', { title: 'add category passwords',records:doc,username:username,msg:'Category password already exist',error:''});
      });
    }
      next();
  });

}
router.post('/signup',checkEMail, function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var confirmpassword = req.body.confirmpassword;

  if(password != confirmpassword)
  {
    res.render('signup', { title: 'Sign Up Form', msg:'password not match with confirm password'});
  }
  else
  {  
    password = bcrypt.hashSync(req.body.password,10);
    var userDetails = new userModule({
      username : username,
      email: email,
      password : password
    });
      userDetails.save((err,doc)=>{
        if(err) { throw err; }
        res.render('signup', { title: 'Sign Up Form', msg:'User register successfully'});
      });
    }
});

router.get('/passwordcategory', function(req, res, next) {
  var username = localStorage.getItem('userName');
  var catModule = categoryModule.find({});
  catModule.exec((err, data)=>{
  //catModule.exec(function(err,data){
      if(err) throw err;
      else
      {
        res.render('passwordcategory', { title: 'Password Category List',username:username ,records:data });
      }
  });
  
});


router.get('/passwordcategory/delete/:id', function(req, res, next) {
  var username = localStorage.getItem('userName');
  var id = req.params.id;
  var catDel = categoryModule.findByIdAndDelete(id);
  catDel.exec(function(err){
    if(err) throw err;
    res.redirect('/passwordcategory');    
  });
  
  
});


router.get('/passwordcategory/edit/:id', function(req, res, next) {
  var username = localStorage.getItem('userName');
  var id = req.params.id;
  var catDel = categoryModule.findById(id);
//  or
// var catDel = categoryModule.findByOne({_id:id});  
catDel.exec(function(err,data){
    if(err) throw err;
    else
    {
      console.log(data);
      res.render('category_update', { title: 'Category Update',username:username,msg:'', error:'',data :data });
    }   
  });
});

router.get('/add_category', function(req, res, next) {
  var username = localStorage.getItem('userName');
  res.render('add_category', { title: 'Add Category',username:username,msg:'', error:'' });
});

router.post('/add_category',loginUserCheck,checkcategory,[body('category','Enter password category name').isLength({ min: 1 })],function(req, res, next) {
  var username = localStorage.getItem('userName');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.mapped());
    
    res.render('add_category', { title: 'Add Category', msg:'',error:errors.mapped(),username:username});
   }
  else
  {
       var category = req.body.category;
      var categoryDetails = new categoryModule({
        category : category
      });
      categoryDetails.save((err,doc)=>{
        if(err) { throw err; }
        res.redirect('/passwordcategory');
        // res.render('add_category', { title: 'Add Category', msg:'category added successfully',error:'',username:username});
      });
    } 
});


router.post('/update_category',loginUserCheck, function(req, res, next) {
  var username = localStorage.getItem('userName');
  var id = req.body.id;
  var category = req.body.category;
  // console.log(category);
  var catDel = categoryModule.findByIdAndUpdate(id,{category:category});
//  or
// var catDel = categoryModule.findByOne({_id:id});  
catDel.exec(function(err,data){
    if(err) throw err;
    else
    {
      // console.log(data);
     res.redirect('/passwordcategory');
      //res.render('category_update', { title: 'Category Update',username:username,msg:'', error:'',data :data });
    }   
  });
});

router.get('/add_password', function(req, res, next) {
  var username = localStorage.getItem('userName');
  var catModule = categoryModule.find({});
  catModule.exec((err, data)=>{
  //catModule.exec(function(err,data){
      if(err) throw err;
      else
      {
        // console.log(data); 
        res.render('add_password', { title: 'Add Password',username:username ,records:data });
        // res.render('add_password', { title: 'Add Password',username:username });
      }
  });
  
});

router.post('/add_password',loginUserCheck,checkcategorypass,[body('category','Select password category name').isLength({ min: 1 })],function(req, res, next) {
  var username = localStorage.getItem('userName');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.mapped());
    
    res.render('add_password', { title: 'Add Password', msg:'',error:errors.mapped(),username:username,message:''});
   }
  else
  {
       var category = req.body.category;
       var password = req.body.editor1;

       console.log(req);
      var categorypassDetails = new categorPasswordModule({
        password_category : category,
        password_detail : password
      });
      categorypassDetails.save((err,doc)=>{
        if(err) { throw err; }
        res.redirect('/password_list');
        // res.render('add_category', { title: 'Add Category', msg:'category added successfully',error:'',username:username});
      });
    } 
});



router.get('/password_list', function(req, res, next) {
  var username = localStorage.getItem('userName');

  //const match = { $match: { _id: ObjectId(id) } };
  var catPass = categorPasswordModule.aggregate([
    {
    $lookup :
    {
      from: "categories",
      localField:  "password_category",
      foreignField: "_id",
      as: "pass_cat"
    }
  },{
    $unwind:"$pass_cat"
  }
]).exec((err, data)=>{
  //catModule.exec(function(err,data){
      if(err) throw err;
      else
      {
        console.log(data); 
      //  res.send(data);
        res.render('password_list', { title: 'Password list',username:username ,records:data ,message:'Password saved successfully'});
        // res.render('add_password', { title: 'Add Password',username:username });
      }
  });

  // res.render('password_list', { title: 'Password List',username:username });
});


router.get('/password_details_edit/:id', function(req, res, next) {
  var username = localStorage.getItem('userName');

  var id = req.params.id;
  var catPass = categorPasswordModule.findById({'_id':id});
  catPass.exec((err, data)=>{
  //catModule.exec(function(err,data){
      if(err) throw err;
      else
      {
        var catModule = categoryModule.find({});
        catModule.exec((err, data1)=>{
        //catModule.exec(function(err,data){
            if(err) throw err;
            else
            {
            
        //console.log(data); 
        res.render('password_details_edit', { title: 'Password details edit',username:username,records:data1 ,record:data ,message:''});
        // res.render('add_password', { title: 'Add Password',username:username });
      }});  
    
    }
  });

  // res.render('password_list', { title: 'Password List',username:username });
});

router.get('/passworddetalcategory/delete/:id', function(req, res, next) {
  var username = localStorage.getItem('userName');
  var id = req.params.id;
  var catDel = categorPasswordModule.findByIdAndDelete(id);
  catDel.exec(function(err){
    if(err) throw err;
    res.redirect('/password_list');    
  });
  
  
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
  res.redirect('/');
});

module.exports = router; 
