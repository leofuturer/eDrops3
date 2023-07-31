# Controllers

This directory contains source files for the controllers exported by this app.

To add a new empty controller, type in `lb4 controller [<name>]` from the
command-line of your application's root directory.

For more information, please visit
[Controller generator](http://loopback.io/doc/en/lb4/Controller-generator.html).

Config endpoints not in server [
  '/customers/login', -> user.login()
  '/customers/logout', -> user.logout()
  '/customers/{id}?filter={"fields":["firstName","lastName"]}', => /customers/{id} -> customer.getName()
  '/customers/resendVerifyEmail', => /user/send-email-verification -> user.sendEmailVerification()
  '/admins/login', // redundant -> user.login()
  '/admins/logout', // redundant -> user.logout()
  '/foundryWorkers/login', // redundant -> user.login()
  '/foundryWorkers/logout', // redundant -> user.logout()
  '/foundryWorkers/{id}?filter={"fields":["firstName","lastName"]}', => /foundryWorkers/{id} -> foundryWorker.getName()
  '/foundryWorkers/{id}/workerOrders' => /foundryWorkers/{id}/orders -> foundryWorker.getOrders()
]
Server endpoints not in config [
  '/customers/{id}/Addresses/{AddressId}', => /customers/{id}/addresses/{addressId}  -> customer.getAddress()
  'undefined', 
  '/orderInfos/newOrderCreated',  /orders/{id}/newOrderCreated // Webhook
  '/orderMessages/count', // deprecated?
  '/orderProducts', 
  '/orderProducts/count', // deprecated
  '/ping', // TODO: remove (at least in production)
  '/post-comments/{id}/post-comments',
  '/posts/{id}/post-comments',
  '/posts/{id}/commentCount',
  '/posts',
  '/posts/count',
  '/posts/{id}',
  '/posts/featured',
  '/project-comments/{id}/project-comments',
  '/project-files/{id}/project',
  '/projects/{id}/project-comments',
  '/projects/{id}/commentCount',
  '/projects/{id}/project-files',
  '/users/{id}/project-files',
  '/users/{id}/project-files/{fileId}',
  '/projects/{id}/project-links',
  '/projects',
  '/projects/count',
  '/projects/{id}',
  '/projects/featured',
  '/users/{id}/followers',
  '/users/{id}/followers/{followerId}',
  '/users/{id}/liked-posts',
  '/users/{id}/liked-posts/{postId}',
  '/users/{id}/liked-projects',
  '/users/{id}/liked-projects/{projectId}',
  '/users/{id}/posts',
  '/users/{id}/projects',
  '/users/{id}/saved-posts',
  '/users/{id}/saved-posts/{postId}',
  '/users/{id}/saved-projects',
  '/users/{id}/saved-projects/{projectId}',
  '/users/{id}/userProfile',
  '/whoAmI',
  '/users/resendVerifyEmail',
  '/users/verify'
]
Intersection [
  '/users',
  '/users',
  '/users/{id}',
  '/users/{id}',
  '/users/login',
  '/users/logout',
  '/users/reset',
  '/users/change-password',
  '/users/reset-password',
  '/customers',
  '/customers/{id}/Addresses',
  '/customers/{id}',
  '/customers/{id}',
  '/customers/{id}',
  '/customers',
  '/users/creds-taken',
  '/customers/getApi',
  '/admins/{id}',
  '/admins/{id}',
  '/admins/downloadFile',
  '/foundryWorkers',
  '/customers',
  '/admins',
  '/customers',
  '/foundryWorkers',
  '/admins',
  '/admins/{id}',
  '/admins/getApi',
  '/admins/getItems',
  '/admins/getOne',
  '/foundryWorkers/{id}',
  '/foundryWorkers/{id}',
  '/foundryWorkers/{id}',
  '/foundryWorkers/{id}',
  '/foundryWorkers/getWorkerID',
  '/customers/{id}/customerFiles',
  '/customers/{id}/deleteFile',
  '/foundryWorkers/{id}/downloadFile',
  '/customers/{id}/downloadFile',
  '/customers/{id}/uploadFile',
  '/fileInfos',
  '/customers/{id}/customerFiles',
  '/orderInfos',
  '/orderInfos/{id}',
  '/customers/{id}/getCustomerCart',
  '/customers/{id}/customerOrders',
  '/orderInfos/{id}/addOrderProductToCart',
  '/orderInfos/{id}/addOrderChipToCart',
  '/orderInfos/{id}/orderProducts',
  '/orderInfos/{id}/orderChips',
  '/orderInfos/{id}/updateChipLineItemId',
  '/orderInfos/{id}/updateProductLineItemId',
  '/orderProducts/{id}',
  '/orderChips/{id}',
  '/customers/{id}/customerOrders',
  '/orderChips/{id}',
  '/orderChips/{id}',
  '/orderMessages/{id}',
  '/orderMessages',
  '/admins/orderChips',
  '/customers/{id}/orderChips',
  '/foundryWorkers/{id}/orderChips'
]