const express = require('express')
var router = express.Router();
const { check } = require('express-validator');

const { signup, signin, signout } = require('../controllers/auth');



router.post('/signup', [
    check("name")
        .isLength({ min: 3 })
        .withMessage("Name should be min of 3 chars"),
    check("email")
        .isEmail()
        .withMessage("Email is required"),
    check("password")
        .isLength({ min: 5, max: 15 })
        .withMessage("Password should be min of 5 and max of 15 chars")
], signup);



router.post('/signin', [
    check("email")
        .isEmail()
        .withMessage("Email is required"),
    check("password")
        .isLength({ min: 5, max: 15 })
        .withMessage("Password should be min of 5 and max of 15 chars")
], signin);


router.get("/signout", signout)


module.exports = router;