/**
 * Backend API entry points
 */
const ApiRootUrl = '/api';

// Overall User
export const userSignUp = `${ApiRootUrl}/users`;
export const userBaseFind = `${ApiRootUrl}/users`;
export const userBaseDeleteById = `${ApiRootUrl}/users/id`;
export const updateUserBaseProfile = `${ApiRootUrl}/users/id`;
export const userLogin = `${ApiRootUrl}/users/login`;
export const userLogout = `${ApiRootUrl}/users/logout`;
export const userForgetPass = `${ApiRootUrl}/users/reset`;
// export const userChangePass = `${ApiRootUrl}/users/changePassword`;
// export const userResetPass = `${ApiRootUrl}/users/resetPassword`;

// Customer
export const customerSignUp = `${ApiRootUrl}/customers`;
export const customerLogin = `${ApiRootUrl}/customers/login`;
export const customerLogout = `${ApiRootUrl}/customers/logout`;
export const customerChangePass = `${ApiRootUrl}/customers/changePassword`;
export const customerResetPass = `${ApiRootUrl}/customers/resetPassword`;
export const customerAddresses = `${ApiRootUrl}/customers/id/customerAddresses`;
export const customerGetProfile = `${ApiRootUrl}/customers/id`;
export const customerGetName = `${ApiRootUrl}/customers/id?filter={"fields":["firstName","lastName"]}`;
export const customerDeleteById = `${ApiRootUrl}/customers/id`;
export const updateCustomerProfile = `${ApiRootUrl}/customers/id`;
export const findCustomerByWhere = `${ApiRootUrl}/customers`;
export const customerCredsTaken = `${ApiRootUrl}/customers/credsTaken`;
export const customerResendVerifyEmail = `${ApiRootUrl}/customers/resendVerifyEmail`;
export const customerGetApiToken = `${ApiRootUrl}/customers/getApi`;

// Admin
export const AdminLogin = `${ApiRootUrl}/admins/login`;
export const AdminLogout = `${ApiRootUrl}/admins/logout`;
export const AdminChangePass = `${ApiRootUrl}/admins/changePassword`;
export const adminGetProfile = `${ApiRootUrl}/admins/id`;
export const updateAdminProfile = `${ApiRootUrl}/admins/id`;
export const adminDownloadFile = `${ApiRootUrl}/admins/downloadFile`;
export const adminCredsTaken = `${ApiRootUrl}/admins/credsTaken`;

export const addFoundryWorker = `${ApiRootUrl}/foundryWorkers`;
export const addCustomer = `${ApiRootUrl}/customers`;
export const addAdmin = `${ApiRootUrl}/admins`;
export const getAllCustomers = `${ApiRootUrl}/customers`;
export const getAllFoundryWorkers = `${ApiRootUrl}/foundryWorkers`;
export const findAdminByWhere = `${ApiRootUrl}/admins`;
export const deleteAdminById = `${ApiRootUrl}/admins/id`;
export const getApiToken = `${ApiRootUrl}/admins/getApi`;
export const returnAllItems = `${ApiRootUrl}/admins/getItems`;
export const returnOneItem = `${ApiRootUrl}/admins/getOne`;

// Foundry Worker
export const FoundryWorkerLogin = `${ApiRootUrl}/foundryWorkers/login`;
export const FoundryWorkerLogout = `${ApiRootUrl}/foundryWorkers/logout`;
export const FoundryWorkerChangePass = `${ApiRootUrl}/foundryWorkers/changePassword`;
export const foundryWorkerGetProfile = `${ApiRootUrl}/foundryWorkers/id`;
export const foundryWorkerGetName = `${ApiRootUrl}/foundryWorkers/id?filter={"fields":["firstName","lastName"]}`;
export const editFoundryWorker = `${ApiRootUrl}/foundryWorkers/id`;
export const FoundryWorkerChangeProfile = `${ApiRootUrl}/foundryWorkers/id`;
export const updateWorkerProfile = `${ApiRootUrl}/foundryWorkers/id`;
export const getWorkerId = `${ApiRootUrl}/foundryWorkers/getWorkerID`;

// File management
export const customerFileRetrieve = `${ApiRootUrl}/customers/id/customerFiles`;
export const customerDeleteFile = `${ApiRootUrl}/customers/id/deleteFile`;
export const workerDownloadFile = `${ApiRootUrl}/foundryWorkers/id/downloadFile`;
export const downloadFileById = `${ApiRootUrl}/customers/id/downloadFile`;
export const uploadFile = `${ApiRootUrl}/customers/id/uploadFile`;
export const getAllFileInfos = `${ApiRootUrl}/fileInfos`;
export const adminRetrieveUserFiles = `${ApiRootUrl}/customers/id/customerFiles`;

// Order management
export const getAllOrderInfos = `${ApiRootUrl}/orderInfos`;
export const getOrderInfoById = `${ApiRootUrl}/orderInfos/id`;
export const getCustomerCart = `${ApiRootUrl}/customers/id/getCustomerCart`;
export const manipulateCustomerOrders = `${ApiRootUrl}/customers/id/customerOrders`;

export const addOrderProductToCart = `${ApiRootUrl}/orderInfos/id/addOrderProductToCart`;
export const addOrderChipToCart = `${ApiRootUrl}/orderInfos/id/addOrderChipToCart`;

export const getProductOrders = `${ApiRootUrl}/orderInfos/id/orderProducts`;
export const getChipOrders = `${ApiRootUrl}/orderInfos/id/orderChips`;
export const modifyProductOrders = `${ApiRootUrl}/orderProducts/id`;
export const modifyChipOrders = `${ApiRootUrl}/orderChips/id`;

export const customerOrderRetrieve = `${ApiRootUrl}/customers/id/customerOrders`;
export const workerOrderRetrieve = `${ApiRootUrl}/foundryWorkers/id/workerOrders`;

export const editOrderStatus = `${ApiRootUrl}/orderChips/id`;
export const assignOrders = `${ApiRootUrl}/orderChips/id`;

// For chip order page
export const adminGetChipOrders = `${ApiRootUrl}/admins/orderChips`;
export const customerGetChipOrders = `${ApiRootUrl}/customers/id/orderChips`;
export const workerGetChipOrders = `${ApiRootUrl}/foundryWorkers/id/orderChips`;
