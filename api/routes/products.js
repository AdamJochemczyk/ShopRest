const express=require('express')
const router=express.Router();

const multer = require('multer')

const storage=multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb) {
        cb(null,file.filename)
    }
})

const fileFilter=(req,file,cb)=>{
    file.mimetype==='image/jpeg' || file.mimetype==='image/png' ?
        cb(null,true) :
        cb(null,false);
}

const upload=multer({
    storage:storage,
    limits: { fileSize: 1024 * 1024*5 },
    fileFilter: fileFilter
})

const Product=require('../models/product')
const mongoose=require('mongoose')

router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(data=>{
        const response ={
            count: data.length,
            products: data.map(el=>{
                return {
                    name: el.name,
                    price: el.price,
                    _id: el._id,
                    productImage: el.productImage,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+el._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.post('/', upload.single('productImage'), (req,res,next)=>{

    console.log(req.file);

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(result=>{
        console.log(result)
         res.status(200).json({
           message: "Successfully created object",
           createdProduct: {
             name: result.name,
             price: result.price,
             _id: result._id,
             request:{
                type: 'GET',
                url: 'localhost:3000/products/'+result._id
             }
           },
         });
    }).catch(err=>{
        console.log(err)
        res.send(500).json({error: err})
    })

})

router.get('/:id',(req,res,next)=>{
    const id=req.params.id;
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

})

router.patch("/:id", (req, res, next) => {
    
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value
    }
    Product.updateMany({_id: req.body.id},{$set: updateOps})
    .exec()
    .then(result=>{
        console.log(result)
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/'+req.body.id
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: err})
    })
    res.status(200).json({
      message: "Updated product",
    });
});

router.delete("/:id", (req, res, next) => {
    const id=req.params.id
    Product.remove({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Delete product",
            request: {
                type: 'POST',
                url: 'localhost:3000/products',
                data: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err=>{
        res.status(500).json({error: err})
    })
});

module.exports = router;