const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');

dotenv.config({path: './config.env'})
require('./db/conn')
const User = require('./models/userschema');

app.use(cookieparser())
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Credentials","true")
    res.setHeader("Access-Control-Allow-Methods",  
    "GET, POST, PATCH, DELETE, OPTIONS");  
    next();
})
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('./router/router'))


if (process.env.NODE_ENV == 'production') {
    app.use(express.static("client/build"))
}


const port = process.env.PORT || 5000;


app.listen(port,()=>{
    console.log(`Connection is done at ${port}`)
})