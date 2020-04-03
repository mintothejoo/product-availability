import cors from 'cors';
import fetch from 'node-fetch';
import moment from 'moment';
import bodyParser from 'body-parser';
import express from 'express';
const app = express()
const serverURL = "https://www.bestbuy.ca/ecomm-api/availability/products?accept-language=en-CA&skus=14425777";
var port = process.env.PORT || 3100;
// let arr = [];
// https://www.bestbuy.ca/ecomm-api/availability/products?accept-language=en-CA&skus=14425777
// https://rh.nexus.bazaarvoice.com/highlights/v3/1/thesourceca/108086956


const corsVal = {
  whitelist: {
    development: [
      undefined,
      'http://localhost',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    staging: [
      undefined,
      'http://localhost:3000',
    ],
    production: [
      undefined,
      'http://localhost:3000',
    ],
  },
};
const whitelist = corsVal.whitelist[process.env.NODE_ENV || 'development'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Host ("'+ process.env.NODE_ENV + ':' + origin +'") is not allowed by CORS!'))
        }
    },
    maxAge: 300,
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, On-behalf-of, x-apicache-bypass",
    exposedHeaders: "Origin, X-Requested-With, Content-Type, Accept, On-behalf-of, x-apicache-bypass"
};
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors(corsOptions));


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

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))