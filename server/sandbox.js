/* eslint-disable no-console, no-process-exit */
const fs = require('fs');
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart=require('./eshops/Montlimart');
const cicrle= require('./eshops/Circle');


const link = ["dedicatedbrand",
"https://shop.circlesportswear.com/collections/all",
"montlimart"];



async function sandbox (eshop = undefined, number = -1) {

  if (eshop==undefined && number==-1){
    var allProducts = [];
    for(var i = 0; i < link.length; i++)
    {
      allProducts.push(...await sandbox(link[i], i));
    }

    let data = JSON.stringify(allProducts);
    fs.writeFileSync('products.json', data);
    console.log("Products in the json file: " + allProducts.length);
    process.exit(0);
  }
  else {
    try {

      var products = "";

      if (eshop.includes("dedicatedbrand"))
      {

      console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

      products = await dedicatedbrand.getProducts();
      
      /*console.log(products);*/
      }
      else if(eshop == 'montlimart'){
        link.push(...await montlimart.getLinks());
        return [];
      }
      else if (eshop.includes("montlimart"))
      {

      console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

      products = await montlimart.scrape(eshop);
      
      /*console.log(products);*/
      }

      else if (eshop.includes("circle"))
      {

      console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

      products = await cicrle.scrape(eshop);
      
      /*console.log(products);*/
      }
      else
      {
        console.log('eshop not found');
        process.exit(1);
      }
      console.log(products);
      console.log('done ' + products.length + ' products found');
      if(number == -1)
      {
        process.exit(0);
      }
      return products;
      
      
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

}
const [,, eshop] = process.argv;

sandbox(eshop);
