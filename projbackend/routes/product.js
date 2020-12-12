const express = require('express')
var router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')
const { createProduct, getProductById, getAllProducts, updateProduct, getAllUniqueCategories, getProduct, photo } = require('../controllers/product')


//Parameters
router.param("userId", getUserById)
router.param("productId", getProductById)

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

router.put("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)


router.get("/product/:productId", getProduct)
router.get("/product/photo/:product", photo)


router.get("/products", getAllProducts)

router.get("/products/categories", getAllUniqueCategories)


module.exports = router;