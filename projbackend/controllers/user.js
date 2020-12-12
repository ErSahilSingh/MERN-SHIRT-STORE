const User = require("../models/user")


exports.getUserById = (req, res, next, id) => {
    User.findById(id, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "User Not found in DB"
            })
        }
        req.profile = user;
        next()
    })
}

exports.getUser = (req, res) => {

    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile)
}

exports.updateUser = (req, res) => {

    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Not Authorized"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;

            res.json(user)
        }
    )
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchase = [];

    req.body.order.products.forEach(product => {
        purchase.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })

    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchase } },
        { new: true },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save purrchases"
                })
            }
            next();
        }

    )

}