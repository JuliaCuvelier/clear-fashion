require("dotenv").config();

const fs = require('fs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'ClearFashion';

let db;

async function connect() {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  db = client.db(MONGODB_DB_NAME);
}

async function insertProducts(products) {
  await connect();

  const collection = db.collection('products');
  await collection.deleteMany({});
  const res = await collection.insertMany(products);
  console.log('products inserted');

  process.exit();
}

async function findProductsByBrand(brandName) {
  await connect();

  const collection = db.collection('products');
  const products = await collection.find({ brand: brandName }).toArray();
  console.log('Products for ' + brandName + ':', products);

  process.exit();
}

async function findProductsByPrice(maxPrice) {
  await connect();

  const collection = db.collection('products');
  const products = await collection.find({ price: { $lt: maxPrice } }).toArray();
  console.log('Products less than ' + maxPrice + ':', products);

  process.exit();
}

async function findProductsSortedByPrice() {
  await connect();

  const collection = db.collection('products');
  const products = await collection.find().sort({ price: 1 }).toArray();
  console.log('Products sorted by price:', products);

  process.exit();
}

async function findProductsSortedByDate() {
  await connect();

  const collection = db.collection('products');
  const products = await collection.find().sort({ date: -1 }).toArray();
  console.log('Products sorted by date:', products);

  process.exit();
}

async function findProductsScrapedLessThanTwoWeeksAgo() {
  await connect();

  const collection = db.collection('products');
  const twoWeeksAgo = new Date(Date.now() - 12096e5);
  const products = await collection.find({ date: { $gt: twoWeeksAgo } }).toArray();
  console.log('Products scraped less than 2 weeks ago:', products);

  process.exit();
}

const products = JSON.parse(fs.readFileSync('products.json'));

//insertProducts(products);
//findProductsByBrand('Circle');
findProductsByPrice(10);
//findProductsSortedByPrice();
//findProductsSortedByDate();
//findProductsScrapedLessThanTwoWeeksAgo();
