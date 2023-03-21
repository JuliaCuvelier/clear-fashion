const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8092;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'ClearFashion';
let ObjectId = require('mongodb').ObjectId;

let db;

async function connect() {
  const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
  db = client.db(MONGODB_DB_NAME);
  console.log("connection ok");
}

connect();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (req, res) => {
  res.send({ response: 'ok' });
});

app.get('/brands', async (req, res) => {
  try {
    const collection = db.collection('products');
    const searchResult = await collection.distinct('brand');
    res.send({ result: searchResult });
  } catch (e) {
    res.send({ error: 'invalid search' });
  }
});

app.get('/products/search', async (request, response) => {
  try {
    let { brand: brandFilter, price: maxPrice, limit: numPerPage } = request.query;
    console.log('brandFilter:', brandFilter);
    console.log('maxPrice:', maxPrice);
    console.log('numPerPage:', numPerPage);

    // const client = await connect();
    const collection = db.collection('products');

    let query = {};
    if (brandFilter !== undefined) {
      query.brand = brandFilter;
    }
    if (maxPrice !== undefined) {
      query.price = { $lte: parseInt(maxPrice) };
    }
    if (numPerPage === undefined) {
      numPerPage = 12;
    }
    console.log('query:', query);

    const searchresult = await collection.find(query).limit(parseInt(numPerPage)).toArray();
    response.send({ result: searchresult });
  } catch(e) {
    console.error(e);
    response.send({ error: "invalid search" });
  }
});


app.get('/products/:id', async (req, res) => {
  try {
    const collection = db.collection('products');

    const productId = req.params.id;
    const searchResult = await collection.findOne({ _id: ObjectId(productId) });
    res.send({ result: searchResult });
  } catch (e) {
    res.send({ error: 'invalid id' });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Running on port ${PORT}`);
});

module.exports = app;