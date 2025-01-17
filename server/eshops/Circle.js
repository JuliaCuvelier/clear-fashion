const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('li.grid__item')
    .map((i, element) => {
      const name = $(element)
        .find('.card__heading.h5')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price__sale .money')
          .text()
          .slice(1)
      );
      const link = "https://shop.circlesportswear.com" + $(element)
      .find('h3.h5 .full-unstyled-link')
      .attr('href');


      const image = "https:" + $(element)
      .find('img')[0].attribs['src']

      const date = new Date().toDateString();

      const brand= 'Circle';
      return {name, price,link,image, brand,date};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async () => {
  try {

    url = "https://shop.circlesportswear.com/collections/all"
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
