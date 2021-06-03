# Lambda function to verify incoming Shopify Webhooks
Bump-in-the-wire AWS Lambda function to validate Shopify HMACs

To deploy, zip the index.js file and upload to the "testShopify" Lambda function located in us-west-1

Insert the Shopify Shared Secret into the Lambda runtime with Configuration>Environment Variables

To access/log the raw body, use event['rawbody']
To access/log the HMAC, use event['headers']['X-Shopify-Hmac-Sha256']

Requires reachability to VPC where main instance is located.
