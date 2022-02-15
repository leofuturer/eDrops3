# Edrop-v2.0.0
The 2nd generation of eDrops web application

**Important**: The website name is called eDrops, but the internal name (used in database names, etc.) is Edrop for compatability reasons.

## PROJECT OVERVIEW
### Project purpose
To achieve a functional EWOD cloud manufacturing website by **improving** the modules below to allow for basic foundry service workflow   
(1) User account management  
(2) Mask file management(file upload, download, assign, organized storage)  
(3) Secure order system (secure checkout gateway with Shopify API, order system integration with Shopify order system)

### Project architecture

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
In the Shopify development store, we make use of the webhook to send order data to our server and store the data in our server to generate order information(the orderInfo model in /common/models/orderInfos.js) for order management in the eDrops website  
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

### Steps to run the code on localhost (For the first time)
Download this repository:  
`$ git clone https://github.com/danningyu/Edrop-v2.0.0.git`  
`$ cd Edrop-v2.0.0`  

For development purposes, there are 3 containers to run for the backend:  
- Loopback backend containing the main server logic  
- MySQL container to persist data  
- Ngrok container to act as tunnel for receiving Shopify webhooks  

The frontend is run without a container to enable easy hot-reloading.  

When we deploy, we deploy the backed as a container and the frontend as a static HTML/CSS/JS bundle.  

#### To get the frontend running  
From the home/top level directory:  
`$ cd client`  
`$ npm install`  

Then, to run the client (in development mode):  
`$ npm run dev`  

Navigate to localhost:8086/home to get to the home page of the eDrops application.  

#### To get the backend running 
Open a new terminal window. Build the backend container and download images for MySQL and Ngrok.   
`$ cd server`  
`$ npm install`
`$ docker build -t danningyu/edrop_backend .`  
`$ docker pull mysql:8.0`  
`$ docker pull wernight/ngrok:latest`  

Create the following files in `deploy/dev/` to supply environment variables to the containers. Ask Danning or Qining for a copy of those files, as they contain sensitive information.  
`$ cd deploy/dev/`  
`$ touch backend.env mysql.env ngrok.env`  

Then, go back to the top directory /Edrop-v2.0.0 and initialize the database schema and add seed data:
`$ cd ../..` (go back to the root directory where all the docker-compose files exist)
Windows: `$ $env:RESET_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; $env:RESET_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ RESET_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  

Note: the first time the MySQL container is created, the database needs to be created, so this command will take around 2-3 minutes. Please be patient and wait until you receive the message:
```
...
edrop_backend  | success reset-db success!
edrop_backend  | Done resetting database
edrop_backend exited with code 0
```

Then, press Ctrl + C to exit from trailing the logs and run the follow command to shut down all containers for the development stack:
`$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml down`  

You are now ready to start up the backend (make sure RESET_DATABASE is **not** equal to 'Yes'):  
Windows: `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  

Once you see the following messages, the backend can be accessed:
```
...
edrop_backend  | [ '/usr/local/bin/node', '/usr/src/app/server/server.js' ]
edrop_backend  | Checking if we need to create default admin user
edrop_backend  | Web server listening at: http://localhost:3000
edrop_backend  | Browse your REST API at http://localhost:3000/explorer
edrop_backend  | Creating default admin user!
...
edrop_backend  | Linked to user model.
edrop_backend  | Created principal: { principalType: 'USER', principalId: '1', roleId: 1, id: 1 }
```

Once the backend is running, where to find useful information:
- localhost:3000 shows a status message about the uptime of Loopback
- localhost:3000/explorer shows all API entry points
- localhost:4040 shows the Ngrok tunnel URL and interface (track incoming HTTP/S requests)
- Uploaded files appear in the `server/storage/test_container` folder.  

The commands are long, so we recommend you make aliases.

**Windows Aliases**
In Powershell, run the following to open your Powershell profile file in Notepad
`notepad $PROFILE`
After the file is opened, add the following functions:
```
function Edrop-Docker-Run{
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
}
Set-Alias edroprun Edrop-Docker-Run

function Edrop-Docker-Stop{
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
}
Set-Alias edropstop Edrop-Docker-Stop

function Edrop-Docker-Reset{
	$env:RESET_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; $env:RESET_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
}
Set-Alias edropreset Edrop-Docker-Reset

function Edrop-Docker-Restart{
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart edrop_backend
}
Set-Alias edroprestart Edrop-Docker-Restart
```
This creates three aliases named "edroprun", "edropstop", and "edropreset" that point to the run, stop, and reset commands for the docker backend respectively.

Note you may change the names of these aliases if you would like by modifying the `Set-Alias` line using the format `Set-Alias [alias name] [function name]`.

**Mac/Unix Aliases**

Check what shell you are using by running `echo $0` or `echo $SHELL`.

If the shell is **zsh** (default shell on Mac), edit/create the `.zshrc` file in the home directory using `nano ~/.zshrc`.
If the shell is **bash**, edit/create the `.bash_profile` file in the home directory using `nano ~/.zshrc`.

For either shell, add the following aliases:
```
alias edroprun='docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f'
alias edropstop='docker-compose -f docker-compose.yml -f docker-compose.dev.yml down'
alias edropreset='RESET_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f'
alias edroprestart='docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart edrop_backend'
```

Either restart your terminal or refresh your shell profile using `source ~/.zshrc` or `source ~/.bash_profile` depending on your shell.

**Reference for Docker commands used above**
`docker-compose up -d` starts the containers up in the background 
`docker-compose logs -f` follows the logs they emit, and you can press ^C to exit from trailing the logs
`docker-compose down` stops the server. When running in a development environment, you need containers from both `docker-compose.yml` and `docker-compose.dev.yml`, so we pass in both as arguments to `docker-compose`.  
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart edrop_backend` restarts the backend with your changes (can be used after you edit your backend files)


#### To connect the backend with Shopify
Go to https://wqntest.myshopify.com/admin -> Settings (bottom left) -> Notifications, scroll down to the bottom, and update the webhook URLs for order creation with the URL generated by Ngrok. This URL can be found by navigating to localhost:4040 or viewing the Ngrok container's logs.  If you have the server running at this point, you can send a test notification to confirm that everything works.  

To create a webhook, enter the following settings:  
- Event: Order payment
- Format: JSON
- URL: https://your_ngrok_address_hash.ngrok.io/api/orderInfos/newOrderCreated

To test the checkout feature: In the checkout page: enter `1` for the credit card number, any date in the future for expiry date, and any 3 digit number for the CVV. See [Shopify's docs](https://help.shopify.com/en/partners/dashboard/managing-stores/test-orders-in-dev-stores) for more details.

### Starting Frontend/Backend
Use this workflow after first-time setup instructions above are finished.
Navigate to the Edrop-v2.0.0 repo and run the following commands in order
```
$ cd client
$ npm install 
$ npm run dev 
```

In another terminal window, navigate back to the /Edrop-v2.0.0 directory and run:
`$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`

To test Shopify related functions, follow the instruction above to connect the backend with Shopify

### To run Backend tests  
Start up the backend using the test docker-compose stack instead, with the same procedure of resetting the database first:  
Windows:  
`$ $env:RESET_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d; $env:RESET_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.test.yml logs -f`  
Mac/Unix:  
`$ RESET_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.test.yml logs -f`  

Shut down the Docker stack after database resetting is done:  
`$ docker-compose -f docker-compose.yml -f docker-compose.test.yml down`  

Then, start the Docker stack without resetting the database:  
Windows:  
`$ docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d; docker-compose -f docker-compose.yml -f docker-compose.test.yml logs -f`  
Mac/Unix:  
`$ docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.test.yml logs -f`  

Then, run the tests:  
`$ cd server`  
`$ npm test`  

To rerun the tests, you will need to reset the database:  
Windows:  
`$ docker exec edrop_backend node db/reset-db.js; docker restart edrop_backend`  
Mac/Unix:  
`$ docker exec edrop_backend node db/reset-db.js && docker restart edrop_backend`  

This command runs `reset-db.js` to reset the database, then it restarts the backend so that a new admin user is created automatically (otherwise many API endpoints cannot be tested).  

### Steps to import seed data for development & testing
From the top level directory, initialize the database schema and add seed data. To add or modify seed data, change the json objects in `server/db/seed-data/`. **WARNING: This will delete everything previously in the database!**  
Windows: `$ $env:RESET_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; $env:RESET_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ RESET_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f` 

### Steps to change database models
If you change the models in server/common/models and want to update the database without deleting preexisting data, run the following command. If you are adding a new column to a table, think about what the value will be for preexisting rows in that table.  
Windows: `$ $env:MIGRATE_DATABASE = 'Yes'; docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; $env:MIGRATE_DATABASE = ''; docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f`  
Mac/Unix: `$ MIGRATE_DATABASE=Yes docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d && docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f` 

### Instructions for submitting code changes

Please read this section and follow the instructions before creating a **Pull Request**.

1. If you have any branches based on `master` branch that you want to create a PR, rebase off the `stage` branch and resolve all conflicts.
2. When opening a new PR, be sure to choose the target branch as `stage`, otherwise github workflow will remind you that you shouldn't PR to `master`
3. Make your changes at a granular level. That means, try to have each PR concerned with only one feature/bug fix. Always try to keep the git diff small for the convenience of code reviewers, and refrain from committing unrelated changes (i.e. yarn.lock commit when no packages are added/removed/updated).
4. Make sure your change passes all ESLint rules.
5. After opening a PR, link it to an existing issue if there is one, and request reviews from codeowners and other contributors if necessary.
6. (For code owner) Each week, please pull the `stage` branch and check whether all linked issues are resolved. If yes, review it and merge the `stage` into the `main` branch.

## FAQ/Common Issues
**Q: How to enable built in Loopback debugging?**
A: See [Setting debug strings](https://loopback.io/doc/en/lb3/Setting-debug-strings.html) from the Loopback documentation. For example, to debug ACL issues, set DEBUG=loopback:security:* 

**Q: How to rename database?**  
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

**Q: How to allow Access to Gmail?**
If you are running the app locally for the first time and try to use it to have edropswebsite@gmail.com send an email, Google will block your request. To authorize your computer, go to https://accounts.google.com/b/6/DisplayUnlockCaptcha, replacing the "6" with the # of your Google account if you are logged in to multiple. This link, which isn't published by Google for some reason, will temporarily allow accounts like eDrops backend to log in to your application. This will cause Google to remember the device in the future.

**Issue: Set the environment variables for connecting to the database but it doesn't work (permission denied error):**
A: Make sure you set the environment variables in the same shell window that you run the server in. To verify the value was set correctly, use `$ echo %ENV_VAR_NAME%` for Windows and `$ echo $ENV_VAR_NAME` for Linux/MacOS.  

## Environment Variables
If things aren't working, check that these are correct for your environment. Contact Danning or Qining for sensitive values.

### List of environment variables 
| Environment Variable     | Description                                         | Default Value             |
|--------------------------|-----------------------------------------------------|---------------------------|
| APP\_MYSQL\_HOST         | Hostname for MySQL database                         | "localhost"                |
| APP\_MYSQL\_PORT         | Port number for MySQL database                      | 3306                       |
| APP\_MYSQL\_DATABASE     | Table name for MySQL database                       | "edrop_db"                 |
| APP\_MYSQL\_USERNAME     | Username for MySQL database                         | "edrop"                    |
| APP\_MYSQL\_PASSWORD     | Password for MySQL database                         | "12345678"                 |
| APP\_FRONTEND\_HOSTNAME  | Hostname for front end server                       | "localhost"                |
| APP\_FRONTEND\_PORT      | Port number for front end server                    | 8086                       |
| APP\_EMAIL\_HOST         | Hostname for email server used to send emails       | "smtp\.gmail\.com"         |
| APP\_EMAIL\_PORT         | Port number for email server used to send emails    | 465                        |
| APP\_EMAIL\_USERNAME     | Email address for email account used to send emails | "edropswebsite@gmail\.com" |
| APP\_EMAIL\_PASSWORD     | Password for email account used to send emails      | Contact Danning/Qining     |
| SHOPIFY\_DOMAIN          | Domain for our Shopify website                      | "wqntest.myshopify.com"    |
| SHOPIFY\_TOKEN           | Token for Shopify Storefront API                    | Contact Danning/Qining     |

IP address of our AWS EC2 server: 54.241.15.160.  

### How to set environment variables
The commands below show how to set environment variables for Windows and *nix and give an example where `APP_MYSQL_PASSWORD` is set to `password123`.

To do this in Windows (using Command Prompt):  
`$ set ENV_VAR_NAME=env_var_value`  
`$ set APP_MYSQL_PASSWORD=password123`

To do this in Windows (using Powershell):  
Note the leading dollar sign and single quotes around the value.  
`$ $env:ENV_VAR_NAME = 'VALUE'`  
`$ $env:APP_MYSQL_PASSWORD = 'password123'`

To do so in Linux/MacOS:  
`export ENV_VAR_NAME=env_var_value`  
`export APP_MYSQL_PASSWORD=password123`  

NOTE: Remember that setting environment variables only makes them available in that particular terminal window. If you open new windows, make sure to set them again.  

To set an environment variable for the backend container (such as for debugging Loopback), modify your `backend.env` file in the `deploy/dev/` folder. Then restart the entire docker-compose set of containers (see commands below, `docker-compose stop` and then `docker-compose start`). 

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