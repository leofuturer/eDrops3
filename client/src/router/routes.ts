export enum ROUTES {
  // Public routes
  Root = '/',
  Home = '/home',
  Products = '/products',
  Product = '/product/:id',
  ComingSoon = '/coming-soon',
  Login = '/login',
  Signup = '/signup',
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password',
  CheckEmail = '/check-email',
  EmailVerified = '/email-verified',
  EmailUnverified = '/email-unverified',
  // Authenticated routes
  Upload = '/upload',
  ChipFab = '/chip-fab',
  BeforeCheckout = '/before-checkout',
  // Manage routes
  // Universal routes
  ManageProfile = '/manage/profile',
  ManageChangePassword = '/manage/change-password',
  ManageChipOrders = '/manage/chip-orders',
  // Admin routes
  ManageAllFiles = '/manage/all-files',
  ManageAllOrders = '/manage/all-orders',
  ManageAdmins = '/manage/admins',
  ManageAdminsAdd = '/manage/admins/add',
  ManageAdminsUpdate = '/manage/admins/:id',
  // ManageAdminsEdit = '/manage/admins/:id/edit',
  ManageCustomers = '/manage/customers',
  ManageCustomersAdd = '/manage/customers/add',
  ManageCustomersUpdate = '/manage/customers/:id',
  // ManageCustomersEdit = '/manage/customers/:id/edit',
  ManageCustomersFiles = '/manage/customers/:id/files',
  ManageCustomersOrders = '/manage/customers/:id/orders',
  ManageWorkers = '/manage/workers',
  ManageWorkersAdd = '/manage/workers/add',
  ManageWorkersUpdate = '/manage/workers/:id',
  // ManageWorkersEdit = '/manage/workers/:id/edit',
  ManageWorkersFiles = '/manage/workers/:id/files',
  ManageWorkersOrders = '/manage/workers/:id/orders',
  ManageAssignOrders = '/manage/assign-orders', // Not sure if this is needed
  // Customer routes
  ManageAddress = '/manage/address',
  ManageAddressNew = '/manage/address/new',
  ManageAddressUpdate = '/manage/address/update',
  ManageCart = '/manage/cart',
  ManageFiles = '/manage/files',
  ManageOrders = '/manage/orders',
  // Subpages
  SubpageOrderDetail = '/subpage/order-detail/:id',
  SubpageOrderChat = '/subpage/order-chat/:id',
}

export const idRoute = (route: ROUTES, id: string) => route.replace(':id', id);