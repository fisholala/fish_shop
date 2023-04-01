const express = require('express');
const router= express.Router()
const{createOrder, myOrders, getSingleOrders, allOrders, updateOrder, deleteOrders}=require('../controller/orderController')
const{isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')

router.route('/order/new').post(isAuthenticatedUser,createOrder)
router.route('/orders/me').get(isAuthenticatedUser,myOrders)
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrders)
router.route('/admin/orders/').get(isAuthenticatedUser,authorizeRoles('admin'),allOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
router.route('/admin/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrders)
module.exports=router