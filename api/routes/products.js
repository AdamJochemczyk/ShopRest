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

const checkAuth=require('../middlewares/check-auth')
const ProductController=require('../controllers/products')

router.get("/", ProductController.get_all_products);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.create_product
);

router.get("/:id", ProductController.get_product);

router.patch("/:id", checkAuth, ProductController.update_product);

router.delete("/:id", checkAuth, ProductController.delete_product);

module.exports = router;