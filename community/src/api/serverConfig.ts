/**
 * Backend API entry points
 */
// const ApiRootUrl = process.env.APP_API_ROOTURL || '/api';

const ApiRootUrl = '/api/api';
const newApiRootUrl = '/api';

export const forums = `${newApiRootUrl}/forums`;
export const forum = `${newApiRootUrl}/forums/id`;
export const projects = `${newApiRootUrl}/projects`;
export const project = `${newApiRootUrl}/projects/id`;

// Overall User
export const userSignUp = `${ApiRootUrl}/userBases`;
export const userBaseFind = `${ApiRootUrl}/userBases`;
export const userBaseDeleteById = `${ApiRootUrl}/userBases/id`;
export const updateUserBaseProfile = `${ApiRootUrl}/userBases/id`;
export const userLogin = `${ApiRootUrl}/userBases/login`;
export const userLogout = `${ApiRootUrl}/userBases/logout`;
export const userForgetPass = `${ApiRootUrl}/userBases/reset`;
export const userChangePass = `${ApiRootUrl}/userBases/change-password`;
export const userResetPass = `${ApiRootUrl}/userBases/reset-password`;

// Customer
export const customerSignUp = `${ApiRootUrl}/customers`;
export const customerLogin = `${ApiRootUrl}/customers/login`;
export const customerLogout = `${ApiRootUrl}/customers/logout`;
export const customerChangePass = `${ApiRootUrl}/customers/change-password`;
export const customerAddresses = `${ApiRootUrl}/customers/id/customerAddresses`;
export const customerGetProfile = `${ApiRootUrl}/customers/id`;
export const customerDeleteById = `${ApiRootUrl}/customers/id`;
export const updateCustomerProfile = `${ApiRootUrl}/customers/id`;
export const findCustomerByWhere = `${ApiRootUrl}/customers`;
export const customerCredsTaken = `${ApiRootUrl}/customers/credsTaken`;
export const customerResendVerifyEmail = `${ApiRootUrl}/customers/resendVerifyEmail`;
export const customerGetApiToken = `${ApiRootUrl}/customers/getApi`;

// Admin
export const AdminLogin = `${ApiRootUrl}/admins/login`;
export const AdminLogout = `${ApiRootUrl}/admins/logout`;
export const AdminChangePass = `${ApiRootUrl}/admins/change-password`;
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
export const FoundryWorkerChangePass = `${ApiRootUrl}/foundryWorkers/change-password`;
export const foundryWorkerGetProfile = `${ApiRootUrl}/foundryWorkers/id`;
export const editFoundryWorker = `${ApiRootUrl}/foundryWorkers/id`;
export const FoundryWorkerChangeProfile = `${ApiRootUrl}/foundryWorkers/id`;
export const updateWorkerProfile = `${ApiRootUrl}/foundryWorkers/id`;

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
