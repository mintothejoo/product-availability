const fetch = require('node-fetch');
const moment = require('moment');
const serverURL = "https://www.bestbuy.ca/ecomm-api/availability/products?accept-language=en-CA&skus=14425777";
// let arr = [];
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
  const isNotAvailable = response.includes("NotAvailable") || response.includes("SoldOutOnline");
  console.log(`${isNotAvailable ? 'Not Available' : 'AVAILABLE!!!!!!!!!!!'} --- updated: ${moment().format("MM DD hh:mm:ss")}`)
}
setInterval(server, 2000);
