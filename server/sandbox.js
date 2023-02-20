/* eslint-disable no-console, no-process-exit */
const fs = require('fs');
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart=require('./eshops/Montlimart');
const cicrle= require('./eshops/Circle');

const linkdedicated=[]
const link = [  "https://shop.circlesportswear.com/collections/all", 
"https://www.montlimart.com/99-vetements", 
"https://www.montlimart.com/14-chaussures",
"https://www.montlimart.com/15-accessoires",
/*"https://www.dedicatedbrand.com/en/women/all-women",*/
/*'https://www.dedicatedbrand.com/en/men/all-men',*/
/*'https://www.dedicatedbrand.com/en/men/all-men#page=16',*/
'https://www.dedicatedbrand.com/en/kids/t-shirts',
'https://www.dedicatedbrand.com/en/kids/sweatshirts',
'https://www.dedicatedbrand.com/en/kids/bottoms',
'https://www.dedicatedbrand.com/en/kids/swimwear',

]
for (let i=0;i<17;i++){
  linkdedicated.push(`https://www.dedicatedbrand.com/en/men/all-men#page=${i}`)
}

for (let i=0;i<17;i++){
  linkdedicated.push(`https://www.dedicatedbrand.com/en/women/all-women#page=${i}`)
}

const combinedLinks = link.concat(linkdedicated);
console.log(combinedLinks);


async function sandbox (eshop = undefined, number = -1) {

  if (eshop==undefined && number==-1){
    var allProducts = [];
    for(var i = 0; i < combinedLinks.length; i++)
    {
      allProducts.push(...await sandbox(combinedLinks[i], i));
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

      products = await dedicatedbrand.scrape(eshop);
      
      /*console.log(products);*/
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
