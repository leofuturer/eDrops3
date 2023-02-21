const crypto = require("crypto");
const https = require('https')

const handOffOrderData = (rawbody) => {

  const data = rawbody

  return new Promise((resolve, reject) => {
    const options = {
      host: 'edroplets.org',
      path: '/api/orderInfos/newOrderCreated',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      resolve(JSON.stringify(res.statusCode));
    });
    
    req.on('error', (e) => {
      reject(e.message);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  });
};


exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  
  
  var rawbody = event['rawbody']
  var hmac_to_verify = event['headers']['X-Shopify-Hmac-Sha256']
  
  var messageBuf = Buffer.from(rawbody, 'utf8');
  //Shared Secret is pulled from environment variables set in Lambda Runtime
 	var computedDigest = crypto.createHmac('SHA256', process.env.SS_SECRET).update(messageBuf).digest('base64');
 	
 	
 	if(computedDigest === hmac_to_verify) {
 	  console.log("Shopify verified");
 	  await handOffOrderData("")
    .then(result => console.log(`Status code: ${result}`))
    .catch(err => console.error(`Error doing the request for the event: ${JSON.stringify(event)} => ${err}`));
 	} else {
 	  console.log("Shopify NOT verified");
 	  return {
        'statusCode': 200
    }
 	}
}
