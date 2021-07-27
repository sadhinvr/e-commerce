const express = require('express');
const route  = express.Router();
const adminProtect = require('../../protect/adminProtect');
const PRODUCTS = require('../../models/productModel');
const multer = require('multer');


// route.get('/testProd',adminProtect.isAdmin,(req, res)=>{
//     res.render('testProd',{
//         title: 'testProd',
//         isAdmin: true,
//         isUser: true,
//         validationError: req.flash('validationError')[0]
//     })
// })

const joi = require('joi');
// const sch = joi.object({
//     name: joi.string().min(3).max(20).required(),
//     type: joi.string().min(2).max(20).required(),
//     price: joi.number().max(5).required(),
//     description: joi.string().min(3).max(100).required(),
//     // adminId: joi.string().required(),
//     quantity: joi.number().max(4)
// })
 const bodyParser = require('body-parser').urlencoded({ extended: false })
// route.post('/testProd', bodyParser, (req, res) => {
//     const result = sch.validate(req.body)
//     if (result.error) {
//         req.flash('validationError', result.error.details[0].message)
//         console.log(req.flash('validationError'))
//         res.redirect('/admin/testProd')
//     } else {
//         res.send('Oky ')
//     }
// })





route.get('/addProduct', adminProtect.isAdmin, (req, res) => {
    console.log(req.flash('success'))
    res.render('addProduct', {
        title: 'addProduct',
        userId: req.session.userId,
        isUser: true,
        isAdmin: true,
        validationError: req.flash('validationError')[0],
        failed: req.flash('failed')[0],
        success: req.flash('success')[0]
    })
})
const sch = joi.object({
    name: joi.string().min(3).max(20).required(),
    type: joi.string().min(2).max(20).required(),
    price: joi.number().required(),
    description: joi.string().min(3).max(100).required(),
    userId: joi.string().required(),
    quantity: joi.number()
})
const storage = multer.diskStorage({
    destination : (req, file, callback)=>{
        callback(null, './DBimages')
    },
    filename: (req, file, callback)=>{
        callback(null, Date.now()+'-'+file.originalname)
    }
});
const upload = multer({storage:storage})
route.post('/addProduct', upload.single('picture'),adminProtect.isAdmin, bodyParser, (req, res) => {
    const result = sch.validate({
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
        userId: req.body.userId
    })
    if (result.error) {
        req.flash('validationError', result.error.details[0].message)
        res.redirect('/admin/addProduct')
    } else {
        const product = new PRODUCTS({
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            userId: req.body.userId,
            picture: req.file.filename
        })
        // console.log(req.file)
        product.save()
        .then(()=>{
            req.flash('success','Product added success');
            res.redirect('/admin/addProduct')
        })
        .catch((err)=>{
            req.flash('failed', 'product not added');
            res.redirect('/admin/addProduct');
        })
    }
})






route.get('/orders',(req, res)=>{
    console.log(req.flash('valError'))
    res.render('orders',{
        title: 'orders',
        isAdmin: true,
        isUser: true,
        valError: req.flash('valError')[0]
    })
})
const ordSchema = joi.object({
    name: {type: String, required: true},
    type: { type: String, required: true }
})
route.post('/orders',adminProtect.isAdmin,bodyParser,(req, res)=>{
    const result = ordSchema.validate(req.body);
    if(result.error){
        req.flash('valError',result.error.details[0].message)
        res.redirect('/admin/orders')
    }else{
        res.send('oky')
    }
})

module.exports = route