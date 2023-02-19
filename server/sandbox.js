/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart=require('./eshops/Montlimart');
const cicrle= require('./eshops/Circle');


const link = [  "https://shop.circlesportswear.com/collections/all", 
"https://www.montlimart.com/99-vetements", 
"https://www.montlimart.com/14-chaussures",
"https://www.montlimart.com/15-accessoires",
"dedicatedbrand"//tout le site
]

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {

    let products=[];
    if (eshop.includes("dedicatedbrand"))
    {

    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

     products = await dedicatedbrand.scrape(eshop);
    
    console.log(products);
    }

    if (eshop.includes("montlimart"))
    {

    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

     products = await montlimart.scrape(eshop);
    
    console.log(products);
    }

    if (eshop.includes("circle"))
    {

    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

     products = await cicrle.scrape(eshop);
    
    console.log(products);
    }
    console.log('done');
    process.exit(0);
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
