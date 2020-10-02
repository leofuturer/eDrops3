/**
 * Backend API entry points
 */
const ApiRootUrl ='/api';

//Customer
export const customerSignUp = ApiRootUrl+'/customers';
export const customerLogin = ApiRootUrl+'/customers/login';
export const customerForgetPass = ApiRootUrl+'/customers/reset';
export const customerChangePass = ApiRootUrl +'/customers/change-password';
export const customerResetPass = ApiRootUrl +'/customers/reset-password';
export const customerAddresses = ApiRootUrl + '/customers/id/customerAddresses';
export const customerGetProfile = ApiRootUrl + '/customers/id';
export const customerDeleteById = ApiRootUrl + '/customers/id';
export const updateCustomerProfile = ApiRootUrl + '/customers/id';
export const findCustomerByWhere = ApiRootUrl + '/customers';
export const customerResendVerifyEmail = ApiRootUrl + '/customers/id/resendVerifyEmail';

//Admin
export const AdminLogin = ApiRootUrl + '/admins/login';
export const AdminForgetPassword = ApiRootUrl + '/admin-forget-password';
export const AdminChangePass = ApiRootUrl + '/admins/change-password';
export const adminGetProfile = ApiRootUrl + '/admins/id';
export const updateAdminProfile = ApiRootUrl + '/admins/id';
export const adminDownloadFile = ApiRootUrl + '/admins/downloadFile';
export const addFoundryWorker = ApiRootUrl + '/foundryWorkers';
export const addCustomer = ApiRootUrl + '/customers';
export const getAllCustomers = ApiRootUrl+'/customers';
export const getAllFoundryWorkers = ApiRootUrl + '/foundryWorkers';
export const findAdminByWhere = ApiRootUrl + '/admins';

//Foundry Worker
export const FoundryWorkerLogin = ApiRootUrl+ '/foundryWorkers/login';
export const FoundryWorkerForgetPass = ApiRootUrl + '/worker-forget-password';
export const FoundryWorkerChangePass = ApiRootUrl + '/foundryWorkers/change-password';
export const foundryWorkerGetProfile = ApiRootUrl + '/foundryWorkers/id';
export const editFoundryWorker = ApiRootUrl + '/foundryWorkers/id';
export const FoundryWorkerChangeProfile = ApiRootUrl + '/foundryWorkers/id';
export const updateWorkerProfile = ApiRootUrl + '/foundryWorkers/id';
export const findOneWorkerByWhere = ApiRootUrl + '/foundryWorkers';

//File management
export const customerFileRetrieve = ApiRootUrl + '/customers/id/customerFiles';
export const customerDeleteFile = ApiRootUrl + '/customers/id/deleteFile';
//export const workerFileRetrieve = ApiRootUrl + '/fileInfos/returnworkerfileInfo';
export const downloadFileById = ApiRootUrl + '/customers/id/downloadFile';
export const uploadFile = ApiRootUrl + '/customers/id/uploadFile';
export const getAllFileInfos = ApiRootUrl + '/fileInfos';
export const adminRetrieveUserFiles = ApiRootUrl + '/customers/id/customerFiles';
export const assignFile = ApiRootUrl + '/fileInfos/assignfile';
export const editFileStatus = ApiRootUrl + '/fileInfos/worker-edit-status';

//Order management
export const getAllOrderInfos = ApiRootUrl + '/orderInfos';
export const getOrderInfoById = ApiRootUrl + '/orderInfos/id';
export const getCustomerCart = ApiRootUrl + '/customers/id/getCustomerCart';
export const manipulateCustomerOrders = ApiRootUrl + '/customers/id/customerOrders';

export const addOrderProductToCart = ApiRootUrl + '/orderInfos/id/addOrderProductToCart';
export const addOrderChipToCart = ApiRootUrl + '/orderInfos/id/addOrderChipToCart';

export const getProductOrders = ApiRootUrl + '/orderInfos/id/orderProducts';
export const getChipOrders = ApiRootUrl + '/orderInfos/id/orderChips';
export const modifyProductOrders = ApiRootUrl + '/orderProducts/id';
export const modifyChipOrders = ApiRootUrl + '/orderChips/id';

export const customerOrderRetrieve = ApiRootUrl + '/customers/id/customerOrders';
export const workerOrderRetrieve = ApiRootUrl + '/foundryWorkers/id/workerOrders';

export const editOrderStatus = ApiRootUrl + '/orderInfos/edit-order-status';
export const assignOrders = ApiRootUrl + '/orderInfos/assign-order-info';