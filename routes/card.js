const express = require('express');
const route = express.Router();
const userProtect = require('../protect/userProtect');
const bodyParser = require('body-parser').urlencoded({extended: false});
const joi = require('joi');
const CARDS = require('../models/cardModel');
const ORDERS = require('../models/orderModel');
const { json } = require('body-parser');

route.get('/',userProtect.isAuth,(req, res)=>{
    CARDS.find({userId: req.session.userId}).populate({
        path:'productId',
        model:'product'
    })
    .then((doc)=>{
        // console.log(doc)
        res.render('card', {
            title: 'card',
            isUser: true,
            isAdmin: req.session.isAdmin,
            card: doc,
            cardSaved: req.flash('cardSaved')[0],
            vError: req.flash('vError')[0],
            deleteCard: req.flash('deleteCard')[0],
        })
    })
    
})
const schema = joi.object({
    userId: joi.string().required(),
    productId: joi.string().required(),
    quantity: joi.number().min(1),
    time: joi.number()
});

route.post('/', userProtect.isAuth, bodyParser,(req, res)=>{
    const card = new CARDS({
        userId: req.session.userId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        time: Date.now()
    });
    CARDS.findOneAndUpdate({
        $and:[
            { userId: card.userId},
            { productId: card.productId }
        ]},
        {quantity: req.body.quantity, time: Date.now()},
        { upsert: true, new: true, setDefaultsOnInsert: true })
        .then(()=>{
        req.flash("cardSaved", "added to card success");
        res.redirect('/card')
    }).catch((err)=>{
        req.flash("vError",err);
        res.redirect('/card')
    })
    
});

route.post('/delete', userProtect.isAuth,bodyParser,(req, res)=>{
    CARDS.deleteOne({_id: req.body.cardId}).then(()=>{
        req.flash('deleteCard','deleted successfully');
        res.redirect('/card');
    })
});

async function postData(url = '', data = {}) {

    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

route.post('/addOrder',userProtect.isAuth,bodyParser,(req, res)=>{

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.send(postData(fullUrl, req.body))
})

route.post('/saveall',(req,res)=>{
    // const card = new CARDS({
    //     userId: req.session.userId,
    //     productId: req.body.productId,
    // });


    req.body.forEach(product=>{
        CARDS.findOneAndUpdate({
            $and:[
                { userId: req.session.userId},
                { productId: product.productId }
            ]},
            {quantity: product.quantity, time: Date.now()})
            .then(()=>{
            req.flash("cardSaved", "saved");
        }).catch((err)=>{
            req.flash("vError",err);
        })
    })
    
    res.redirect('/card')
})


module.exports = route
// let today = new Date();
// let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();