const mongoose = require('mongoose');
const dotenv = require('dotenv')


const DB = process.env.DATABASE;


mongoose.connect(DB,
    {
        useCreateIndex: true,
        useFindAndModify: false, 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connection with mongoDb atlas')
    }).catch((err) => {
        console.log(`no connection ${err}`)
    })