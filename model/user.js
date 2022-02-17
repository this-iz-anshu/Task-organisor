const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt=require('jsonwebtoken');
const { Binary } = require('mongodb');
const { string } = require('sharp/lib/is');

const userSchema=new mongoose.Schema({
    name: {
        type: string,
        required: true,
        validate(value) {
            if (value.length > 7)
            {
                throw Error('name can not be greater then 7')
                }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            const isValid = validator.isEmail(value);
            if (!isValid) {
                throw Error("please enter valid email");
            }
        }
    },
    age: {
        type:Number
    },
    password: {
        type:String,
        
        required: true,
        trim: true,
        minLength:6,

        validate(value) {
           
             if (value.includes('password'))
            {
                throw new Error("it should not be word password!")
                }
        }
    },
    
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }],
    avator: {
        type:Buffer
    }
}
)

userSchema.virtual('tasks', {
    ref: 'task', //will look for task into another document
    localField: '_id', // match id of user
    foreignField:'owner' //with other document relation field
})

// userSchema.statics.findByCredential = async (email,password) => {
//     const user = await User.findOne({ email })
//     if (!user)
//     {
//         throw new Error('unable to find User');
//     }
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid)
//     {
//         throw new Error('unable to find User');
//     }

//     return user;
// }
userSchema.methods.generateToken = async function() {
    const user = this;
    const jwtSecretCode=process.env.JWT_SECRET_CODE
    const token = jwt.sign({ _id: user._id.toString() }, jwtSecretCode);
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token;
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isvalidate = await bcrypt.compare(password, user.password);
    if (!isvalidate)
    {
        throw new Error({error:"wrong password"})
        }

    

    return user
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userobj = user.toObject();
    delete userobj.password;
    delete userobj.tokens;
    return userobj;
}


userSchema.pre('save', async function (next) {
    
    const user = this;
    if (user.isModified('password'))
    {
    
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPswd = await bcrypt.hash(user.password, salt);
            user.password = hashedPswd;
        } catch (error) {
            return false
            console.log(error )
        }
       
        }
   

    next();
})

// userSchema.virtual('tasks', {
//     ref:'task'
// })

const User = mongoose.model("user", userSchema)

module.exports = User;