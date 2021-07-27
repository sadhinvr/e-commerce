const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser')
const urlEncode = bodyParser.urlencoded({ extended: false });
const PRODUCTS = require('../models/productModel');

route.get('/:id', (req, res)=>{
    PRODUCTS.findOne({_id:req.params.id})
    .then((doc)=>{
        res.render('product',{
            title: doc.name,
            product: doc,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin
        })

    })
})

module.exports = route;