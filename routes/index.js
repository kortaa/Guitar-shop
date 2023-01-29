var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/cart')

var Product = require('../models/product');

const csrfProtection = csrf();
router.use(csrfProtection);
/* GET home page. */
router.get('/', async function(req, res, next) {
  let products = await Product.find().lean();
  res.render('shop/index', {title: 'Nice ass', products: products})
});

router.get('/about-us', async function(req, res, next) {
  let products = await Product.find().lean();
  res.render('shop/about-us')
});



router.get('/add-to-cart/:id', function (req, res, next){
  const productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}, totalQty: 0, totalPrice: 0});

  Product.findById(productId, function (err, product){
    if(err){
      console.log(err);
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/add-shopping-cart/:id', function (req, res, next){
  const productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}, totalQty: 0, totalPrice: 0});

  Product.findById(productId, function (err, product){
    if(err){
      console.log(err);
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
  });
});

router.get('/reduce/:id', function (req, res, next){
  const productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}, totalQty: 0, totalPrice: 0});

  cart.reduce(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next){
  const productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}, totalQty: 0, totalPrice: 0});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});



router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: parseFloat(cart.totalPrice).toFixed(2)});
});





module.exports = router;
