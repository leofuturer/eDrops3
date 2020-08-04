# Edrop-v2.0.0
The 2nd generation of Edrop web application

## PROJECT OVERVIEW
### Project purpose
To achieve a functional EWOD cloud manufacturing website by **improving** the modules below to allow for basic foundry service workflow   
(1) User account management  
(2) Mask file management(file upload, download, assign, organized storage)  
(3) Secure order system (secure checkout gateway with Shopify API, order system integration with Shopify order system)

### Details to be improved
**Frontend**
- [x] PDF preview in the shopping page of uploaded document.
- [x] Notification of "username or email exists/already taken" in the account sign up page
- [ ] Error handling——provide error reporting pages for all the errors (right now we just ignore them as long as the page doesn't collapse which means errors only show up in the system log console) or some other way to handle them (requires more investigation)
- [ ] Foundry work edits order status - apply bootstrap dropdown module to replace the current native HTML form component
- [ ] Just display part of the username (top right corner) & time stamp (in the order list page) if they are too long in case the layout of the page is messed up
- [ ] Fix the page refreshing issue of the order detail window (because right now we are using window._variable which becomes undefined whe we refresh the page)
- [ ] Replace the order assignment process with the automatical assignment based on the material customer chooses
- [ ] Implement the order detail sub window with bootstrap Modal or other more delicated component instead of a new page(what we are using right now) 
- [ ] [code quality improvement] Reorganize all the CSS rules——ensure match each page file with one CSS file and avoid using CSS rules from unmatched CSS files (right now we use CSS rules somewhere from matched files in order to reuse some rules which leads to the coupling of layout features of different web pages)
- [x] Upload Mask File link should direct unlogged user to the login page
- [x] [code quality improvement] Decouple the routing functionalities from the App component() —— Maybe use RouteMap
- [ ] [code quality improvement] Optimize React.js code by reducing unnecessary "state"s
- [ ] Create "under construction" page so that users know a broken link isn't actually broken and that simply we're still adding the feature.
- [ ] Add cart page? (currently the cart icon at the top toolbar doesn't work)
- [x] For the file & order list pages, when there's no file or order, a message should show up to remind user that they have not uploaded/placed any files/order yet, instead of just showing an empty table 

**Backend**
- [ ] Optimize the backend project file structure
- [x] Enable the email login functionality and make sure the username shows up whatever login information we use. Right now we can only use username to login
- [ ] Improve data security——apply authorization(supported by Loopback) to prevent unknown user retrieving data via our APIs
- [ ] Add the specific time to the time stamp and display it in the frontend(right now there's only date showing up)
- [ ] Integrate the user address information with address information from shopify as well as the billing address in the checkout page
- [x] Email activation link to user after registration, the account is available only after the user clicks the activation link

**Workflow Improvement**
- [ ] Create automated testing to be done on every push to the repository.
- [ ] Set up environment variables to replace some credentials in the code, e.g. datasource.json, shopify keys in the app.jsx, etc.
- [x] Research on best practice for github collabration & establish an optimal workflow (record in the doc)

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
### Steps to run the code on localhost
To get it running:  
`$ git clone https://github.com/danningyu/Edrop-v2.0.0.git`  
`$ cd Edrop-v2.0.0`  

**To get the server running:**  
`$ cd server`  
`$ npm install`  

At this point, make sure that you have a mySQL server running and have created an empty database. Then, set the following environment variables if any of their values differ from what is given in `Edrop-v2.0.0/server/server/datasources.local.js`:  

    APP_MYSQL_DATABASE  
    APP_MYSQL_HOST  
    APP_MYSQL_PORT  
    APP_MYSQL_USERNAME  
    APP_MYSQL_PASSWORD  

Scroll down to the bottom of this document for a listing of all the environment variables used in this project.  

To do this in Windows (using Command Prompt):  
`$ set ENV_VAR_NAME=env_var_value`  
`$ set APP_MYSQL_PASSWORD=password123 #sample: set APP_MYSQL_PASSWORD to password123`  

To do so in Linux/MacOS:  
`export ENV_VAR_NAME=env_var_value`  
`export APP_MYSQL_PASSWORD=password123 #sample: set APP_MYSQL_PASSWORD to password123`  

Note: Setting it in Windows makes those environment variables only available in that command prompt session. If you wish to have the variables persist and usable across multiple sessions, use the `setx` command instead of `set`. However, `setx` has a 1024 character limit, so be careful.

Note: Setting it in Linux/MacOS makes these environment variables only available in that user session. If you wish to have the variables persist across multiple logins sessions, include it in the appropriate profile file for your *nix distribution and shell (such as `~/.bash_profile`, `~/.bash_login`, etc.).

Then, initialize the database schema and add seed data. WARNING: This will delete everything previously in the database!  
`$ node ./db/reset-db.js`  

Then, start the server:  
`$ node .`  

Navigate to localhost:3000 and you should see a status message.  
Navigate to localhost:3000/explorer and you should see API entry points.

**To get the client running:**  
Open up a new command window. Navigate back to the home/top level directory. Then:  
    `$ cd client`  
    `$ npm install`  

If there is an error about python2 not being found:  
`$ rm -rf node_modules #delete the node_modules folder client`  
`$ npm install --global windows-build-tools`  
`$ npm install`  

Note: This is due to a python2 dependency that NodeJS has. See [this
StackOverflow question](https://stackoverflow.com/questions/45801457/node-js-python-not-found-exception-due-to-node-sass-and-node-gyp). It also prepends something along the lines of `C:\Users\<username>\.windows-build-tools\python27;` to your PATH environment variable, so make sure to delete that from your PATH so that it doesn't conflict with other Python installations.

Then, run the client (in development mode):  
`$ npm run dev`

Navigate to localhost:8086/home to get to the home page of the Edrop application. (Note: the server should also be running at this point)  

### Steps to import seed data for development & testing
From the top level directory, initialize the database schema and add seed data. To add or modify seed data, change the json objects in `server/db/seed-data/`. WARNING: This will delete everything previously in the database!  
`$ node ./server/db/reset-db.js`  

### Steps to change database models
If you change the models in server/common/models and want to update the database without deleting preexisting data, run the following command. If you are adding a new column to a table, think about what the value will be for preexisting rows in that table.  
`$ node ./server/db/migrate-db.js`  

### FAQ/Common Issues
Q: Set the environment variables for connecting to the database but it doesn't work (permission denied error):
A: Make sure you set the environment variables in the same shell window that you run the server in. To verify the value was set correctly, use `$ echo %ENV_VAR_NAME%` for Windows and `$ echo $ENV_VAR_NAME` for Linux/MacOS.

Q: Cannot connect to the mySQL database?
A: Make sure you have it running (on Windows, in the System Tray, right click on the mySQL notifier, and check if the server is running).

### List of Environment Variables
If things aren't working, check that these are correct for your environment.

| Environment Variable    | Description                                         | Default Value              |
|-------------------------|-----------------------------------------------------|----------------------------|
| APP\_MYSQL\_HOST        | Hostname for MySQL database                         | "localhost"                |
| APP\_MYSQL\_PORT        | Port number for MySQL database                      | 3306                       |
| APP\_MYSQL\_USERNAME    | Username for MySQL database                         | "root"                     |
| APP\_MYSQL\_PASSWORD    | Password for MySQL database                         | "12345678"                 |
| APP\_FRONTEND\_HOSTNAME | Hostname for front end server                       | "localhost"                |
| APP\_FRONTEND\_PORT     | Port number for front end server                    | 8086                       |
| APP\_EMAIL\_HOST        | Hostname for email server used to send emails       | "smtp\.gmail\.com"         |
| APP\_EMAIL\_PORT        | Port number for email server used to send emails    | 465                        |
| APP\_EMAIL\_USERNAME    | Email address for email account used to send emails | "edropwebsite@gmail\.com"  |
| APP\_EMAIL\_PASSWORD    | Password for email account used to send emails      | "cjmemsEdrop"              |

## ISSUES
- [ ] Assign file functions are all useless, need to be deleted and make sure no other functionalities are affected
