require("dotenv").config()

const fs=require('fs');

const {MongoClient} = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;

//console.log(MONGODB_URI)


const MONGODB_DB_NAME = 'ClearFashion';


let db;
let collection;



const products = JSON.parse(fs.readFileSync('products.json'));

async function InsertProducts(products)
{
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME);

    collection=db.collection('products');
    //collection.drop()

    const res= await collection.insertMany(products);
    console.log('products inserted');

    client.close();
}

async function findProductsByBrand(brandName) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME);

    collection=db.collection('products');
    const products = await collection.find({ brand: brandName }).toArray();
    console.log('Products for ' + brandName + ':', products);

    client.close();
}

async function findProductsByPrice(maxPrice) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME);

    collection=db.collection('products');
    const products = await collection.find({ price: { $lt: maxPrice } }).toArray();
    console.log('Products less than ' + maxPrice + ':', products);

    client.close();
}

async function findProductsSortedByPrice() {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME);

    collection=db.collection('products');
    const products = await collection.find().sort({ price: 1 }).toArray();
    console.log('Products sorted by price:', products);

    client.close();
}

async function findProductsSortedByDate() {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME);

    collection=db.collection('products');
    const products = await collection.find().sort({ date: -1 }).toArray();
    console.log('Products sorted by date:', products);

    client.close();
}

async function findProductsScrapedLessThanTwoWeeksAgo() {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db =  client.db(MONGODB_DB_NAME);

    collection=db.collection('products');
    const twoWeeksAgo = new Date(Date.now() - 12096e5);
    const products = await collection.find({ date: { $gt: twoWeeksAgo } }).toArray();
    console.log('Products scraped less than 2 weeks ago:', products);

    client.close();
}

InsertProducts(products);
//findProductsByBrand('Circle');
findProductsByPrice(10);
//findProductsSortedByPrice();
//findProductsSortedByDate();
//findProductsScrapedLessThanTwoWeeksAgo();
