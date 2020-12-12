const express = require('express')
var router = express.Router();


const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user')
const { getProductById, updateStock } = require('../controllers/product')
const { createOrder, getOrderById, getAllOrders, getOrderStatus, updateStatus } = require('../controllers/order')

router.param("userId", getUserById)
router.param("orderId", getOrderById)

router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)

router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
router.get("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus)



module.exports = router;