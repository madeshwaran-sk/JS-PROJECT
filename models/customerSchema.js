const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "abcdefghijklmnop"

const customerSchema = new mongoose.Schema({
    // fname: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not Valid Email")
            }
        }
    },
    salesemail: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not Valid Email")
            }
        }
    },
    time : { 
        type : Date, 
        default: Date.now 
    },
     fileurl: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        required: false,
    },
    // password: {
    //     type: String,
    //     required: true,
    //     minlength: 6
    // },
 
        // token: {
        //     type: String,
        //     required: true,
        // }
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
});



// hash password
// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 12);
//     }

//     next();
// });

// token generate
customerSchema.methods.generateAuthtoken = async function(){
    try {
        let newtoken = jwt.sign({_id:this._id},SECRECT_KEY,{
            expiresIn:"1d",
        });

        this.tokens = this.tokens.concat({token:newtoken});
        // this.tokens = newtoken;
        await this.save();
        return newtoken;
    } catch (error) {
        res.status(400).json(error)
    }
}


// creating model
const customer = new mongoose.model("customer", customerSchema);

module.exports = customer;