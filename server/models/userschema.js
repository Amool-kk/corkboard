const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    cpassword: String,
    tokens:[{
        tokenid:{
            type:String,
            required:true
        }
    }]
})


// this for genrate token
userSchema.methods.genrateToken = async function(){
    try{
        console.log("genrate token function")
        const token = await jwt.sign({_id:this._id.toString()},process.env.KEY)
        this.tokens = this.tokens.concat({tokenid:token})
        await this.save()
        return token
    }catch(e){
        console.log(`error in genrate token is: ${e}`)
    }
}

// this for password hash
userSchema.pre('save',async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = undefined;
    }
    next()
})



const User = mongoose.model('userdata',userSchema);


module.exports = User;