const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser')
const urlEncode = bodyParser.urlencoded({extended:false});
const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const userProtect = require('../protect/userProtect')



// check data if are valid using joi library
const joi = require('joi');
const schema = joi.object({
    
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().min(3).required(),
    rePassword: joi.ref("password"),
    isAdmin: joi.boolean()
});

route.get('/',userProtect.isNotAuth,(req, res)=>{
    res.render('signup',{
        title: 'signup',
        isUser: false,
        isAdmin: false,
        validationError: req.flash('validationError')[0]
    })
})

route.post('/', userProtect.isNotAuth,urlEncode,(req, res)=>{
    const result = schema.validate(req.body);
    if(result.error){
        req.flash('validationError', result.error.details[0].message)
        res.redirect('/signup')
    }else{
        const user = new users({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin
        });
        bcrypt.hash(user.password,10).then((passHash)=>{
            user.password = passHash;
            return user.save()
        })
           .then(()=>{
               req.flash('userAdded','user added successfully');
               res.redirect('/login')
            })
           .catch((err)=>res.send(`error on ${err}`))
    }

})
module.exports = route