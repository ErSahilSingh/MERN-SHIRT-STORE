const User = require("../models/user")
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signup = (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            err: errors.array()[0].msg,
            param: errors.array()[0].param,
        })
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: 'NOT able to save user in DB',
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id,
        });
    });
};

exports.signin = (req, res) => {

    const { email, password } = req.body

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            err: errors.array()[0].msg,
            param: errors.array()[0].param,
        })
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(400).json({
                err: "DB error"
            })
        }

        if (!user) {
            return res.status(400).json({
                err: "User Email not found"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                err: "Email and password doesn't match"
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET)
        //Put Token in Cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        //sending response to frontEnd
        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: { _id, name, email, role }
        })
    })
}


exports.signout = (req, res) => {

    res.clearCookie("token")
    res.json({
        message: "User Signout Successful"
    })
}

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})

exports.isAuthenticated = (req, res, next) => {

    let checker = req.profile && req.auth && req.profile._id == req.auth._id

    if (!checker) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {

    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Not Admin"
        })
    }
    next();
}

