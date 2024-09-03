This folder needs to have the following .env files:  
  
`backend.env`  
`mysql.env`  
`ngrok.env`  
  
Below are the contents of each file, with values missing. Contact Leo or Danning for the necessary values.  
  
Contents of `backend.env`:    
NODE_ENV=dev  
  
APP_MYSQL_DATABASE=  
APP_MYSQL_USERNAME=  
APP_MYSQL_PASSWORD=  
APP_MYSQL_HOST=  
APP_MYSQL_PORT=  
  
APP_EMAIL_HOST=smtp.sendgrid.net  
APP_EMAIL_PORT=465  
APP_EMAIL_USERNAME=info@edroplets.org 
APP_EMAIL_API_KEY=  

APP_PUSHER_API_ID=
APP_PUSHER_API_KEY=
APP_PUSHER_API_SECRET=
APP_PUSHER_API_CLUSTER=
  
SHOPIFY_DOMAIN=edrops-store.myshopify.com  
SHOPIFY_TOKEN=  

# APP_MYSQL_HOST is the MySQL DB container name  
# https://stackoverflow.com/questions/47979270/django-cannot-connect-mysql-in-docker-compose  

# Set debug strings as necessary
# https://loopback.io/doc/en/lb4/Setting-debug-strings.html
  
Contents of `mysql.env`:    
MYSQL_ROOT_PASSWORD=  
MYSQL_DATABASE=  
MYSQL_USER=  
MYSQL_PASSWORD=  

# https://hub.docker.com/_/mysql
  
Contents of `ngrok.env`:    
NGROK_AUTHTOKEN=  

The purpose of this README is to ensure the `deploy` and `dev` folders are created.  
