# Changelog for Edrop website

Danning Yu, 14 April 2020
 
#### client/src/page/register/index.jsx 

* Added feature that checks if email is already taken when signing up for a new account
* Refactored code for above feature to use chained .then() statements.
* Refactored code, moving the constraints to their own file, ./formConstraints.js
* Fixed typos.
* Made first name, last name, and user type fields required to bring it into alignment with the database schema
* Added simple validation for phone number field to forbid letters as part of phone numbers except x (for phone extensions)

#### client/src/page/register/formConstraints.js

* New file, relocated constraints from ./index.jsx to here

#### client/src/page/login/index.jsx
* Fixed typos

#### Changelog.md

* New file containing detailed changes

#### README.md

* Checked off PDF preview and duplicate email/username feature
