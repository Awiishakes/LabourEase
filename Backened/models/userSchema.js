import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        minLength: [3, 'Name atleast conatin 3 characters'],
        maxLength: [30, 'Name can not exceed 30 characters'],
    },
    cnic: {
        type: Number,
        required: [true, 'Please provide your CNIC'],
        validate: {
            validator: function (val) {
                return val.toString().length === 13
            },
            message: `CNIC has to be 13 digits`
        },
    },
    contact: {
        type: String,
        required: [true, 'Please provide your Phone number'],
        validate: {
            validator: function (val) {
                return val.toString().length === 11
            },
            message: `Phone number has to be 11 digits`
        },
    },
    role: {
        type: String,
        required: [true, 'Please provide the your role'],
        enum: ["client", "worker","admin"]
    },
    password: {
        type: String,
        required: [true, 'Please provide your Password'],
        minLength: [8, 'Password contain atleast 8 characters'],
        maxLength: [32, 'Password cannot exceed 32 characters'],
        select: false,
    },
    address: {
        type: String,
        minLength: [5, 'Address contain atleast 5 characters']
    },
    profile:{
        public_id:{
            type: String,
        },
        url:{
            type: String
        }
    },
    status:{
        type: String,
        enum: ["active", "banned"],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


//ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//COMPARING THE USER PASSWORD ENTERED BY USER WITH THE USER SAVED PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//GENERATING A JWT TOKEN WHEN A USER REGISTERS OR LOGINS, IT DEPENDS ON OUR CODE THAT WHEN DO WE NEED TO GENERATE THE JWT TOKEN WHEN THE USER LOGIN OR REGISTER OR FOR BOTH. 
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("user", userSchema);