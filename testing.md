# Testing Checklist

Below is a list of things to test once the server has started. They are divided into a couple of workflows.

## New User Workflow
1. Register for an account
    - Go to the register page and create a new account. After successfully signing up, an email confirmation email to be sent. 
    - Try to log in - it should fail because the email has not been verified yet. 
    - Clicking the link in that email should bring the user to a page confirming that they have successfully confirmed their email.
    - Try to log in again - it should work now.

## Customer Workflow
1. Logging in
    - Go to the login page and customer should be able to log in

2. Forgot password (not logged in)
    - Go to the login page, click "forgot password"
    - User should emailed a password reset link
    - Reset the password
    - Attempt to log in with old password: should not work
    - Attempt to log in with new password: should work

3. Home page (not logged in)
    - Ensure all images load
    - Ensure footer content is correct
    - Check "UPLOAD MASK FILE" page goes to login page (w/o logging in)
    - VIEW DETAILS of EWOD control system goes to EWOD control system page, which correctly lodas
    - Clicking "Products" goes to the products page, where everything correctly loads
    - Clicking the featured products in the bottom right corner brings up the correct page

4. Products page (not logged in)
    - Clicking "Products" at the header brings you to the products page with 3 products
    - Clicking "Details" for any product correctly brings up the product page
    - Clicking "<< Return to all products" brings you back to the original page
    - Clicking "Add to cart" results in an alert saying login is required
    - Universal glass-based EWOD chip has a "with cover plate assembled" option
    - Reducing quantity below 1 results in an alert saying this is not allowed

5. Logged in
    - Click username and then "Your Dashboard"

6. Address book
    - Click "Address Book"
    - Add a new address
    - Edit current address

7. Profile
    - Edit profile, save it, make sure changes are saved

8. Password
    - Edit password, log out, make sure you can still log in

9. Orders
    - Ensure all previously placed orders are visible
    - Click the view order details button to view more details

10. Files
    - Ensure all previously uploaded files are visible
    - Click "Download" to make sure file can be downloaded
    - Click "Foundry Service" and check it goes to the foundry service page with the correct file selected
    - Click "Delete" and ensure the file is deleted

11. Chip Fab Orders
    - Ensure previous chip fab orders are visible
    - Click "Mask File" to see if it can be downloaded

12. Upload file:
    - Click the file upload icon at the top
    - Try to upload a non-DXF file - an error message should appear
    - Try to upload a large file (> 10 MB) - an error message should appear
    - Upload a DXF file - it should be successful
    - Click "Proceed to Fabrication" - should bring you to chip fabrication page
    - Repeat above steps but click "File Library" - should bring you to file library page

13. Place custom chip order
    - From uploaded files page in user dashboard, click "Foundry Service" icon
    - Toggle between the different chip types and with or without cover plate
    - Add varying quantities of item to cart
    - Try to reduce quantity to below 0 (shouldn't work)
    - Repeat above steps but enter chip order page from upload file page

14. Place product order
    - Go to products page and add quantities of various products - no errors should appear

15. Cart page
    - Click on cart icon at top navigation bar or cart icon on dashboard - cart page should appear
    - Edit item quantities - this should occur after clicking "Save"
    - Delete items - they should disappear from the page

16. Checkout
    - From the cart page, click "Checkout"
    - Should be brought to select address page
    - Select an adddress, should be brought to Shopify store
    - Go back, and add a new address instead, should be added to available addresses
    - In Shopify store, enter fake billing info (credit card # = 1, expiration date = any date in future, CVV = 111)
    - Place order
    - Return to website and check "orders" section of dashboard - the order should appear there
    - Should be able to view details of that order

## Foundry Worker Workflow
1. Logging in
    - Go to the login page and customer should be able to log in

2. Forgot password (not logged in)
    - Go to the login page, click "forgot password"
    - User should emailed a password reset link
    - Reset the password
    - Attempt to log in with old password: should not work
    - Attempt to log in with new password: should work

3. Profile
    - Edit profile, save it, make sure changes are saved

4. Password
    - Edit password, log out, make sure you can still log in

5. Chip fab orders
    - Ensure all orders assigned to this worker are visible
    - Ensure the status of the chip order can be edited
    - Ensure the mask file can be downloaded

## Admin Workflow
1. Logging in
    - Go to the login page and customer should be able to log in

2. Forgot password (not logged in)
    - Go to the login page, click "forgot password"
    - User should emailed a password reset link
    - Reset the password
    - Attempt to log in with old password: should not work
    - Attempt to log in with new password: should work

3. Profile
    - Edit profile, save it, make sure changes are saved

4. Password
    - Edit password, log out, make sure you can still log in

5. Foundry workers
    - Add new foundry worker, ensure he/she can still log in
    - View chip orders for a particular foundry worker
    - Able to edit a foundry worker's profile
    - Able to delete a foundry worker

6. Users (customers)
    - Add new user, ensure he/she can log in (email verification should not be needed)
    - View files for a particular customer
    - View orders for a particular customer
    - Edit a customer's information
    - Delete a user

7. Admins
    - Add a new admin
    - Edit other admins
    - Delete other admins (but not allowed to delete yourself)

8. Orders
    - Be able to view all orders
    - Click on "order details" to view order details

9. Files
    - Be able to view all files
    - Be able to download files
    - Be able to view deletion status of file

10. Chip fab orders
    - Be able to view all custom chip orders and associated information
    - Be able to download maskfile
    - Be able to update status
    - Be able to assign order to worker - follow the pop-up
