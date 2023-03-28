/**
 * Backend API endpoints categorized by model
 */
const ApiRootUrl = '/api';

/**
 * User endpoints (applies to all roles)
 * Mostly generic auth related
 * 
 */
export const user = {
  credsTaken: '/users/creds-taken',
  resetPassword: '/users/reset-password',
  changePassword: '/users/change-password',
  login: '/users/login',
  logout: '/users/logout',
  reset: '/users/reset',
  get: '/users',
  getById: (id: string) => `/users/${id}`,
  resendVerifyEmail: '/users/resendVerifyEmail',
  verify: '/users/verify',
}

export const customer = {
  get: '/customers',
  getById: (id: string) => `/customers/${id}`,
  getAddressesById: (id: string) => `/customers/${id}/customerAddresses`,
  getCartById: (id: string) => `/customers/${id}/getCustomerCart`, // should be renamed to /cart
  getOrdersById: (id: string) => `/customers/${id}/customerOrders`, // should be renamed to /orders
}

export const admin = {
  get: '/admins',
  getById: (id: string) => `/admins/${id}`,
  downloadFile: '/admins/downloadFile',
  getApiToken: '/foundryWorkers/getApi', // deprecated
  getItems: '/foundryWorkers/getItems', // deprecated?
  getOne: '/foundryWorkers/getOne', // deprecated?
}

export const worker = {
  get: '/foundryWorkers',
  getById: (id: string) => `/foundryWorkers/${id}`,
  getWorkerId: '/foundryWorkers/getWorkerID', // deprecated ?
}


export const customerFileRetrieve = `${ApiRootUrl}/customers/id/customerFiles`;
export const customerDeleteFile = `${ApiRootUrl}/customers/id/deleteFile`;
export const workerDownloadFile = `${ApiRootUrl}/foundryWorkers/id/downloadFile`;
export const downloadFileById = `${ApiRootUrl}/customers/id/downloadFile`;
export const uploadFile = `${ApiRootUrl}/customers/id/uploadFile`;
export const getAllFileInfos = `${ApiRootUrl}/fileInfos`;
export const adminRetrieveUserFiles = `${ApiRootUrl}/customers/id/customerFiles`;

export const orders = {
  get: '/orderInfos',
  getById: (id: string) => `/orderInfos/${id}`,
  addProduct: (id: string) => `/orderInfos/${id}/addOrderProductToCart`, // should be renamed to /product
  addChip: (id: string) => `/orderInfos/${id}/addOrderChipToCart`, // should be renamed to /chip
  productOrders: (id: string) => `/orderInfos/${id}/orderProducts`,
  chipOrders: (id: string) => `/orderInfos/${id}/orderChips`,
  updateChip: (id: string) => `/orderInfos/${id}/updateChipLineItemId`,
  updateProduct: (id: string) => `/orderInfos/${id}/updateProductLineItemId`,
  getProductById: (id: string) => `/orderProducts/${id}`,
  getChipById: (id: string) => `/orderChips/${id}`,
}

export const customerOrderRetrieve = `${ApiRootUrl}/customers/id/customerOrders`;
export const workerOrderRetrieve = `${ApiRootUrl}/foundryWorkers/id/workerOrders`;

export const editOrderStatus = `${ApiRootUrl}/orderChips/id`;
export const assignOrders = `${ApiRootUrl}/orderChips/id`;

export const getOrderMessagesById = `${ApiRootUrl}/orderMessages/id`;
export const addOrderMessage = `${ApiRootUrl}/orderMessages`;

// For chip order page
export const adminGetChipOrders = `${ApiRootUrl}/admins/orderChips`;
export const customerGetChipOrders = `${ApiRootUrl}/customers/id/orderChips`;
export const workerGetChipOrders = `${ApiRootUrl}/foundryWorkers/id/orderChips`;
