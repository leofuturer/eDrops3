# Troubleshooting MySQL

Having issues connecting to MySQL? The following information may be helpful:  

## Type mismatch: expected type string, but got int  

https://bugs.mysql.com/bug.php?id=82843

Your connection attempt failed for user '<username>' from your host to server at foo.bar.com:3306:
Type mismatch: expected type string, but got int  

...Then I came back from lunch, fired up MySQL Workbench again and lo and behold: the same frikkin' error. Digging deeper this time I finally went to the 'Advanced' tab of the connection and cleared the 'Others' text field and the problem was gone!? Taking another look at what I had just removed I noticed the "LastDefaultSchema=20160901" part... (http://i.imgur.com/CNi3bCM.png) Hmmm, that was the database I created yesterday and since then I'd been experiencing trouble. "Type mismatch: expected type string, but got int"... No, wait... That can't be! Seriously? I put quotes around the 20160901 part and, sure enough, the problem went away.  

------------------------------------------------------------
## MySQL Client does not support authentication protocol
https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server

Execute the following query in MYSQL Workbench

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

Where root as your user localhost as your URL and password as your password

Then run this query to refresh privileges:

flush privileges;

Try connecting using node after you do so.

If that doesn't work, try it without @'localhost' part.