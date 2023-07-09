This folder needs to have the following .env files:  
  
`backend.env`  
  
Contents of `backend.env`:    
NODE_ENV=production  
  
APP_MYSQL_DATABASE=  
APP_MYSQL_USERNAME=  
APP_MYSQL_PASSWORD=  
APP_MYSQL_HOST=****.us-west-1.rds.amazonaws.com  
APP_MYSQL_PORT=  
  
APP_FRONTEND_HOSTNAME=edroplets.org  
APP_FRONTEND_PORT=443  
  
S3_BUCKET_NAME=  
S3_AWS_ACCESS_KEY_ID=  
S3_SECRET_ACCESS_KEY=  
S3_AWS_DEFAULT_REGION=  
  
APP_EMAIL_HOST=smtp.sendgrid.net  
APP_EMAIL_PORT=465  
APP_EMAIL_USERNAME=edropswebsite@gmail.com  
APP_EMAIL_API_KEY= 
  
APP_PUSHER_API_ID=
APP_PUSHER_API_KEY=
APP_PUSHER_API_SECRET=
APP_PUSHER_API_CLUSTER=

SHOPIFY_DOMAIN=edrops-store.myshopify.com  
SHOPIFY_TOKEN=  
  
Last updated 7/2/2023.  
  
# APP_MYSQL_HOST is the MySQL DB container name  
# https://stackoverflow.com/questions/47979270/django-cannot-connect-mysql-in-docker-compose  
  
The purpose of this README is to ensure the `deploy` and `prod` folders are created.  
