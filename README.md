# Edrop-v2.0.0
The 2nd generation of Edrop web application

## PROJECT OVERVIEW
### Project purpose
To achieve a functional EWOD cloud manufacturing website by **improving** the modules below to allow for basic foundry service workflow   
(1) User account management  
(2) Mask file management(file upload, download, assign, organized storage)  
(3) Secure order system (secure checkout gateway with Shopify API, order system integration with Shopify order system)

### Details to be improved
To see current issues/bugs, navigate to the "Issues" tab on Github.  
**Frontend**
- [ ] [code quality improvement] Reorganize all the CSS rules——ensure match each page file with one CSS file and avoid using CSS rules from unmatched CSS files (right now we use CSS rules somewhere from matched files in order to reuse some rules which leads to the coupling of layout features of different web pages)
- [ ] [code quality improvement] Optimize React.js code by reducing unnecessary "state"s

**Backend**
- [ ] Optimize the backend project file structure

**Workflow Improvement**

### Project architecture
A picture to discribe the whole project architecture
<img src="" >

**Frontend**  
(1) dependency management webpack (pack up the file and output the static files, we can understand it as a tool to convert all our js file to html, css, js file like those for a conventional static website)  

(2) source code (in the /src directory)  
* /api  
API request to server: axios (a javascript package) & fetch() (conventional way is AJAX but is not popular any more)
* /component  
Some components shared by different pages, like: navigation bar, footer, layout(React-Router)
* / page  
pages as well as corresponding .CSS files
* /router  
routing: React-router  
The entry of whole routing system is defined in the App.js right now which needs to be improved (see a pdf called "Router system" in the ucla box)  

(3) Integration with Shopify  
In the App.js we use Shopify js-buy SDK to implement the checkout and payment functionalities  
In the /src/pages/shop/cart.js we make use of the checkout URL provided by js-buy SDK for the checkout process and order creation  
In the Shopify development store, we make use of the webhook to send order data to our server and store the data in our server to generate order information(the orderInfo model in /common/models/orderInfos.js) for order management in the Edrop website  
Shopify Website: https://wqntest.myshopify.com/admin  

**Backend**
* /common  
Data models of the application is defined here  
Most of data operation is implemented here using **Loopback hooks & remote method**
* /db  
Some code to initiate the database automatially (build schemas and import seed data in MySQL database)
* /server  
Common file structure of Loopback

## SETUP
Prerequisites:
- Node version 14.15 or higher
- NPM version 6.14 or higher
- Docker version 18.06 or higher
- An Ngrok account (sign up at ngrok.com)

### Steps to run the code on localhost  
Download this repository:  
`$ git clone https://github.com/danningyu/Edrop-v2.0.0.git`  
`$ cd Edrop-v2.0.0`  

For development purposes, there are 3 containers to run for the backend:  
- Loopback backend containing the main server logic  
- MySQL container to persist data  
- Ngrok container to act as tunnel for receiving Shopify webhooks  

The frontend is run without a container to enable easy hot-reloading.  

When we deploy, we deploy the backed as a container and the frontend as a static HTML/CSS/JS bundle.  

**To get the frontend running:**  
From the home/top level directory:  
`$ cd client`  
`$ npm install`  

Then, to run the client (in development mode):  
`$ npm run dev`  

Navigate to localhost:8086/home to get to the home page of the Edrop application.  

**To get the backend running:**  
Open a new terminal window. Build the backend container and download images for MySQL and Ngrok.   
`$ cd server`  
`$ docker build -t danningyu/edrop_backend .`  
`$ docker pull mysql:8.0`  
`$ docker pull wernight/ngrok:latest`  

Create the following files in `deploy/dev/` to supply environment variables to the containers. Ask Danning or Qining for a copy of those files, as they contain sensitive information.  
`$ cd deploy/dev/`  
`$ touch backend.dev mysql.dev ngrok.dev`  

Then, initialize the database schema and add seed data. Note: the first time the MySQL container is created, the `edrop_db` database needs to be created, so this command will take around 2-3 minutes. Please be patient and wait until you receive a message indicating that the user `edrop` and database `edrop_db` has been created.  

Windows: `$ $env:RESET_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; $env:RESET_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ RESET_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  

The commands are long, so we recommend you make aliases.

You are now ready to start up the backend (make sure RESET_DATABASE is **not** equal to 'Yes'):  
Windows: `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  

Once you see the following messages, the backend can be accessed:
```
...
edrop_backend    | Checking if we need to create default admin user
edrop_backend    | Web server listening at: http://localhost:3000
edrop_backend    | Browse your REST API at http://localhost:3000/explorer
```

For reference, `docker-compose up -d` starts the containers up in the background. `docker-compose logs -f` follows the logs they emit, and you can press ^C to exit from trailing the logs. Use `docker-compose down` to stop the server. When running in a development environment, you need containers from both `docker-compose.yml` and `docker-compose.dev.yml`, so we pass in both as arguments to `docker-compose`.  

You can edit backend files normally and then use the following command to restart the backend with your changes:
`$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart edrop_backend`

Once the backend is running, where to find useful information:
- localhost:3000 shows a status message about the uptime of Loopback
- localhost:3000/explorer shows all API entry points
- localhost:4040 shows the Ngrok tunnel URL and interface (track incoming HTTP/S requests)
- Uploaded files appear in the `server/storage/test_container` folder.  

**To Use Shopify**
To place orders via our test store, enter `1` for the credit card number, any date in the future for expiry date, and any 3 digit number for the CVV. See [Shopify's docs](https://help.shopify.com/en/partners/dashboard/managing-stores/test-orders-in-dev-stores) for more details.

Go to https://wqntest.myshopify.com/admin -> Settings (bottom left) -> Notifications, scroll down to the bottom, and update the webhook URLs for order creation with the URL generated by Ngrok. This URL can be found by navigating to localhost:4040 or viewing the Ngrok container's logs.  If you have the server running at this point, you can send a test notification to confirm that everything works.  

To create a webhook, enter the following settings:  
- Event: Order payment
- Format: JSON
- URL: https://your_ngrok_address_hash.ngrok.io/api/orderInfos/newOrderCreated

### Steps to import seed data for development & testing
From the top level directory, initialize the database schema and add seed data. To add or modify seed data, change the json objects in `server/db/seed-data/`. **WARNING: This will delete everything previously in the database!**  
Windows: `$ $env:RESET_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; $env:RESET_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ RESET_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f` 

### Steps to change database models
If you change the models in server/common/models and want to update the database without deleting preexisting data, run the following command. If you are adding a new column to a table, think about what the value will be for preexisting rows in that table.  
Windows: `$ $env:MIGRATE_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; $env:MIGRATE_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ MIGRATE_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f` 

### FAQ/Common Issues
Q: How to enable built in Loopback debugging?  
A: See [Setting debug strings](https://loopback.io/doc/en/lb3/Setting-debug-strings.html) from the Loopback documentation.  

Q: Set the environment variables for connecting to the database but it doesn't work (permission denied error):  
A: Make sure you set the environment variables in the same shell window that you run the server in. To verify the value was set correctly, use `$ echo %ENV_VAR_NAME%` for Windows and `$ echo $ENV_VAR_NAME` for Linux/MacOS.  

### List of Environment Variables
If things aren't working, check that these are correct for your environment. Contact Danning or Qining for sensitive values.

| Environment Variable     | Description                                         | Default Value             |
|--------------------------|-----------------------------------------------------|---------------------------|
| APP\_MYSQL\_HOST         | Hostname for MySQL database                         | "localhost"               |
| APP\_MYSQL\_PORT         | Port number for MySQL database                      | 3306                      |
| APP\_MYSQL\_DATABASE     | Table name for MySQL database                       | "edrop_db"                |
| APP\_MYSQL\_USERNAME     | Username for MySQL database                         | "edrop"                   |
| APP\_MYSQL\_PASSWORD     | Password for MySQL database                         | "12345678"                |
| APP\_FRONTEND\_HOSTNAME  | Hostname for front end server                       | "localhost"               |
| APP\_FRONTEND\_PORT      | Port number for front end server                    | 8086                      |
| APP\_EMAIL\_HOST         | Hostname for email server used to send emails       | "smtp\.gmail\.com"        |
| APP\_EMAIL\_PORT         | Port number for email server used to send emails    | 465                       |
| APP\_EMAIL\_USERNAME     | Email address for email account used to send emails | "edropwebsite@gmail\.com" |
| APP\_EMAIL\_PASSWORD     | Password for email account used to send emails      | Contact Danning/Qining    |
| SHOPIFY\_DOMAIN          | Domain for our Shopify website                      | "wqntest.myshopify.com"   |
| SHOPIFY\_TOKEN           | Token for Shopify Storefront API                    | Contact Danning/Qining    |

IP address of our AWS EC2 server: 54.241.15.160.  

### How to set environment variables
The commands below show how to set environment variables for Windows and *nix and give an example where `APP_MYSQL_PASSWORD` is set to `password123`.

To do this in Windows (using Command Prompt):  
`$ set ENV_VAR_NAME=env_var_value`  
`$ set APP_MYSQL_PASSWORD=password123`

To do this in Windows (using Powershell):  
Note the leading dollar sign single quotes around the value.  
`$ $env:ENV_VAR_NAME = 'VALUE'`  
`$ $env:APP_MYSQL_PASSWORD = 'password123'`

To do so in Linux/MacOS:  
`export ENV_VAR_NAME=env_var_value`  
`export APP_MYSQL_PASSWORD=password123`  

NOTE: Remember that setting environment variables only makes them available in that particular terminal window. If you open new windows, make sure to set them again.  

To set an environment variable for the backend (such as for debugging Loopback), modify your `backend.env` file in the `deploy/dev/` folder. Then restart the edrop_backend container (see above for the command to do this).  

## Useful Commands  
SSH into EC2:  
`ssh ubuntu@edrops.org`  

The server uses public-private key authentication, so ask Danning or Qining to get your public key added to the server.  

Build backend image:  
`docker build -t danningyu/edrop_backend .`  

### Dev Environment  
I recommend defining aliases for these.  

Shut down backend:  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml down`  

Start up all backend containers (add `-d` for detached/background mode):  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`  

View backend logs for all containers (add `-f` to follow them):  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml`  

View backend logs for a container (`-f` option available):  
`docker logs container_name`  

Restart a container (often the backend):  
`docker restart container_name`  

Open a terminal window in the backend container:  
`docker exec -it edrop_backend bash` (method 1)  
`docker-compose exec edrop_backend bash` (method 2)  

Access the MySQL database directly to perform queries, etc.:  
`docker exec -it edrop_mysqldb mysql -u edrop -p`  

### Prod Environment  
Note: if you try to execute these on your local machine you may run into errors. These comands are designed to be run on the AWS EC2 instance.  
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml down`  
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`  
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f`  

To connect to the MySQL database running on RDS:  
`mysql -h mysql_host -u mysql_username -p`  

`mysql_host` and `mysql_username` can be found as the environment variables APP_MYSQL_HOST and APP_MYSQL_USERNAME in the production server under `/deploy/prod/backend.env` file. The database password can be found in the same folder.  

## To rename database  
If you are using MySQL 8.0 with InnoDB, do the following:  
- Exec into the MySQL database using the `mysql` command line utility  
- Run `CREATE DATABASE new_db_name;`  
- (Optional, to create new user) `CREATE USER 'edrop_db_user'@'%' IDENTIFIED BY 'password_goes_here';`  
- (Optional, to grant user privileges) `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO 'edrop_db_user'@'%' WITH GRANT OPTION;`  
- (Bash script to rename tables): `mysql -u dbUsername -p"dbPassword" old_db_name -Ne 'SHOW TABLES' | while read table; do mysql -u dbUsername -p"dbPassword" -Ne "RENAME TABLE old_db_name.$table TO new_db_name.$table"; done`  
- For the above command, I recommend executing everything before the pipe first to see all the tables that will be affected  

This uses the fact that we can "transfer" a table from one database to another with the following command:  
`RENAME TABLE old_db_name.table_name TO new_db_name.table_name;`  

Source: https://chartio.com/resources/tutorials/how-to-rename-a-database-in-mysql/  
