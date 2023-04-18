// Order management
// export const getAllOrderInfos = `${ApiRootUrl}/orderInfos`;\
//      allOrders.tsx
//          - get a list of all orders
//      (order) index.tsx
//          - get a list of filtered orders

// export const getOrderInfoById = `${ApiRootUrl}/orderInfos/id`;
//      orderDetail.tsx
//          - get order info by id

// export const getCustomerCart = `${ApiRootUrl}/customers/id/getCustomerCart`;
//      CartContext.tsx
//          - get cart info
//      addNewAddress.tsx
//          - get cart to read address info

// export const manipulateCustomerOrders = `${ApiRootUrl}/customers/id/customerOrders`;
//      CartContext.tsx
//          - create order info for newly created cart

// export const addOrderProductToCart = `${ApiRootUrl}/orderInfos/id/addOrderProductToCart`;
//      CartContext.tsx
//          - add products to cart

// export const addOrderChipToCart = `${ApiRootUrl}/orderInfos/id/addOrderChipToCart`;
//      CartContext.tsx
//          - add chip orders to cart

// export const getProductOrders = `${ApiRootUrl}/orderInfos/id/orderProducts`;
//      CartContext.tsx
//          - get cart details, after modifying the cart
//      orderDetail.tsx
//          - get cart details

// export const getChipOrders = `${ApiRootUrl}/orderInfos/id/orderChips`;
//      CartContext.tsx
//          - get chip cart details, after modifying the cart
//      orderDetail.tsx
//          - get cart details

// export const updateChipOrderLineItem = `${ApiRootUrl}/orderInfos/id/updateChipLineItemId`; // not used

// export const updateProductOrderLineItem = `${ApiRootUrl}/orderInfos/id/updateProductLineItemId`; // not used

// export const modifyProductOrders = `${ApiRootUrl}/orderProducts/id`;
//      CartContext.tsx
//          - modifying cart or deleting orders

// export const modifyChipOrders = `${ApiRootUrl}/orderChips/id`;
//      CartContext.tsx
//          - modifying cart or deleting orders

// export const customerOrderRetrieve = `${ApiRootUrl}/customers/id/customerOrders`;
//      (order) index.tsx
//          - get a customer's orders

// export const workerOrderRetrieve = `${ApiRootUrl}/foundryWorkers/id/workerOrders`; // not used

// export const editOrderStatus = `${ApiRootUrl}/orderChips/id`;
//      chipOrders.tsx
//          - edit chip order status

// export const assignOrders = `${ApiRootUrl}/orderChips/id`;
//      assignOrders.tsx
//          - assign orders to workers

// export const getOrderMessagesById = `${ApiRootUrl}/orderMessages/id`;
//      orderChat.tsx
//          - Get messages from user profile

// export const addOrderMessage = `${ApiRootUrl}/orderMessages`;
//      orderChat.tsx
//          - send message

// export const adminGetChipOrders = `${ApiRootUrl}/admins/orderChips`;
//      orderChat.tsx
//          - get chip orders as admin

// export const customerGetChipOrders = `${ApiRootUrl}/customers/id/orderChips`;
//      orderChat.tsx
//          - get chip orders as customer

// export const workerGetChipOrders = `${ApiRootUrl}/foundryWorkers/id/orderChips`;
//      orderChat.tsx
//          - get chip orders as worker

// general uses
//  list orders (with filter)
//  find orders by id
//  list orders by user
//  get chip orders (as admin, customer, worker)
//  get cart info
//  create order info
//  add orders and products to cart
//  get orders and products info
//  modifying orders and products info
//  deleting orders and products info
//  edit chip order status
//  assign order to workers
//  get user's messages
//  send message
