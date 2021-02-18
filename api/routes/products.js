const express=require('express')

const router=express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message: 'Handling get request /products'
    })
})

router.post('/',(req,res,next)=>{
    res.status(200).json({
        message: 'Handling get request /products'
    })
})

router.get('/:id',(req,res,next)=>{
    const id=req.params.id;
    if(id==='special'){
        res.status(200).json({
          message: "Handling get for id request /products",
          id: id
        });
    } else{
        res.status(200).json({
            message: 'You passed an ID',
        })
    }
})

router.patch("/:id", (req, res, next) => {
    res.status(200).json({
      message: "Updated product",
    });
});

router.delete("/:id", (req, res, next) => {
  res.status(200).json({
    message: "Delete product",
  });
});

module.exports = router;