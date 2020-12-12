const Product = require("../models/product")
var _ = require('lodash');
const formidable = require('formidable')
const fs = require('fs')

exports.getProductById = (req, res, next, id) => {

    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    err: "Product not found"
                })
            }
            req.product = product
            next()
        })
}

exports.createProduct = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                err: "Problem with Image"
            })
        }

        const { name, description, price, category, stock } = fields

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please provide all fields"
            })
        }

        let product = new Product(fields)

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    err: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                });
            }
            res.json(product)
        })
    })
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                res.status(400).json({
                    error: "No product in DB"
                });
            }
            res.json(products)
        })
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                err: "Problem with Image"
            })
        }

        let product = req.product

        product = _.extend(product, fields)
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    err: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                });
            }
            res.json(product)
        })
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                err: "No category found"
            })
        }
        res.json(categories)
    })
}

exports.updateStock = (req, res, next) => {
    let operations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })

    Product.bulkWrite(operations, {}, (err, product) => {
        if (err) {
            return res.status(400).json({
                err: "Bulk Operation failed"
            })
        }
        next()
    })


}


exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return (res.send(req.product.photo.data))
    }
    next()
}