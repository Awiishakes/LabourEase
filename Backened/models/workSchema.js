import mongoose from 'mongoose'

const workSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please provide your work title'],
        minLength: [3, 'Work title contain atleast 3 characters'],
        maxLength: [50, 'Work title cannot exceed 50 characters'],
    },
    city: {
        type: String,
        required: true,
        minLength: [3, 'City must be given'],
    },
    description:{
        type: String,
        required: [true, 'Please provide detials of your work'],
        minLength: [20, 'Detials must contain atleast 10 characters'],
    },
    startTime:{
        type:String,
        required: [true, 'Please provide availability time for your service']
    },
    endTime:{
        type:String,
        required: [true, 'Please provide availability time for your service']
    },
    category:{
        type: String,
        required: [true, 'Please provide your work category'],
    },
    fixedSalary:{
        type: Number,
        min: 100,
        max: 99999999,
    },
    salaryFrom:{
        type: Number,
        min: 100,
        max: 99999999,
    },
    salaryTo:{
        type: Number,
        min: 100,
        max: 99999999,
    },
    ratings:{
        type: Number,
        default: 0,
    },
    image:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    active:{
        type: Boolean,
        default: true
    },
    postedOn:{
        type: Date,
        default: Date.now
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }
})

export const Work = mongoose.model('work', workSchema)