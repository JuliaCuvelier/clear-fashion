

// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/
Search for specific products
This endpoint accepts the following optional query string parameters:
- `page` - page of products to return
- `size` - number of products to return
GET https://clear-fashion-api.vercel.app/brands
Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
let recentProducts=0;
let nbNewProducts=0;
let p50 = 0;
let p90 = 0;
let p95 = 0;
let lastReleasedDate = '2020-01-01';
let setFavorite = new Set();
let filterFavorite = "no";


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');

//brand
const brandSelect = document.querySelector('#brand-select');
const SpanNbBrands = document.querySelector('#nbBrands');
//filter
const filterSelect = document.querySelector('#filter-select');
const selectSort= document.querySelector('#sort-select');
const selectFavorite = document.querySelector("#favorite-select");

//indicators :
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts= document.querySelector('#nbNewProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanLastReleasedDate = document.querySelector('#lastReleasedDate');
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  currentPagination.pageSize=parseInt(selectShow.value);
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand="all", filter="no filter",sort="price-asc") => {
  try {

    let url=`https://clear-fashion-api.vercel.app?size=999`
    
    const response = await fetch(url+ (brand !== "all" ? `&brand=${brand}` : ""));
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    let {result,meta}=body.data;

    if (filter==="By reasonable price"){
        result=result.filter(product=>product.price<50);
    }

    //to allow to count the number of new products later//
     const  newProduct = result.filter(product=>{
      const timeDifference = new Date() - new Date(product.released);
      const timeDifferenceInDays = timeDifference / (1000 * 60 * 60 * 24);
      return timeDifferenceInDays < 14;});

    if (filter==="By recently released"){
           
      result=newProduct
      
    }
    
    if (filter==="By favorite")
    {
      body.data.result = body.data.result.filter(a => setFavorite.has(a._id) == true);
    }
    nbNewProducts=newProduct.length;

    meta={currentPage:page,
    pageCount:Math.ceil(result.length/size),
    pageSize:size,
    count:result.length}

      //To do 5//
    if (sort==="price-asc")
    {
      result= [...result].sort((a, b) => a.price - b.price);
    }
    if (sort==="price-desc")
    {
      result= [...result].sort((a, b) => b.price - a.price);
    }

    //To do 6 //
    if (sort=="date-asc")
    {
      result= [...result].sort((a,b) => new Date(b.released)-new Date(a.released));
    }

    if (sort=="date-desc")
    {
      result= [...result].sort((a,b) => new Date(a.released)-new Date(b.released));
    }
    
    if (result.length > 0) {
      const products = [...result].sort((a, b) => a.price - b.price);
      /*To do 10 and 11*/
      p50 = products[Math.floor(products.length * .50)].price;
      p90 = products[Math.floor(products.length * .90)].price;
      p95 = products[Math.floor(products.length * .95)].price;
      lastReleasedDate = [...result].sort((a, b) => new Date(b.released) - new Date(a.released))[0].released;
    }
    
    result=result.slice((page-1)*size,page*size);
    return {result,meta};

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a target="_blank" href="${product.link}">${product.name}</a>  <! --to do 12 -->
        <span>${product.price}</span>
        <!-- <span>${product.released}</span> -->
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 *  page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination,products) => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML=nbNewProducts;
  SpanNbBrands.innerHTML=nbBrand;

  spanP50.innerHTML = p50;
  spanP90.innerHTML = p90;
  spanP95.innerHTML = p95;

  spanLastReleasedDate.innerHTML = lastReleasedDate;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination, products);

  
};

/*render recent prooducts to do 3*/


/* render brands selector*/
const brands = ["all","coteleparis", "dedicated", "aatise", "adresse", "1083", "hast", "loom", "panafrica"];
const nbBrand=brands.length -1;
const renderBrands = brands => {
  const options = brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');

  brandSelect.innerHTML = options;
};


renderBrands(brands);

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value),brandSelect.value, filterSelect.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/* Select Page, Feature 1*/
selectPage.addEventListener('change', async (event) => {
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize,brandSelect.value,filterSelect.value, selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/*selector brands*/

brandSelect.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, event.target.value, filterSelect.value, selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/*selector filter*/
filterSelect.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize,brandSelect.value,event.target.value,selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/*selector sort*/
selectSort.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize,brandSelect.value,filterSelect.value,event.target.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

