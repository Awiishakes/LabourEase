import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide Your Name'],
        minLength: [3, 'Name must contain atleast 3 characters'],
        maxLength: [30, 'Name can not exceed 30 characters']
    },
    city: {
        type: String,
        required: true,
        minLength: [3, 'City must be given'],
    },
    address: {
        type: String,
        required: [true, 'Please provide your exact work Address where your work has to be done'],
    },
    contact: {
        type: String,
        required: [true, 'Please provide Your contact'],
        validate: {
            validator: function (val) {
                return val.toString().length === 11
            },
            message: val => `Phone number has to be 11 digits`
        },
    },
    date: {
        type: Date,
        required: [true, 'Please provide work Date']
    },
    time: {
        type: String,
        required: [true, 'Please provide time of Work has to be done'],
    },
    salary:{
        type: Number,
        min: 50,
        max: 99999999,
        required: [true, 'Please provide salary you want to give'],

    },
    description: {
        type: String,
        required: [true, 'Please provide detials of your work'],
        minLength: [10, 'Detials must contain atleast 10 characters'],
    },
    images:[ 
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    coord:{
        lat:{
            type: String,
        },
        lng:{
            type: String,
        }
    },
    status:{
        type: String,
        enum: ["accepted", "rejected","completed"]
    },
    workId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'work',
        required: true
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    workerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    postedOn:{
        type: Date,
        default: Date.now
    }
})



export const Requests = mongoose.model('requests',requestSchema)