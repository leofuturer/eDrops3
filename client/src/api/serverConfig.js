const ApiRootUrl ='/api';
//Customer
export const customerSignUp = ApiRootUrl+'/customers';
export const customerLogin = ApiRootUrl+'/customers/login';
export const customerForgetPass = ApiRootUrl+'/customer-forget-password';
export const customerChangePass = ApiRootUrl +'/customers/change-password';
export const customerAddresses = ApiRootUrl + '/customers/id/customerAddresses';
export const customerGetProfile = ApiRootUrl + '/customers/id';
export const customerDeleteById = ApiRootUrl + '/customers/id';
export const updateCustomerProfile = ApiRootUrl + '/customers/id';
export const findCustomerByWhere = ApiRootUrl + '/customers';

//Admin
export const AdminLogin = ApiRootUrl + '/admins/login';
export const AdminForgetPassword = ApiRootUrl + '/admin-forget-password';
export const AdminChangePass = ApiRootUrl + '/admins/change-password';
export const adminGetProfile = ApiRootUrl + '/admins/id';
export const updateAdminProfile = ApiRootUrl + '/admins/id';
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
export const customerFileRetrieve = ApiRootUrl + '/customers/id/customerHasFiles';
export const customerDeleteFile = ApiRootUrl + '/customers/id/customerHasFiles/fk';
//export const workerFileRetrieve = ApiRootUrl + '/fileinfos/returnworkerfileinfo';
export const downloadFileById = ApiRootUrl + '/containers/container1/download/filename';
export const uploadFile = ApiRootUrl + '/containers/container1/upload';
export const getAllFileInfos = ApiRootUrl + '/fileinfos';
export const adminRetrieveUserFiles = ApiRootUrl + '/customers/id/customerHasFiles'
export const assignFile = ApiRootUrl + '/fileinfos/assignfile';
export const editFileStatus = ApiRootUrl + '/fileinfos/worker-edit-status';

//Order management
export const getAllOrderInfos = ApiRootUrl + '/orderInfos';
export const getOrderInfoById = ApiRootUrl + '/orderInfos/id'

export const customerOrderRetrieve = ApiRootUrl + '/customers/id/customerHasOrderInfos';
export const workerOrderRetrieve = ApiRootUrl + '/foundryWorkers/id/workerHasOrderInfos';

export const editOrderStatus = ApiRootUrl + '/orderInfos/edit-order-status';
export const assignOrders = ApiRootUrl + '/orderInfos/assign-order-info';