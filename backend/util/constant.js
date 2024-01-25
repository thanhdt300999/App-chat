const StatusOrder = {
  WAITING_SHIPPING: 0,
  SHIPPING: 1,
  RECEIVED: 2,
  CANTCONTACT: 4,
  CANCELED: 3,
  RETURN: 5
}

const OrderNumberStatus = {
  WAITING_SHIP: '0',
  SHIPPING: '1',
  RECEIVED: '2',
  CANCELLED: '3',
  CANT_CONTACT: '4',
  RETURNED: '5',
}


module.exports = {
  StatusOrder,
  OrderNumberStatus
}