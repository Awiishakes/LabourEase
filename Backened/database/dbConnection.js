import mongoose from 'mongoose'


export const dbConnection = () =>{
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log('Database is connected')
    }).catch((err)=>{
        console.log(`Some error occured while connecting Database: ${err}`)
    })
}