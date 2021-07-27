const express = require('express');
const route = express.Router();
const bodyParser  = require('body-parser');
const urlEncode = bodyParser.urlencoded({extended:false})
const users = require('../models/userModel');
let bcrypt = require('bcrypt');
const userProtect = require('../protect/userProtect')

route.get('/', userProtect.isNotAuth,(req, res)=>{
    res.render('login',{
        title:'Login',
        authError: req.flash("authError")[0],
        userAdded: req.flash('userAdded')[0],
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin
    });
});
route.post('/', userProtect.isNotAuth, urlEncode,(req, res)=>{
    users.findOne({email:req.body.email})
      .then((doc)=>{
          if(!doc){
              req.flash("authError","this emil not found !!")
              res.redirect('/login')
          }else{
              bcrypt.compare(req.body.password, doc.password).then((same)=>{
                  if(!same){
                      req.flash("authError", 'wrong password !!')
                      res.redirect('/login')
                  }else{
                      req.session.userId = doc._id;
                      req.session.isAdmin = doc.isAdmin;
                      res.redirect('/');
                  }
              })
              
          }
      })
})


module.exports = route;