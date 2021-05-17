# Thoughts on Security

Below is a list of various web security vulnerabilities and how eDrops may or may not be vulnerable to them.

Vulnerabilities taken from:
- https://owasp.org/www-project-top-ten/
- https://owasp.org/www-community/vulnerabilities/

## A1:2017-Injection
> Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query. The attacker’s hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.

We use an ORM provided by Loopback to access our database, so SQL injection risk is minimal. We parse incoming JSON, but I do not know of vulnerabilites having to do with JSON parsers.

## A2:2017-Broken Authentication
> Application functions related to authentication and session management are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users’ identities temporarily or permanently.

We use Loopback's authentication frameworks, so it hashes the passwords before storing them in the database. We enforce minimum password requirements on the server side for new customer accounts, but currently do not for foundry worker and admin accounts. eDrops does not have MFA implemented. We use session tokens for when users log in, with an expiration time of 15 minutes. There are no password rotation policies or rate limiting for failed login attempts. In the future, we should offer 3rd party logins (such as through Google) and implement MFA as well to increase account security.

## A3:2017-Sensitive Data Exposure
> Many web applications and APIs do not properly protect sensitive data, such as financial, healthcare, and PII. Attackers may steal or modify such weakly protected data to conduct credit card fraud, identity theft, or other crimes. Sensitive data may be compromised without extra protection, such as encryption at rest or in transit, and requires special precautions when exchanged with the browser.

The website uses HTTPS, with a minimum TLS version of 1.2. The data in the RDS database and EC2 volume is not encrypted, but the passwords within the database are hashed. The EC2 server is only accessible via public-private key login and the RDS database is only accessible from the EC2 server with a password.

The only information available in queries string is usually product IDs (publicly accessible) or user IDs, which are not extremely useful if leaked to the public. However, we should still try to find a way to minimize the amount of query string links that are used, unless they are absolutely needed as "deep links."

## A4:2017-XML External Entities (XXE)
Not applicable, as we do not use XML.

## A5:2017-Broken Access Control
> Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and/or data, such as access other users’ accounts, view sensitive files, modify other users’ data, change access rights, etc.

Insecure direct object references (IDOR) also falls under this issue.

The tables in the database are: customer, foundryWorker, admin, customerAddress, orderInfo, orderChip, orderProduct, and fileInfo. Each resource is owned by a particular user and only that user, plus possibly foundry worker and admin, can see it. We use Loopback's [authorization framework](https://loopback.io/doc/en/lb3/Authentication-authorization-and-permissions.html) to quickly configure access rules for API endpoints. API endpoints can be turned on or off in `server/server/model-config.json`, and then each `server/common/models/*.json` file contains an `acls` section that allows us to control who is able to access each endpoint. Finally, for API endpoints or cases where Loopbacks's authorization model is not powerful enough (such as for orders and chip orders), we use before remote and after remote methods to perform authorization checks before returning a response. See `server/server/hooks/checkOrderOwnership.js` for an example, `which is used in server/common/models/orderInfo.js`, as well as `server/common/models/orderProduct.js`, where all incoming requests pass through a before remote hook.

Work has begun on automated API tests that will also check that authorization is correct and run these tests on every push. 

This is probably the most vulnerable aspect of the website due to the complexity of our model, which creates a large attack surface. A careful audit needs to be taken sometime in the future to check that various user accounts (and various types of accounts) can only access what they should be allowed to access, and nothing more. 

## A6:2017-Security Misconfiguration
> Security misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information. Not only must all operating systems, frameworks, libraries, and applications be securely configured, but they must be patched/upgraded in a timely fashion.

We use Caddy to act as a our reverse proxy to the open world, so there should not be an issues with HTTPS. There might be verbose error message issues since we often use `cb(err)` when the backend runs into an error. An error handling middleware would be helpful to have, which strips out error messages. Loopback [provides one](https://loopback.io/doc/en/lb3/Using-strong-error-handler.html) that we should look into.

Since eDrops is deployed on AWS, configuration of cloud resources is also a potential issue.  
- The EC2 server can be accessed through an SSH pub/priv key pair. Currently, the authorized keys are Danning's, Kaushik's, and the AWS EC2 key generated at EC2 creation, which is used by Github Actions. The key used by Github Actions is stored in Github Secrets, so only Github Actions can access it. 
- The EC2 server is part of the edrop-v2-secgroup (id: sg-065f3b6a2458d4eb0), which allows for inbound traffic from any source (0.0.0.0) on ports 22 (SSH), 80 (HTTP), and 443 (HTTPS). All outbound traffic is allowed
- The RDS server is part of the edrop-v2-rds-secgroup (id: sg-01184b1598bc9a004), which allows for inbound traffic only from edrop-v2-secgroup on port 3306 and no outbound traffic. This means that only the EC2 server can access the RDS database. The RDS database username and password is stored on the EC2 server.
- The S3 bucket has all public access blocked. The only way to access it is through the edrop_github IAM role (ARN: arn:aws:iam::942899419836:user/edrop_github), which has upload, retrieve, and delete permissions for objects inside the S3 bucket. The Loopback process inside the EC2 server uses these credentials to deal with user files. This IAM role's access credentials are available in Github Actions and as environment variables inside the EC2 server. This IAM role is part of the edrop_cicd users group, which has no additional permissions.
- Danning and Kaushik have individual IAM roles that can be used to manage the EC2, RDS, and S3 resources. 

For a detailed list of AWS resources, please Danning's 01-28-2021 (MM-DD-YYYY) group meeting presentation.

## A7:2017-Cross-Site Scripting XSS
> XSS flaws occur whenever an application includes untrusted data in a new web page without proper validation or escaping, or updates an existing web page with user-supplied data using a browser API that can create HTML or JavaScript. XSS allows attackers to execute scripts in the victim’s browser which can hijack user sessions, deface web sites, or redirect the user to malicious sites.

We use React for the frontend, which renders all API input as text instead of directly into HTML. The only place where `dangerouslySetInnerHTML` is called is when we fetch information from our Shopify store. We control the information in the Shopify store, so this minimizes the risk. Theoretically, an attacker could change the API call site to something else, so this is a possible vulnerability.

(We set innerHTML to gain the benefits of the HTML formatting that Shopify provides. We should explore alternatives for this, perhaps using the [white-space CSS style](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space))

## A8:2017-Insecure Deserialization
> Insecure deserialization often leads to remote code execution. Even if deserialization flaws do not result in remote code execution, they can be used to perform attacks, including replay attacks, injection attacks, and privilege escalation attacks.

The only data we serialize/deserialize is JSON data, and all JSON data is checked for validity by comparing the client information with database information before performing the API request. Thus, I do not see many vulnerabilities in this area.

## A9:2017-Using Components with Known Vulnerabilities
> Components, such as libraries, frameworks, and other software modules, run with the same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover. Applications and APIs using components with known vulnerabilities may undermine application defenses and enable various attacks and impacts.

This is an issue for our website, as we use Loopback 3, which has already reached [end of life](https://loopback.io/doc/en/contrib/Long-term-support.html) in December 2020. We should upgrade to Loopback 4 when possible to avoid security vulnerabilities that are discovered in LB3. Various other NPM packages that we use most likely also have vulnerabilities, as LB3 limits the versions of other packages that we can use.

For the frontend, we are currently on React v16.8.0. React v17 has already been released, and the highest version of React v16 is v16.14. The version of React most likely limits the versions of other packages as well.

## A10:2017-Insufficient Logging & Monitoring
> Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems, maintain persistence, pivot to more systems, and tamper, extract, or destroy data. Most breach studies show time to detect a breach is over 200 days, typically detected by external parties rather than internal processes or monitoring.

This is currently an issue. Caddy will log all incoming requests, but only logs them to Docker instead of to a concrete file, so it is not easy to inspect them later. The backend will log failed login attempts and other errors, but only a stack trace of the error and not much else. We need to work on improving logging throughout the backend, as well as set up loggging sinks, nightly log rotation, and automatically exporting the logs to somewhere else (such as an S3 bucket).

We also do not have monitoring set up for if security incidents happen. Also, more generally, there are no alerts set up for if the website goes down or a particular API endpoint returns a lot of errors.

## Unrestricted File Upload
> Uploaded files represent a significant risk to applications. The first step in many attacks is to get some code to the system to be attacked. Then the attack only needs to find a way to get the code executed. Using a file upload helps the attacker accomplish the first step.

We currently restrict file uploads to 10 MB and DXF files only on the client side, but there is no server-side check for this. A server-side check should be performed as the first action that occurs when a file upload is initiated. 

## TODO: Potential other security vulnerabilities
Go through the ones from [this OWASP list](https://owasp.org/www-community/vulnerabilities/).
