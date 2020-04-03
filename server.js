const fetch = require('node-fetch');
const moment = require('moment');
const serverURL = "https://www.bestbuy.ca/ecomm-api/availability/products?accept-language=en-CA&skus=14425777";
const express = require('express')
const app = express()
const port = 3100
// let arr = [];
// https://www.bestbuy.ca/ecomm-api/availability/products?accept-language=en-CA&skus=14425777
// https://rh.nexus.bazaarvoice.com/highlights/v3/1/thesourceca/108086956


app.get('/', async (req, res) => {
  let str = '';
  let isNotAvailable;
  const server = async () => {
    let response = await fetch(serverURL, {
      headers: { 
        'Content-Type': 'application/vnd.api+json',
        'accept': 'application/json',
        'mode': 'cors',
      },
    });
    response = await response.text();
  
    response = JSON.stringify(response);
    response = JSON.parse(response);
  
    response = response.split("shipping");
    response = response[1];
    isNotAvailable = response.includes("NotAvailable") || response.includes("SoldOutOnline") || response.includes("Unknown");
    // console.log(`${isNotAvailable ? 'Not Available' : 'AVAILABLE!!!!!!!!!!!'} --- updated: ${moment().format("MM DD hh:mm:ss")}`)
    str = `${isNotAvailable ? 'Not Available' : 'AVAILABLE!!!!!!!!!!!'} --- updated: ${moment().format("MM DD hh:mm:ss")}`;
  }
  await server();
  res.send({ message: str, isNotAvailable });
  // setInterval(server, 2000);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))