const Product = require("../models/product");
const mongoose = require("mongoose");

exports.get_all_products = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((data) => {
      const response = {
        count: data.length,
        products: data.map((el) => {
          return {
            name: el.name,
            price: el.price,
            _id: el._id,
            productImage: el.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + el._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.create_product = (req, res, next) => {
  console.log(req.file);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Successfully created object",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(500).json({ error: err });
    });
};

exports.get_product = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((data) => {
      console.log(data);
      if (data !== null) {
        res.status(200).json({
          product: data,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost/products",
          },
        });
      } else {
        res.status(404).json({ message: "No valid entry" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.update_product = (req, res, next) => {
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateMany({ _id: req.body.id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/" + req.body.id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  res.status(200).json({
    message: "Updated product",
  });
};

exports.delete_product = (req, res, next) => {
  const id = req.params.id;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Delete product",
        request: {
          type: "POST",
          url: "localhost:3000/products",
          data: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};