var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop');

var products = [
    new Product({
    imagePath: 'images/guitar1.jpg',
    title: 'Fender Limited Edition Joe Strummer Esquire Relic Masterbuilt Jason Smith',
    price: 24999.99
    }),
    new Product({
        imagePath: 'images/guitar2.jpg',
        title: 'Fender Private Collection H.A.R. Stratocaster',
        price: 1899.99
    }),
    new Product({
        imagePath: 'images/guitar3.jpg',
        title: 'Fender \'61 Strat HRL RW Super Faded Aged',
        price: 1399.99
    }),
    new Product({
        imagePath: 'images/guitar4.jpg',
        title: 'ESP Snakebyte',
        price: 9999.99
    }),
    new Product({
        imagePath: 'images/guitar5.jpg',
        title: 'Gibson 1963 Les Paul SG Custom Matestro Vibrola VOS',
        price: 5999.99
    }),
    new Product({
        imagePath: 'images/guitar6.jpg',
        title: 'Ibanez Steve Vai PIA3761-SLW',
        price: 999.99
    }),

];

var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function (err, result){
        done ++;
        if (done === products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}