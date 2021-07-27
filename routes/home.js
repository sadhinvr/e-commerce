const express = require('express');
const route = express.Router();
// const protectUser = require('../protect/userProtect')
const PRODUCTS = require('../models/productModel');

route.get('/',(req, res)=>{
    console.log(`the user is ${req.session.userId} isAdmin: ${req.session.isAdmin}`);
    PRODUCTS.find().then((doc)=>{
        res.render('home',{
            title: 'Home',
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            products: doc
        })
    }).catch((err)=>{
        res.send(err)
    })
});

module.exports = route