require("dotenv").config()
const {MongoClient} = require('mongodb');
const MONGODB_DB_NAME = 'ClearFashion';
 
const brand = 'dedicatedbrand';
const price = 40;

const MONGODB_URI = process.env.MONGODB_URI;



async function FindByBrand(brand) {	

	
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	
    const result = await collection.find({brand}).toArray();
    client.close();
	console.log(result);
}

async function FindlessThan(Price_) {	

	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	
	
    const result = await collection.find({price: {$lt: Price_}}).toArray();
    client.close();
	console.log(result);
}

async function FindsortedbyPrice() {	

	
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');

    const result = await collection.find().sort({price: 1}).toArray();
    client.close();
	console.log(result);
}

async function FindsortedbyDate() {	

	
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	
    const result = await collection.find().sort({scrapedate: -1}).toArray();
    client.close();
	console.log(result);
}

async function FindsortedbyRecentDate() {	

	
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');

	let twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const result = await collection.find({scrapedate: {$gt: twoWeeksAgo}}).toArray();
	client.close();
    console.log(result);
}


FindByBrand(brand);
