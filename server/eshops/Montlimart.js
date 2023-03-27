const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = async (data) => {
  const $ = cheerio.load(data);

  const products = $('.products-list__block')
    .map((i, element) => {
      const name = $(element)
        .find('.text-reset')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );

      const link = $(element)
        .find('.product-miniature__thumb-link')
        .attr('href');

      const brand = 'Montlimart';

      const image = $(element)
        .find('.product-miniature__thumb img')
        .attr('data-src');

      const date = new Date().toDateString();

      return { name, price, link, image, brand, date };
    })
    .get();

  const promises = products.map(async (product) => {
    if (product.image && product.image.includes('.mp4')) {
      const response = await fetch(product.link);
      const body = await response.text();
      const $ = cheerio.load(body);
      product.image = $('meta[property="og:image"]').attr('content');
    }
    return product;
  });

  return Promise.all(promises);
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports.getLinks = async () => {
  try {
    const response = await fetch("https://www.montlimart.com/");

    if (response.ok) {
      const body = await response.text();
      const $ = cheerio.load(body);
      const links = $('.sub .a-niveau1')
        .map((i, element) => {
          return $(element).attr('href');
        })
        .get();
      return links.filter(link => !link.includes("a-propos"));
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}