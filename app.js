const express=require('express');

const app=express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes=require('./api/routes/products')
const orderRoutes=require('./api/routes/orders')

let dev_db_url="mongodb://127.0.0.1:27017/rest-products"
const mongoDB=process.env.DATABASE || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise=global.Promise

app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use((res,req,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method==="OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
})

app.use('/products',productRoutes)
app.use('/orders',orderRoutes)

app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error)
})

app.use((err, req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
})

module.exports=app;