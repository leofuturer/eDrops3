/**
 * Backend API entry points
 */
const ApiRootUrl = '/api';

// Overall User
export const user = `${ApiRootUrl}/users`;
export const userByID = (id: string) => `${ApiRootUrl}/users/${id}`; // these should replace the following
// export const userBaseFind = `${ApiRootUrl}/users`;
// export const userBaseDeleteById = `${ApiRootUrl}/users/id`;
// export const updateUserBaseProfile = `${ApiRootUrl}/users/id`;

export const userLogin = `${ApiRootUrl}/users/login`;
//export const userLogout = `${ApiRootUrl}/users/logout`; // not used
export const userForgetPass = `${ApiRootUrl}/users/reset`;
export const userChangePass = `${ApiRootUrl}/users/change-password`;
export const userResetPass = `${ApiRootUrl}/users/reset-password`;
export const userCredsTaken = `${ApiRootUrl}/users/creds-taken`;

// Customer
export const customer = `${ApiRootUrl}/customers`;
export const customerByID = (id: string) => `${ApiRootUrl}/customers/${id}`;
export const customerSignUp = `${ApiRootUrl}/customers`;
export const addCustomer = `${ApiRootUrl}/customers`;
export const getAllCustomers = `${ApiRootUrl}/customers`;
export const customerGetProfile = `${ApiRootUrl}/customers/id`;
export const customerDeleteById = `${ApiRootUrl}/customers/id`;
export const updateCustomerProfile = `${ApiRootUrl}/customers/id`;

//export const customerLogin = `${ApiRootUrl}/customers/login`; // not used
//export const customerLogout = `${ApiRootUrl}/customers/logout`; // not used
export const customerAddressesByID = (id: string) => `${ApiRootUrl}/customers/${id}/customerAddresses`;
export const customerAddresses = `${ApiRootUrl}/customers/id/customerAddresses`;
export const customerGetName = `${ApiRootUrl}/customers/id?filter={"fields":["firstName","lastName"]}`;

//export const findCustomerByWhere = `${ApiRootUrl}/customers`; // not used
//export const credsTaken = `${ApiRootUrl}/users/creds-taken`; // duplicate
export const customerResendVerifyEmail = `${ApiRootUrl}/customers/resendVerifyEmail`;
export const customerGetApiToken = `${ApiRootUrl}/customers/getApi`;


// Admin
//export const AdminLogin = `${ApiRootUrl}/admins/login`; // not used
//export const AdminLogout = `${ApiRootUrl}/admins/logout`; // not used
export const admin = `${ApiRootUrl}/admins`;
export const adminByID = (id: string) => `${ApiRootUrl}/admins/${id}`;
export const adminGetProfile = `${ApiRootUrl}/admins/id`;
export const updateAdminProfile = `${ApiRootUrl}/admins/id`;
export const adminDownloadFile = `${ApiRootUrl}/admins/downloadFile`;

export const addAdmin = `${ApiRootUrl}/admins`;
export const findAdminByWhere = `${ApiRootUrl}/admins`;
export const deleteAdminById = `${ApiRootUrl}/admins/id`;
//export const getApiToken = `${ApiRootUrl}/admins/getApi`; // not used
export const returnAllItems = `${ApiRootUrl}/admins/getItems`;
//export const returnOneItem = `${ApiRootUrl}/admins/getOne`; // not used

// Foundry Worker
//export const FoundryWorkerLogin = `${ApiRootUrl}/foundryWorkers/login`; // not used
//export const FoundryWorkerLogout = `${ApiRootUrl}/foundryWorkers/logout`; // not used
export const foundryWorkerGetProfile = `${ApiRootUrl}/foundryWorkers/id`;
export const foundryWorkerGetName = `${ApiRootUrl}/foundryWorkers/id?filter={"fields":["firstName","lastName"]}`;
export const getAllFoundryWorkers = `${ApiRootUrl}/foundryWorkers`;
export const addFoundryWorker = `${ApiRootUrl}/foundryWorkers`;
export const editFoundryWorker = `${ApiRootUrl}/foundryWorkers/id`;
//export const FoundryWorkerChangeProfile = `${ApiRootUrl}/foundryWorkers/id`; //not used
export const updateWorkerProfile = `${ApiRootUrl}/foundryWorkers/id`;
export const getWorkerId = `${ApiRootUrl}/foundryWorkers/getWorkerID`;

// File management
export const customerFileRetrieve = `${ApiRootUrl}/customers/id/customerFiles`;
export const customerDeleteFile = `${ApiRootUrl}/customers/id/deleteFile`;
export const workerDownloadFile = `${ApiRootUrl}/foundryWorkers/id/downloadFile`;
export const downloadFileById = `${ApiRootUrl}/customers/id/downloadFile`;
export const uploadFile = `${ApiRootUrl}/customers/id/uploadFile`;
export const getAllFileInfos = `${ApiRootUrl}/fileInfos`;
//export const adminRetrieveUserFiles = `${ApiRootUrl}/customers/id/customerFiles`; //not used

// Order management
export const getAllOrderInfos = `${ApiRootUrl}/orderInfos`;
export const getOrderInfoById = `${ApiRootUrl}/orderInfos/id`;
export const getCustomerCart = `${ApiRootUrl}/customers/id/getCustomerCart`;
export const manipulateCustomerOrders = `${ApiRootUrl}/customers/id/customerOrders`;

export const addOrderProductToCart = `${ApiRootUrl}/orderInfos/id/addOrderProductToCart`;
export const addOrderChipToCart = `${ApiRootUrl}/orderInfos/id/addOrderChipToCart`;

export const getProductOrders = `${ApiRootUrl}/orderInfos/id/orderProducts`;
export const getChipOrders = `${ApiRootUrl}/orderInfos/id/orderChips`;
//export const updateChipOrderLineItem = `${ApiRootUrl}/orderInfos/id/updateChipLineItemId`; // not used
//export const updateProductOrderLineItem = `${ApiRootUrl}/orderInfos/id/updateProductLineItemId`; // not used
export const modifyProductOrders = `${ApiRootUrl}/orderProducts/id`;
export const modifyChipOrders = `${ApiRootUrl}/orderChips/id`;

export const customerOrderRetrieve = `${ApiRootUrl}/customers/id/customerOrders`;
//export const workerOrderRetrieve = `${ApiRootUrl}/foundryWorkers/id/workerOrders`; // not used

export const editOrderStatus = `${ApiRootUrl}/orderChips/id`;
export const assignOrders = `${ApiRootUrl}/orderChips/id`;

export const getOrderMessagesById = `${ApiRootUrl}/orderMessages/id`;
export const addOrderMessage = `${ApiRootUrl}/orderMessages`;

// For chip order page
export const adminGetChipOrders = `${ApiRootUrl}/admins/orderChips`;
export const customerGetChipOrders = `${ApiRootUrl}/customers/id/orderChips`;
export const workerGetChipOrders = `${ApiRootUrl}/foundryWorkers/id/orderChips`;
