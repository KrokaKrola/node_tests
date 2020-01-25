const fs = require('fs');
const http = require('http');
const url = require('url');

/* fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  if (err) return console.log('Cant find start.txt file');
  fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, fileData) => {
    fs.readFile('./txt/append.txt', 'utf-8', (err, appendData) => {
      fs.writeFile('./txt/final.txt', fileData + ' \n' + appendData, err => {
        err && console.log(err);
      });
    });
  });
}); 
console.log('Reading file...');*/

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    const cardsHtml = dataObj
      .map(card => replaceTemplate(tempCard, card))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    const output = replaceTemplate(tempProduct, dataObj[query.id]);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Contnent-type': 'application/json'
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    res.end('404');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('started on 8000');
});
